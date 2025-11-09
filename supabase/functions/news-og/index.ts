import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const newsId = pathParts[pathParts.length - 1];
    
    console.log('Generating OG tags for news ID:', newsId);

    // 初始化 Supabase 客戶端
    const supabase = createClient(
      'https://mkllbwsxvkcacyztgsgv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbGxid3N4dmtjYWN5enRnc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjczNjksImV4cCI6MjA3MDI0MzM2OX0.j8IQZIgsGqTFZ8L-MgELv6J_MBoNEf1zgZPL6PERWoA'
    );

    // 從資料庫獲取新聞資料
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', newsId)
      .single();

    if (error || !news) {
      console.error('News not found:', error);
      // 返回預設的 OG 標籤
      return generateDefaultHTML(newsId);
    }

    console.log('Found news:', news.title);

    const title = `${news.title} - GameCF`;
    const description = news.excerpt || news.content?.substring(0, 160) || '掌握數位遊戲群眾集資的最新動態';
    const image = news.featured_image || 'https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png';
    const newsUrl = `https://gamecf.lovableproject.com/news/${newsId}`;

    const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${newsUrl}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${newsUrl}" />
  <meta property="article:published_time" content="${news.published_at}" />
  <meta property="article:author" content="${escapeHtml(news.author || 'GameCF')}" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />

  <script>
    (function(){
      var isBot = /facebookexternalhit|Facebot|Twitterbot|Slackbot|LinkedInBot|Baiduspider|Pinterest|Googlebot/i.test(navigator.userAgent);
      if (!isBot) {
        window.location.replace('/?path=' + encodeURIComponent('/news'));
      }
    })();
  </script>
</head>
<body>
  <article>
    <h1>${escapeHtml(news.title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p>作者：${escapeHtml(news.author || '未知')}</p>
    <p>發布日期：${new Date(news.published_at).toLocaleDateString('zh-TW')}</p>
  </article>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 快取 1 小時
      },
    });
  } catch (error) {
    console.error('Error generating news OG tags:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function generateDefaultHTML(newsId: string): Response {
  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>新聞內容 - GameCF</title>
  <meta name="description" content="掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察" />
  
  <meta property="og:type" content="article" />
  <meta property="og:title" content="新聞內容 - GameCF" />
  <meta property="og:description" content="掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察" />
  <meta property="og:image" content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png" />
  
  <meta name="twitter:card" content="summary_large_image" />

  <script>
    (function(){
      var isBot = /facebookexternalhit|Facebot|Twitterbot|Slackbot|LinkedInBot|Baiduspider|Pinterest|Googlebot/i.test(navigator.userAgent);
      if (!isBot) {
        window.location.replace('/?path=' + encodeURIComponent('/news'));
      }
    })();
  </script>
</head>
<body>
  <h1>新聞內容 - GameCF</h1>
  <p>掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
