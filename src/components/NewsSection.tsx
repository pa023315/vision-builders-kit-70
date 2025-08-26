import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";

const NewsSection = () => {
  const { data: news = [] } = useNews();
  
  // Show latest 8 news items for better grid layout
  const newsItems = news.slice(0, 8);

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            最新資訊與
            <span className="text-primary">
              深度分析
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            掌握數位遊戲群眾集資的最新動態、市場趨勢與成功案例分析
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {newsItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="group overflow-hidden border-0 bg-card/50 hover:bg-card hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.featured_image || "/placeholder.svg"} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* Platform Badge */}
                <Badge 
                  className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground border-0"
                >
                  {item.category || "多平台"}
                </Badge>

                {/* Content Overlay */}
                <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-sm mb-3 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  
                </CardContent>
              </div>
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