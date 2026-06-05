import assert from 'node:assert/strict';

import {
  parseCampfireCandidates,
  parseKicktraqCandidates,
} from './fetch-sources.mjs';

const kicktraqHtml = `
  <div class="project">
    <div class="project-image">
      <img
        src="/thumbs/projects/example-low.jpg"
        srcset="/thumbs/projects/example-low.jpg 320w, /big/projects/example-high.jpg 1024w"
        alt="Example"
      >
    </div>
    <h2><a href="/projects/example/high-res-game/">High Res Game</a></h2>
    <div>A pixel art video game.</div>
    <div class="project-details">
      Funding: $1,000 of $5,000 (20% funded) Backers: 25 Campaign Dates: Jan 1 - Feb 1 Time left: 7 days
    </div>
  </div>
`;

const campfireHtml = `
  <article class="project-card">
    <a href="/projects/123456/view">
      <img
        data-src="https://static.camp-fire.jp/uploads/project/image/123456/high-cover.jpg"
        src="https://static.camp-fire.jp/assets/placeholder.png"
        alt="LAST JOB"
      >
      <h3>ゾンビ×超能力 サバイバルADVゲーム『LAST JOB』を届けたい！</h3>
      <p>2%</p>
      <p>現在 76,500 円</p>
      <p>支援者 8 人</p>
    </a>
  </article>
`;

const kicktraqCandidates = parseKicktraqCandidates(
  kicktraqHtml,
  'https://www.kicktraq.com/categories/games/video%20games/',
);

assert.equal(kicktraqCandidates.length, 1);
assert.equal(
  kicktraqCandidates[0].image_url,
  'https://www.kicktraq.com/big/projects/example-high.jpg',
);

const campfireCandidates = parseCampfireCandidates(
  campfireHtml,
  'https://camp-fire.jp/projects/search?category=game&page=1',
);

assert.equal(campfireCandidates.length, 1);
assert.equal(
  campfireCandidates[0].image_url,
  'https://static.camp-fire.jp/uploads/project/image/123456/high-cover.jpg',
);
assert.equal(
  campfireCandidates[0].title,
  'ゾンビ×超能力 サバイバルADVゲーム『LAST JOB』を届けたい！',
);

console.log('image parsing checks passed');
