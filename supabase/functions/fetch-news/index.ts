import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: '請提供網址' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching URL:', url);
    
    // 獲取網頁內容
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // 簡單的HTML解析來提取內容
    const extractTitle = (html: string) => {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return titleMatch ? titleMatch[1].trim() : '';
    };

    const extractMetaContent = (html: string, property: string) => {
      const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1].trim() : '';
    };

    const extractDescription = (html: string) => {
      // 嘗試從meta標籤提取描述
      let description = extractMetaContent(html, 'description') || 
                       extractMetaContent(html, 'og:description');
      
      if (!description) {
        // 如果沒有meta描述，嘗試提取第一段文字
        const paragraphMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
        description = paragraphMatch ? paragraphMatch[1].trim().substring(0, 200) + '...' : '';
      }
      
      return description;
    };

    const extractContent = (html: string) => {
      // 移除script和style標籤
      let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      
      // 提取主要文字內容
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        content = bodyMatch[1];
      }
      
      // 移除HTML標籤，保留文字
      content = content.replace(/<[^>]+>/g, ' ');
      content = content.replace(/\s+/g, ' ').trim();
      
      // 限制長度
      return content.substring(0, 1000) + (content.length > 1000 ? '...' : '');
    };

    const extractAuthor = (html: string) => {
      return extractMetaContent(html, 'author') || 
             extractMetaContent(html, 'article:author') || 
             '未知作者';
    };

    const extractCategory = (html: string) => {
      return extractMetaContent(html, 'article:section') || 
             extractMetaContent(html, 'category') || 
             '一般';
    };

    const title = extractTitle(html);
    const excerpt = extractDescription(html);
    const content = extractContent(html);
    const author = extractAuthor(html);
    const category = extractCategory(html);

    const result = {
      title,
      excerpt,
      content,
      author,
      category,
      url
    };

    console.log('Extracted data:', result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: '無法獲取網頁內容: ' + error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});