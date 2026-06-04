import { fetchKickstarterCandidates } from './fetch-sources.mjs';

try {
  const candidates = await fetchKickstarterCandidates({ pages: 1 });

  if (candidates.length === 0) {
    throw new Error('Expected at least one Kickstarter candidate from Kicktraq');
  }

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        count: candidates.length,
        sample: candidates.slice(0, 3).map((candidate) => ({
          title: candidate.title,
          source_url: candidate.source_url,
        })),
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
