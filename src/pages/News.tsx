import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, ExternalLink, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useNews } from "@/hooks/useNews";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  
  const { data: news = [] } = useNews();

  // Get unique categories from news data
  const categories = ["全部", ...new Set(news.map(item => item.category))];

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

        {/* 搜尋和篩選 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜尋新聞標題或內容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 新聞列表 */}
        <div className="space-y-6">
          {filteredNews.map((news) => (
            <Card key={news.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {news.category}
                      </Badge>
                      {news.url && (
                        <Badge variant="destructive" className="text-xs">
                          外部連結
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {news.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(news.published_at).toLocaleDateString('zh-TW')}
                    </div>
                    <span>作者：{news.author}</span>
                  </div>
                 </div>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                    {news.featured_image && (
                      <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg float-left mr-4 mb-2">
                        <img 
                          src={news.featured_image} 
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground leading-relaxed">
                        {news.excerpt}
                      </p>
                    </div>
                  </div>
                <div className="flex items-center justify-end clear-both pt-4">
                  {news.url ? (
                    <Button 
                      variant="ghost" 
                      className="group/btn"
                      onClick={() => window.open(news.url, '_blank', 'noopener,noreferrer')}
                    >
                      查看外部連結
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    </Button>
                  ) : (
                    <Button variant="ghost" className="group/btn">
                      閱讀完整文章
                      <span className="ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 載入更多 */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            載入更多新聞
          </Button>
        </div>
      </main>
    </div>
  );
};

export default News;