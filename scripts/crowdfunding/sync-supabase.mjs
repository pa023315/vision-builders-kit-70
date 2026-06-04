import { createClient } from '@supabase/supabase-js';

import {
  classifyProject,
  resolveEffectiveClassification,
} from './classifier.mjs';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

export function createServiceClient() {
  return createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export async function createFetchRun(
  supabase,
  { source, pages_requested = 0, metadata = {} },
) {
  const { data, error } = await supabase
    .from('crowdfunding_fetch_runs')
    .insert({
      source,
      pages_requested,
      metadata,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function finishFetchRun(supabase, runId, updates = {}) {
  const { data, error } = await supabase
    .from('crowdfunding_fetch_runs')
    .update({
      ...updates,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function countByEffectiveClassification(rows) {
  return rows.reduce(
    (counts, row) => {
      const effective = resolveEffectiveClassification(row);
      counts[`${effective}_count`] += 1;
      return counts;
    },
    {
      approved_count: 0,
      review_count: 0,
      rejected_count: 0,
    },
  );
}

async function fetchExistingRows(supabase, candidates) {
  const rows = new Map();
  const byPlatform = candidates.reduce((groups, candidate) => {
    const list = groups.get(candidate.platform) ?? [];
    list.push(candidate.source_url);
    groups.set(candidate.platform, list);
    return groups;
  }, new Map());

  for (const [platform, sourceUrls] of byPlatform.entries()) {
    const uniqueSourceUrls = [...new Set(sourceUrls)];
    const { data, error } = await supabase
      .from('crowdfunding_tracked_projects')
      .select(
        'id,platform,source_url,manual_classification,ignore_forever,admin_note,auto_classification',
      )
      .eq('platform', platform)
      .in('source_url', uniqueSourceUrls);

    if (error) {
      throw error;
    }

    for (const row of data ?? []) {
      rows.set(`${row.platform}\n${row.source_url}`, row);
    }
  }

  return rows;
}

function buildUpsertRow(candidate, existingRow) {
  const classification = classifyProject(candidate);
  const effective_classification = resolveEffectiveClassification({
    ...classification,
    manual_classification: existingRow?.manual_classification,
    ignore_forever: existingRow?.ignore_forever,
  });

  return {
    platform: candidate.platform,
    source_url: candidate.source_url,
    title: candidate.title,
    description: candidate.description ?? '',
    image_url: candidate.image_url ?? null,
    currency: candidate.currency ?? null,
    pledged_amount: candidate.pledged_amount ?? 0,
    goal_amount: candidate.goal_amount ?? 0,
    percent_funded: candidate.percent_funded ?? 0,
    backer_count: candidate.backer_count ?? 0,
    project_status: candidate.project_status ?? 'unknown',
    auto_classification: classification.auto_classification,
    effective_classification,
    confidence: classification.confidence,
    classification_reasons: classification.classification_reasons,
    raw_payload: {
      ...(candidate.raw_payload ?? {}),
      raw_text: candidate.raw_text ?? '',
    },
    last_seen_at: new Date().toISOString(),
    last_fetched_at: new Date().toISOString(),
  };
}

export async function syncCandidates(supabase, candidates) {
  if (candidates.length === 0) {
    return {
      candidates_found: 0,
      created_count: 0,
      updated_count: 0,
      approved_count: 0,
      review_count: 0,
      rejected_count: 0,
    };
  }

  const existingRows = await fetchExistingRows(supabase, candidates);
  const upsertRows = candidates.map((candidate) =>
    buildUpsertRow(
      candidate,
      existingRows.get(`${candidate.platform}\n${candidate.source_url}`),
    ),
  );

  const { error } = await supabase
    .from('crowdfunding_tracked_projects')
    .upsert(upsertRows, { onConflict: 'platform,source_url' });

  if (error) {
    throw error;
  }

  const counts = countByEffectiveClassification(upsertRows);

  return {
    candidates_found: candidates.length,
    created_count: upsertRows.filter(
      (row) => !existingRows.has(`${row.platform}\n${row.source_url}`),
    ).length,
    updated_count: upsertRows.filter((row) =>
      existingRows.has(`${row.platform}\n${row.source_url}`),
    ).length,
    ...counts,
  };
}
