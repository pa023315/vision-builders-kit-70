import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  MessageCircle,
  Lightbulb,
  Target,
  Mail
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Resources = () => {
  const { data: beginnerGuides } = useQuery({
    queryKey: ['beginner-guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beginner_guides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const resourceCategories = [
    {
      title: "新手指南",
      icon: BookOpen,
      description: "群眾集資入門必讀",
      color: "text-blue-600",
      resources: beginnerGuides || []
    },
    {
      title: "範本工具",
      icon: FileText,
      description: "實用文件範本",
      color: "text-primary",
      resources: [
        {
          title: "專案企劃書範本",
          description: "標準化的專案企劃書格式與範例",
          url: "#"
        },
        {
          title: "預算規劃表",
          description: "詳細的成本分析與預算規劃工具",
          url: "#"
        },
        {
          title: "準備流程表",
          description: "群眾集資專案的準備流程規劃範本",
          url: "https://pa023315.com/game-crowdfunding-prep-checklist/"
        }
      ]
    }
  ];

  const featuredTools = [
    {
      name: "集資目標計算器",
      description: "根據遊戲類型、開發規模等因素，計算合理的集資目標",
      features: ["成本分析", "風險評估", "回饋設計建議"],
      status: "免費使用"
    },
    {
      name: "行銷時程規劃器",
      description: "為群眾集資專案制定詳細的行銷時程與檢查點",
      features: ["時程管理", "任務提醒", "進度追蹤"],
      status: "免費使用"
    },
    {
      name: "回饋選項建議工具",
      description: "基於類似專案數據，建議最適合的回饋選項與定價",
      features: ["定價建議", "回饋分析", "競品比較"],
      status: "付費工具"
    }
  ];

  const quickLinks = [
    { name: "FlyingV", url: "https://www.flyingv.cc/", category: "平台" },
    { name: "嘖嘖", url: "https://www.zeczec.com/", category: "平台" },
    { name: "挖貝 Wabay", url: "https://wabay.tw/", category: "平台" },
    { name: "Pinkoi", url: "https://www.pinkoi.com/topic/crowdfunding", category: "平台" },
    { name: "度度客", url: "https://dodoker.com/", category: "平台" },
    { name: "Kickstarter", url: "https://www.kickstarter.com/", category: "平台" },
    { name: "Indiegogo", url: "https://www.indiegogo.com/", category: "平台" },
    { name: "gofundme", url: "https://www.gofundme.com/", category: "平台" },
    { name: "makuake", url: "https://www.makuake.com/", category: "平台" },
    { name: "Campfire", url: "https://camp-fire.jp/", category: "平台" },
    { name: "ubgoe", url: "https://ubgoe.com/", category: "平台" },
    { name: "GREEN FUNDING", url: "https://greenfunding.jp/", category: "平台" },
    { name: "摩點", url: "https://www.modian.com/", category: "平台" },
    { name: "readyfor", url: "https://readyfor.jp/", category: "平台" },
    { name: "Wadiz", url: "https://www.wadiz.kr/home", category: "平台" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            資源與
            <span className="text-primary">
              工具庫
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            提供群眾集資所需的各種資源、工具與教學材料
          </p>
        </div>

        {/* 精選工具 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              精選實用工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTools.map((tool, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <Badge variant={tool.status === "免費使用" ? "secondary" : "default"}>
                        {tool.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      開始使用
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 範本工具 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              範本工具
            </CardTitle>
            <p className="text-sm text-muted-foreground">實用文件範本</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceCategories
                .find(cat => cat.title === "範本工具")
                ?.resources.map((resource, idx) => (
                <Card key={idx} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-10 w-10 text-primary" />
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 新手指南 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              新手指南
            </CardTitle>
            <p className="text-sm text-muted-foreground">群眾集資入門必讀</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beginnerGuides?.map((guide, idx) => (
                <Card key={idx} className="border hover:shadow-md transition-shadow overflow-hidden">
                  {guide.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={guide.image_url} 
                        alt={guide.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {!guide.image_url && <BookOpen className="h-10 w-10 text-blue-600" />}
                      <Button variant="ghost" size="sm" asChild className="ml-auto">
                        <a href={guide.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{guide.name}</h3>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 全球知名群眾募資平台 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-primary" />
              全球知名群眾募資平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickLinks.map((link, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="justify-start group-hover:border-primary h-auto p-3"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <span className="truncate">{link.name}</span>
                    <ExternalLink className="ml-auto h-3 w-3 flex-shrink-0" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 專家諮詢 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              專家諮詢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">需要專業建議？</h3>
              <p className="text-muted-foreground mb-4">
                我們的專家團隊隨時為您提供一對一諮詢服務
              </p>
              <Button asChild>
                <a href="mailto:service@pa023315.com">
                  請來信 service@pa023315.com
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Resources;