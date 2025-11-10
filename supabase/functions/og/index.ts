const BOT_RE = /(bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|facebot)/i;

Deno.serve(async (req: Request) => {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const isBot = BOT_RE.test(ua);
  const url = new URL(req.url);
  
  // Parse path: /functions/v1/og/taiwan-data
  const parts = url.pathname.split('/').filter(Boolean);
  const i = parts.findIndex(p => p === 'og');
  const section = parts[i + 1] || '';

  console.log(`OG Function called - Path: ${url.pathname}, Section: ${section}, Bot: ${isBot}, UA: ${ua}`);

  // Define page metadata based on section
  let page;
  switch (section) {
    case 'taiwan-data':
      page = {
        title: '台灣數位遊戲群眾集資數據 - GameCF',
        desc: 'GameCF 蒐整台灣數位遊戲募資數據與趨勢洞察。',
        path: '/taiwan-data',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    case 'global-data':
      page = {
        title: '國際數位遊戲群眾集資數據 - GameCF',
        desc: '探索全球數位遊戲群眾集資市場的表現與 Kickstarter 平台數據',
        path: '/global-data',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    case 'news':
      page = {
        title: '新聞與深度報導 - GameCF',
        desc: '掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察',
        path: '/news',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    case 'cases':
      page = {
        title: '經典案例 - GameCF',
        desc: '探索成功的群眾募資遊戲案例，學習專案成功的關鍵因素',
        path: '/cases',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    case 'resources':
      page = {
        title: '資源與工具庫 - GameCF',
        desc: '提供群眾集資所需的各種資源、工具與教學材料',
        path: '/resources',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    case 'about':
      page = {
        title: '關於我們 - GameCF',
        desc: '了解 GameCF 數位遊戲群眾募資資訊站的創立初衷與團隊介紹',
        path: '/about',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
      break;
    default:
      page = {
        title: 'GameCF 數位遊戲群眾募資資訊站',
        desc: '探索台灣與全球數位遊戲群眾募資趨勢',
        path: '/',
        image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png',
      };
  }

  const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${page.title}</title>
<meta name="description" content="${page.desc}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${page.title}" />
<meta property="og:description" content="${page.desc}" />
<meta property="og:url" content="https://gamecf.tw${page.path}" />
<meta property="og:image" content="${page.image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${page.title}" />
<meta name="twitter:description" content="${page.desc}" />
<meta name="twitter:image" content="${page.image}" />
<link rel="canonical" href="https://gamecf.tw${page.path}" />
<meta name="robots" content="index,follow" />
</head>
<body>
${isBot ? '<p>Loading GameCF...</p>' : `<script>location.replace("https://gamecf.tw${page.path}")</script>`}
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'x-bot-detected': String(isBot),
    },
  });
});
