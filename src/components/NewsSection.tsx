import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";

const NewsSection = () => {
  const { data: news = [] } = useNews();
  
  // Show latest 4 news items
  const newsItems = news.slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            最新資訊與
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              深度分析
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            掌握數位遊戲群眾集資的最新動態、市場趨勢與成功案例分析
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.published_at).toLocaleDateString('zh-TW')}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {item.excerpt}
                </p>
                {item.url ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                  >
                    查看外部連結
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    閱讀更多
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/news">
            <Button size="lg" variant="outline" className="group">
              查看所有新聞
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;