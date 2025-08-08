import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const newsItems = [
    {
      id: 1,
      title: "2025年數位遊戲群眾集資趨勢分析報告發布",
      summary: "最新報告顯示台灣數位遊戲群眾集資市場持續成長，平均成功率達68%...",
      date: "2025-01-15",
      category: "市場分析",
      isExternal: false
    },
    {
      id: 2,
      title: "Kickstarter 公布2024年度遊戲類別統計數據",
      summary: "2024年遊戲類別在Kickstarter平台表現亮眼，總集資額突破2億美元...",
      date: "2025-01-10",
      category: "國際動態",
      isExternal: true
    },
    {
      id: 3,
      title: "台灣獨立遊戲開發者訪談：群眾集資成功秘訣",
      summary: "專訪三位成功透過群眾集資的台灣遊戲開發者，分享他們的經驗與心得...",
      date: "2025-01-08",
      category: "專訪",
      isExternal: false
    },
    {
      id: 4,
      title: "群眾集資平台比較：台灣 vs 國際平台優劣分析",
      summary: "深入比較嘖嘖、FlyingV與Kickstarter等平台的特色與適用性...",
      date: "2025-01-05",
      category: "平台分析",
      isExternal: false
    }
  ];

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
                    {new Date(item.date).toLocaleDateString('zh-TW')}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {item.summary}
                </p>
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  閱讀更多
                  {item.isExternal ? (
                    <ExternalLink className="ml-1 h-3 w-3" />
                  ) : (
                    <ArrowRight className="ml-1 h-3 w-3" />
                  )}
                </Button>
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