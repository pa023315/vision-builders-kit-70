const KICKTRAQ_BASE_URL =
  'https://www.kicktraq.com/categories/games/video%20games/';
const CAMPFIRE_BASE_URL =
  'https://camp-fire.jp/projects/search?category=game&page=';

const FETCH_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (compatible; VisionBuildersCrowdfundingTracker/1.0)',
};

function assertNoCloudflareChallenge(html, url) {
  if (
    html.includes('Just a moment...') &&
    html.includes('challenges.cloudflare.com')
  ) {
    throw new Error(`Cloudflare challenge detected for ${url}`);
  }
}

async function fetchHtml(url) {
  let response;
  try {
    response = await fetch(url, { headers: FETCH_HEADERS });
  } catch (error) {
    const cause = error?.cause;
    const detail = cause?.code ?? cause?.message ?? error.message;
    throw new Error(`Fetch failed for ${url}: ${detail}`);
  }

  const html = await response.text();

  assertNoCloudflareChallenge(html, url);

  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`);
  }

  return html;
}

function buildKicktraqUrl(page) {
  const url = new URL(KICKTRAQ_BASE_URL);
  if (page > 1) {
    url.searchParams.set('page', String(page));
  }
  return url.toString();
}

function cleanText(text = '') {
  return decodeHtml(text)
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.:%)])/g, '$1')
    .trim();
}

function decodeHtml(text = '') {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );
}

function stripTags(html = '') {
  return cleanText(html.replace(/<[^>]*>/g, ' '));
}

function extractAttribute(html, attribute) {
  const match = html.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'));
  return match ? decodeHtml(match[1]) : undefined;
}

function toAbsoluteUrl(url, baseUrl) {
  if (!url) {
    return undefined;
  }
  return new URL(url, baseUrl).toString();
}

function parseMoneyAmount(value = '') {
  const numeric = value.replace(/[^\d.]/g, '');
  return numeric ? Math.round(Number.parseFloat(numeric)) : 0;
}

function parseFundingLine(detailsText) {
  const match = detailsText.match(
    /Funding:\s*([^\d\s-]*\s?[\d,.]+)\s+of\s+([^\d\s-]*\s?[\d,.]+)\s+\(\s*([\d,.]+)% funded\)/i,
  );

  if (!match) {
    return {
      currency: undefined,
      pledged_amount: 0,
      goal_amount: 0,
      percent_funded: 0,
    };
  }

  const [, pledged, goal, percent] = match;
  const currency = pledged.replace(/[\d,.\s]/g, '') || undefined;

  return {
    currency,
    pledged_amount: parseMoneyAmount(pledged),
    goal_amount: parseMoneyAmount(goal),
    percent_funded: Number.parseFloat(percent.replace(/,/g, '')) || 0,
  };
}

function parseProjectBlocks(html) {
  const starts = [...html.matchAll(/<div class="project(?:\s[^"]*)?">/g)].map(
    (match) => match.index,
  );

  return starts.map((start, index) => {
    const nextStart = starts[index + 1] ?? html.length;
    return html.slice(start, nextStart);
  });
}

export function parseKicktraqCandidates(html, pageUrl = KICKTRAQ_BASE_URL) {
  assertNoCloudflareChallenge(html, pageUrl);

  return parseProjectBlocks(html)
    .map((block) => {
      const titleMatch = block.match(
        /<h2>\s*<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>\s*<\/h2>/is,
      );
      if (!titleMatch) {
        return undefined;
      }

      const sourceUrl = toAbsoluteUrl(titleMatch[1], pageUrl);
      const title = stripTags(titleMatch[2]);
      const imageMatch = block.match(
        /<div class="project-image">[\s\S]*?<img\b[^>]*>/i,
      );
      const imageUrl = imageMatch
        ? toAbsoluteUrl(extractAttribute(imageMatch[0], 'src'), pageUrl)
        : undefined;

      const afterHeading = block.slice(
        block.indexOf(titleMatch[0]) + titleMatch[0].length,
      );
      const descriptionMatch = afterHeading.match(/<div>([\s\S]*?)<\/div>/i);
      const description = descriptionMatch ? stripTags(descriptionMatch[1]) : '';

      const detailsMatch = block.match(
        /<div class="project-details">([\s\S]*?)<\/div>/i,
      );
      const detailsText = detailsMatch ? stripTags(detailsMatch[1]) : '';
      const funding = parseFundingLine(detailsText);
      const backersMatch = detailsText.match(/Backers:\s*([\d,]+)/i);
      const campaignDatesMatch = detailsText.match(
        /Campaign Dates:\s*(.*?)(?: Time left:|$)/i,
      );
      const timeLeftMatch = detailsText.match(/Time left:\s*(.*?)$/i);
      const detailTextForClassifier = detailsText
        .replace(/Campaign Dates:\s*.*?(?= Time left:|$)/i, '')
        .replace(/Time left:\s*.*$/i, '')
        .trim();

      return {
        platform: 'kickstarter',
        source_url: sourceUrl,
        title,
        description,
        image_url: imageUrl,
        currency: funding.currency,
        pledged_amount: funding.pledged_amount,
        goal_amount: funding.goal_amount,
        percent_funded: funding.percent_funded,
        backer_count: backersMatch
          ? Number.parseInt(backersMatch[1].replace(/,/g, ''), 10)
          : 0,
        project_status: 'active',
        raw_text: cleanText([title, description, detailTextForClassifier].join(' ')),
        raw_payload: {
          source: 'kicktraq',
          campaign_dates: campaignDatesMatch
            ? cleanText(campaignDatesMatch[1])
            : undefined,
          time_left: timeLeftMatch ? cleanText(timeLeftMatch[1]) : undefined,
          kicktraq_url: sourceUrl,
        },
      };
    })
    .filter(Boolean);
}

export async function fetchKickstarterCandidates({ pages = 3 } = {}) {
  const allCandidates = [];

  for (let page = 1; page <= pages; page += 1) {
    const pageUrl = buildKicktraqUrl(page);
    const html = await fetchHtml(pageUrl);
    allCandidates.push(...parseKicktraqCandidates(html, pageUrl));
  }

  return allCandidates;
}

export function parseCampfireCandidates(html, pageUrl) {
  assertNoCloudflareChallenge(html, pageUrl);

  const seen = new Set();
  const candidates = [];
  const linkPattern = /<a\b[^>]+href=["']([^"']*\/projects\/\d+[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(linkPattern)) {
    const sourceUrl = toAbsoluteUrl(match[1], pageUrl);
    const title = stripTags(match[2]);

    if (!title || seen.has(sourceUrl)) {
      continue;
    }

    seen.add(sourceUrl);
    const stats = parseCampfireListStats(title);

    candidates.push({
      platform: 'campfire',
      source_url: sourceUrl,
      title: stats.title,
      description: '',
      image_url: undefined,
      currency: 'JPY',
      pledged_amount: stats.pledged_amount,
      goal_amount: stats.goal_amount,
      percent_funded: stats.percent_funded,
      backer_count: stats.backer_count,
      project_status: 'active',
      raw_text: stats.title,
      raw_payload: {
        source: 'campfire',
        page_url: pageUrl,
        list_text: title,
      },
    });
  }

  return candidates;
}

function parseCampfireListStats(text) {
  const percentMatch = text.match(/([\d,]+)%/);
  const pledgedMatch = text.match(/現在\s*([\d,]+)\s*円/);
  const backersMatch = text.match(/支援者\s*([\d,]+)\s*人/);
  const percent_funded = percentMatch
    ? Number.parseInt(percentMatch[1].replace(/,/g, ''), 10)
    : 0;
  const pledged_amount = pledgedMatch
    ? Number.parseInt(pledgedMatch[1].replace(/,/g, ''), 10)
    : 0;
  const backer_count = backersMatch
    ? Number.parseInt(backersMatch[1].replace(/,/g, ''), 10)
    : 0;
  const goal_amount =
    pledged_amount > 0 && percent_funded > 0
      ? Math.round((pledged_amount / percent_funded) * 100)
      : 0;
  const title = cleanText(text.replace(/\s+[\d,]+%[\s\S]*$/, ''));

  return {
    title,
    pledged_amount,
    goal_amount,
    percent_funded,
    backer_count,
  };
}

export async function fetchCampfireCandidates({ pages = 3 } = {}) {
  const allCandidates = [];

  for (let page = 1; page <= pages; page += 1) {
    const pageUrl = `${CAMPFIRE_BASE_URL}${page}`;
    const html = await fetchHtml(pageUrl);
    allCandidates.push(...parseCampfireCandidates(html, pageUrl));
  }

  return allCandidates;
}
