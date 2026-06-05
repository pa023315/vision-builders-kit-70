import {
  fetchCampfireCandidates,
  fetchKickstarterCandidates,
} from './fetch-sources.mjs';
import {
  createFetchRun,
  createServiceClient,
  finishFetchRun,
  syncCandidates,
} from './sync-supabase.mjs';

const pages = Number.parseInt(
  process.env.CROWDFUNDING_TRACKER_PAGES ?? '3',
  10,
);

const sources = [
  {
    source: 'kickstarter',
    fetchCandidates: () => fetchKickstarterCandidates({ pages }),
  },
  {
    source: 'campfire',
    fetchCandidates: () => fetchCampfireCandidates({ pages }),
  },
];

const supabase = createServiceClient();
let successCount = 0;
const results = [];

function formatError(error) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object') {
    const details = [
      error.message,
      error.code ? `code: ${error.code}` : null,
      error.details ? `details: ${error.details}` : null,
      error.hint ? `hint: ${error.hint}` : null,
    ].filter(Boolean);

    if (details.length > 0) {
      return details.join(' | ');
    }

    return JSON.stringify(error);
  }

  return String(error);
}

for (const { source, fetchCandidates } of sources) {
  let run;

  try {
    run = await createFetchRun(supabase, {
      source,
      pages_requested: pages,
      metadata: { pages },
    });

    const candidates = await fetchCandidates();
    const syncResult = await syncCandidates(supabase, candidates);
    const finishedRun = await finishFetchRun(supabase, run.id, {
      status: 'success',
      ...syncResult,
    });

    successCount += 1;
    results.push({ source, status: 'success', run_id: finishedRun.id });
  } catch (error) {
    const errorMessage = formatError(error);

    if (run?.id) {
      await finishFetchRun(supabase, run.id, {
        status: 'failed',
        error_message: errorMessage,
      });
    }

    results.push({ source, status: 'failed', error: errorMessage });
  }
}

console.log(
  JSON.stringify(
    {
      status: successCount > 0 ? 'ok' : 'failed',
      pages,
      results,
    },
    null,
    2,
  ),
);

if (successCount === 0) {
  process.exit(1);
}
