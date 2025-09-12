import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    amount: `${caseItem.currency || 'USD'} ${caseItem.amount.toLocaleString()}`,
    target: `${caseItem.currency || 'USD'} ${caseItem.target.toLocaleString()}`,
    success_rate: `${caseItem.success_rate}%`,
    backers: caseItem.backers,
    platform: "群眾集資",
    category: caseItem.game_type || "遊戲專案",
    country: "未知",
    launch_date: caseItem.project_year ? caseItem.project_year.toString() : new Date(caseItem.created_at).getFullYear().toString(),
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
    project_url: caseItem.project_url,
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
      project_url: "https://www.kickstarter.com/projects/iga/bloodstained-ritual-of-the-night",
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
            經典案例
          </h1>
        </div>

        {/* 集資專案案例 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold"></h2>
            <div className="text-sm text-muted-foreground">
              共 {featuredCases.length} 個專案
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCases.map((caseItem) => (
              <Card key={caseItem.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {caseItem.image_url ? (
                    <img 
                      src={caseItem.image_url} 
                      alt={`${caseItem.name} 專案圖片`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Award className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {caseItem.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-background/80">
                      <Calendar className="h-3 w-3 mr-1" />
                      {caseItem.launch_date}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl line-clamp-1">{caseItem.name}</CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-2">{caseItem.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-lg font-bold text-primary flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {caseItem.amount}
                      </div>
                      <div className="text-xs text-muted-foreground">最終金額</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/5 rounded-lg">
                      <div className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {caseItem.success_rate}
                      </div>
                      <div className="text-xs text-muted-foreground">達成率</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        {typeof caseItem.backers === 'number' ? caseItem.backers.toLocaleString() : caseItem.backers}
                      </div>
                      <div className="text-xs text-muted-foreground">支持者</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold">{caseItem.target}</div>
                      <div className="text-xs text-muted-foreground">目標金額</div>
                    </div>
                  </div>
                  
                  {caseItem.project_url ? (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={caseItem.project_url} target="_blank" rel="noopener noreferrer">
                        查看專案
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      查看專案
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
                          查看專案
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
      <Footer />
    </div>
  );
};

export default Cases;