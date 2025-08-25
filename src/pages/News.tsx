import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useNews } from "@/hooks/useNews";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  
  const { data: news = [] } = useNews();

  // Category tags for filtering
  const categories = ["全部", "知識", "新聞"];

  const filteredNews = news.filter(newsItem => {
    const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsItem.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || newsItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            新聞與
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              深度報導
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            掌握數位遊戲群眾集資的最新動態、深度分析與產業洞察
          </p>
        </div>

        {/* 搜尋欄 */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋新聞標題或內容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 分類篩選標籤 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* 新聞網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filteredNews.map((news, index) => (
            <Card 
              key={news.id} 
              className="group overflow-hidden border-0 bg-card/50 hover:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
              onClick={() => {
                if (news.url) {
                  window.open(news.url, '_blank');
                }
              }}
            >
              <div className="relative">
                {/* 主圖片 */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={news.featured_image || "/placeholder.svg"} 
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* 漸變遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* 分類標籤 */}
                <Badge 
                  className={`absolute top-3 left-3 backdrop-blur-sm border-0 ${
                    news.category === "知識" 
                      ? "bg-primary/90 text-primary-foreground"
                      : "bg-gray-500/90 text-white"
                  }`}
                >
                  {news.category || "新聞"}
                </Badge>

                {/* 內容覆蓋 */}
                <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-sm mb-3 line-clamp-2 leading-tight">
                    {news.title}
                  </h3>
                  
                  {/* 互動統計 */}
                  <div className="flex items-center justify-between text-xs opacity-80">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 100) + 10}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 50) + 5}</span>
                      </div>
                    </div>
                    <div className="text-xs">
                      {new Date(news.published_at).toLocaleDateString('zh-TW', { 
                        month: 'numeric', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  {/* 作者信息 */}
                  <div className="text-xs opacity-60 mt-2">
                    作者：{news.author || "未知作者"}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>


        {/* 載入更多 */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            載入更多新聞
            <span className="ml-2 transition-transform group-hover:translate-y-1">↓</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default News;