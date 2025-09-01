import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import { useCrowdfundingCases } from "@/hooks/useCrowdfundingCases";
import { useGameShowcases } from "@/hooks/useGameShowcases";

const Cases = () => {
  console.log('Cases component rendered');
  const { data: crowdfundingCases = [], isLoading } = useCrowdfundingCases();
  const { data: gameShowcases = [], isLoading: gameLoading } = useGameShowcases();
  console.log('Crowdfunding cases data:', crowdfundingCases);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center">載入中...</div>
        </main>
      </div>
    );
  }

  // 使用實際的案例數據，如果沒有則顯示模擬數據
  const featuredCases = crowdfundingCases && crowdfundingCases.length > 0 ? crowdfundingCases.map(caseItem => ({
    id: caseItem.id,
    name: caseItem.name,
    description: caseItem.description,
    amount: `$${caseItem.amount.toLocaleString()}`,
    target: `$${caseItem.target.toLocaleString()}`,
    success_rate: `${caseItem.success_rate}%`,
    backers: caseItem.backers,
    platform: "群眾集資",
    category: "遊戲專案",
    country: "未知",
    launch_date: new Date(caseItem.created_at).getFullYear().toString(),
    highlights: [
      "資金目標成功達成",
      "群眾支持熱烈", 
      "專案執行順利",
      "產品品質優良"
    ],
    key_factors: [
      "明確的產品定位",
      "有效的行銷策略",
      "良好的社群互動", 
      "透明的進度更新"
    ],
    image_url: caseItem.image_url || "/placeholder.svg",
    created_at: caseItem.created_at,
    updated_at: caseItem.updated_at
  })) : [
    {
      id: "demo-1",
      name: "Bloodstained: Ritual of the Night",
      description: "由《惡魔城》系列製作人五十嵐孝司打造的精神續作，結合經典2D動作與現代遊戲設計。",
      amount: "$5,545,991",
      target: "$500,000",
      backers: 64853,
      platform: "Kickstarter",
      category: "動作冒險",
      country: "日本",
      launch_date: "2015-05-11",
      success_rate: "1109%",
      highlights: [
        "製作人知名度極高",
        "展示完整遊戲原型",
        "豐富的回饋選項",
        "定期更新開發進度"
      ],
      key_factors: [
        "強大的IP基礎",
        "專業的開發團隊",
        "完整的市場策略",
        "社群經營得當"
      ],
      image_url: "/placeholder.svg",
      created_at: "2024-01-01",
      updated_at: "2024-01-01"
    }
  ];

  const caseAnalysis = {
    successFactors: [
      {
        title: "強大的IP或品牌基礎",
        description: "知名IP、製作人或前作的成功為新專案帶來天然的關注度"
      },
      {
        title: "完整的遊戲展示",
        description: "提供可玩的Demo或詳細的遊戲畫面，讓支持者看到實際成果"
      },
      {
        title: "合理的資金目標",
        description: "設定符合實際需求但又不會嚇跑支持者的集資目標"
      },
      {
        title: "豐富的回饋選項",
        description: "提供多樣化的回饋內容，滿足不同預算的支持者需求"
      },
      {
        title: "積極的社群經營",
        description: "定期更新進度，與支持者保持良好互動"
      },
      {
        title: "有效的行銷策略",
        description: "善用媒體、社群平台和KOL進行宣傳"
      }
    ],
    commonMistakes: [
      "資金目標設定過高",
      "遊戲展示不夠完整",
      "回饋選項缺乏吸引力",
      "缺乏定期更新",
      "行銷策略不當",
      "開發時程過於樂觀"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            成功案例
            <span className="text-primary">
              深度解析
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            研究知名群眾集資遊戲專案的成功秘訣，學習最佳實務與策略
          </p>
        </div>

        {/* 精選案例 */}
        <div className="space-y-8 mb-12">
          {featuredCases.slice(0, 3).map((caseItem) => (
            <Card key={caseItem.id} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">{caseItem.platform}</Badge>
                      <Badge variant="secondary">{caseItem.category}</Badge>
                      <Badge variant="outline">{caseItem.country}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{caseItem.name}</CardTitle>
                    <p className="text-muted-foreground">{caseItem.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{caseItem.amount}</div>
                        <div className="text-xs text-muted-foreground">最終金額</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{caseItem.success_rate}</div>
                        <div className="text-xs text-muted-foreground">達成率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{typeof caseItem.backers === 'number' ? caseItem.backers.toLocaleString() : caseItem.backers}</div>
                        <div className="text-xs text-muted-foreground">支持者</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{caseItem.target}</div>
                        <div className="text-xs text-muted-foreground">目標金額</div>
                      </div>
                    </div>

                  </CardContent>
                </div>
                <div className="flex items-center justify-center bg-muted/30 p-8">
                  <div className="text-center">
                    <div className="w-48 h-32 bg-muted rounded-lg mb-4 overflow-hidden">
                      {caseItem.image_url ? (
                        <img 
                          src={caseItem.image_url} 
                          alt={`${caseItem.name} 專案圖片`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          專案圖片
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      查看詳細案例
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 遊戲內呈現案例 */}
        {gameShowcases && gameShowcases.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">遊戲內呈現案例</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameShowcases.map((showcase) => (
                <Card key={showcase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {showcase.image_url ? (
                      <img 
                        src={showcase.image_url} 
                        alt={`${showcase.name} 遊戲截圖`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        遊戲截圖
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{showcase.name}</CardTitle>
                    <p className="text-muted-foreground line-clamp-3">{showcase.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {showcase.game_url && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={showcase.game_url} target="_blank" rel="noopener noreferrer">
                          查看遊戲
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}


      </main>
    </div>
  );
};

export default Cases;