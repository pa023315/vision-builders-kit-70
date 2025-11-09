import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageMeta {
  title: string;
  description: string;
  image: string;
}

const pageMetadata: Record<string, PageMeta> = {
  '/': {
    title: 'GameCF 數位遊戲群眾募資資訊站',
    description: '探索台灣與全球數位遊戲群眾募資趨勢',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/taiwan-data': {
    title: '台灣數位遊戲群眾集資數據 - GameCF',
    description: '深入了解台灣數位遊戲群眾集資市場的表現與趨勢',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/global-data': {
    title: '國際數位遊戲群眾集資數據 - GameCF',
    description: '探索全球數位遊戲群眾集資市場的表現與 Kickstarter 平台數據',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/news': {
    title: '新聞與深度報導 - GameCF',
    description: '掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/cases': {
    title: '經典案例 - GameCF',
    description: '探索成功的群眾募資遊戲案例，學習專案成功的關鍵因素',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/resources': {
    title: '資源與工具庫 - GameCF',
    description: '提供群眾集資所需的各種資源、工具與教學材料',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  },
  '/about': {
    title: '關於我們 - GameCF',
    description: '了解 GameCF 數位遊戲群眾募資資訊站的創立初衷與團隊介紹',
    image: 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    
    console.log('Generating OG tags for path:', path);

    const meta = pageMetadata[path] || pageMetadata['/'];

    const html = `<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gamecf.lovableproject.com${path}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://gamecf.lovableproject.com${path}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
    
    <link rel="icon" href="/lovable-uploads/a565a0fc-11ce-4c46-bc85-316fab5f3ddf.png" type="image/png">
  </head>
  <body>
    <h1>${meta.title}</h1>
    <p>${meta.description}</p>
  </body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating OG tags:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
