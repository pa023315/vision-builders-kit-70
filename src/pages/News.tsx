import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, ExternalLink, Search, Filter } from "lucide-react";
import { useState } from "react";

const News = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = ["全部", "市場分析", "國際動態", "專訪", "平台分析", "產業趨勢"];

  const newsItems = [
    {
      id: 1,
      title: "2025年數位遊戲群眾集資趨勢分析報告發布",
      summary: "最新報告顯示台灣數位遊戲群眾集資市場持續成長，平均成功率達68%，較去年同期增長12%。報告指出，RPG類型遊戲最受台灣支持者青睞，佔總集資金額的35%。",
      content: "根據最新發布的2025年數位遊戲群眾集資趨勢分析報告...",
      date: "2025-01-15",
      category: "市場分析",
      isExternal: false,
      author: "台灣遊戲產業振興會",
      readTime: "5 分鐘",
      tags: ["市場分析", "統計報告", "台灣市場"]
    },
    {
      id: 2,
      title: "Kickstarter 公布2024年度遊戲類別統計數據",
      summary: "2024年遊戲類別在Kickstarter平台表現亮眼，總集資額突破2億美元，較2023年成長18%。桌遊數位化趨勢明顯，混合實體與數位體驗的專案成功率最高。",
      content: "Kickstarter官方數據顯示，2024年遊戲類別共有3,245個專案...",
      date: "2025-01-10",
      category: "國際動態",
      isExternal: true,
      author: "Kickstarter Official",
      readTime: "7 分鐘",
      tags: ["Kickstarter", "國際數據", "年度報告"]
    },
    {
      id: 3,
      title: "台灣獨立遊戲開發者訪談：群眾集資成功秘訣",
      summary: "專訪三位成功透過群眾集資的台灣遊戲開發者，分享他們的經驗與心得。從企劃階段到行銷策略，揭露群眾集資成功的關鍵因素。",
      content: "本次專訪邀請到《台灣製造：復古像素RPG》、《島嶼冒險》...",
      date: "2025-01-08",
      category: "專訪",
      isExternal: false,
      author: "遊戲產業媒體",
      readTime: "12 分鐘",
      tags: ["開發者訪談", "成功案例", "經驗分享"]
    },
    {
      id: 4,
      title: "群眾集資平台比較：台灣 vs 國際平台優劣分析",
      summary: "深入比較嘖嘖、FlyingV與Kickstarter等平台的特色與適用性，為遊戲開發者提供平台選擇建議。",
      content: "隨著群眾集資市場日益成熟，選擇適合的平台成為專案成功的關鍵...",
      date: "2025-01-05",
      category: "平台分析",
      isExternal: false,
      author: "產業分析師",
      readTime: "8 分鐘",
      tags: ["平台比較", "策略建議", "市場分析"]
    },
    {
      id: 5,
      title: "元宇宙遊戲群眾集資興起，區塊鏈技術成新趨勢",
      summary: "2024年下半年開始，結合NFT和區塊鏈技術的遊戲專案在群眾集資平台上表現亮眼，但也面臨法規和技術挑戰。",
      content: "隨著Web3技術發展，越來越多遊戲開發者嘗試將區塊鏈元素...",
      date: "2025-01-02",
      category: "產業趨勢",
      isExternal: false,
      author: "區塊鏈遊戲觀察",
      readTime: "10 分鐘",
      tags: ["區塊鏈", "NFT", "Web3遊戲"]
    },
    {
      id: 6,
      title: "COVID-19後遊戲產業復甦，群眾集資扮演關鍵角色",
      summary: "疫情後遊戲產業快速復甦，群眾集資成為中小型工作室重要的資金來源，支持創新遊戲概念的實現。",
      content: "新冠疫情對全球遊戲產業帶來深遠影響，雖然初期造成開發延遲...",
      date: "2024-12-28",
      category: "產業趨勢",
      isExternal: false,
      author: "遊戲產業研究所",
      readTime: "6 分鐘",
      tags: ["產業復甦", "疫情影響", "資金來源"]
    }
  ];

  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || news.category === selectedCategory;
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
                      {news.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {news.isExternal && (
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
                      {new Date(news.date).toLocaleDateString('zh-TW')}
                    </div>
                    <span>{news.readTime}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {news.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    作者：{news.author}
                  </span>
                  <Button variant="ghost" className="group/btn">
                    閱讀完整文章
                    {news.isExternal ? (
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    ) : (
                      <span className="ml-2 transition-transform group-hover/btn:translate-x-1">→</span>
                    )}
                  </Button>
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