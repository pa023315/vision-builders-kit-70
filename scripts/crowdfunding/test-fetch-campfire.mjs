import { fetchCampfireCandidates } from './fetch-sources.mjs';

try {
  const candidates = await fetchCampfireCandidates({ pages: 1 });
  const withImages = candidates.filter((candidate) => candidate.image_url);

  if (candidates.length === 0) {
    throw new Error('Expected at least one CAMPFIRE candidate');
  }

  if (withImages.length === 0) {
    throw new Error('Expected at least one CAMPFIRE candidate image');
  }

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        count: candidates.length,
        image_count: withImages.length,
        sample: withImages.slice(0, 3).map((candidate) => ({
          title: candidate.title,
          source_url: candidate.source_url,
          image_url: candidate.image_url,
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
