import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Users, 
  MessageCircle,
  Lightbulb,
  Target
} from "lucide-react";

const Resources = () => {
  const resourceCategories = [
    {
      title: "新手指南",
      icon: BookOpen,
      description: "群眾集資入門必讀",
      color: "text-blue-600",
      resources: [
        {
          title: "群眾集資完全攻略",
          type: "PDF指南",
          description: "從策劃到執行的完整指南，包含實際案例分析",
          link: "#",
          isExternal: false
        },
        {
          title: "平台選擇比較表",
          type: "比較工具",
          description: "台灣與國際主要平台的詳細比較分析",
          link: "#",
          isExternal: false
        },
        {
          title: "資金規劃計算器",
          type: "線上工具",
          description: "協助計算合理的集資目標與成本分析",
          link: "#",
          isExternal: false
        }
      ]
    },
    {
      title: "教學影片",
      icon: Video,
      description: "專家經驗分享",
      color: "text-red-600",
      resources: [
        {
          title: "群眾集資策劃工作坊",
          type: "線上課程",
          description: "6小時完整課程，涵蓋策劃、行銷、執行",
          link: "#",
          isExternal: true
        },
        {
          title: "成功開發者訪談系列",
          type: "訪談影片",
          description: "與成功開發者的深度對談，分享實戰經驗",
          link: "#",
          isExternal: true
        },
        {
          title: "平台操作教學",
          type: "教學影片",
          description: "各大平台的詳細操作流程說明",
          link: "#",
          isExternal: false
        }
      ]
    },
    {
      title: "範本工具",
      icon: FileText,
      description: "實用文件範本",
      color: "text-green-600",
      resources: [
        {
          title: "專案企劃書範本",
          type: "Word範本",
          description: "標準化的專案企劃書格式與範例",
          link: "#",
          isExternal: false
        },
        {
          title: "預算規劃表",
          type: "Excel範本",
          description: "詳細的成本分析與預算規劃工具",
          link: "#",
          isExternal: false
        },
        {
          title: "行銷時程表",
          type: "項目管理",
          description: "群眾集資行銷活動的時程規劃範本",
          link: "#",
          isExternal: false
        }
      ]
    },
    {
      title: "社群資源",
      icon: Users,
      description: "開發者交流平台",
      color: "text-purple-600",
      resources: [
        {
          title: "台灣遊戲開發者社群",
          type: "Discord群組",
          description: "與其他開發者交流經驗、尋求建議",
          link: "#",
          isExternal: true
        },
        {
          title: "群眾集資經驗分享區",
          type: "論壇",
          description: "專門討論群眾集資的社群平台",
          link: "#",
          isExternal: true
        },
        {
          title: "每月線上聚會",
          type: "活動",
          description: "定期舉辦的線上交流會與工作坊",
          link: "#",
          isExternal: false
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
    { name: "嘖嘖官網", url: "#", category: "平台" },
    { name: "FlyingV官網", url: "#", category: "平台" },
    { name: "Kickstarter", url: "#", category: "平台" },
    { name: "Indiegogo", url: "#", category: "平台" },
    { name: "台灣遊戲產業振興會", url: "#", category: "組織" },
    { name: "獨立遊戲開發者協會", url: "#", category: "組織" },
    { name: "遊戲產業研究報告", url: "#", category: "研究" },
    { name: "群眾集資法規指南", url: "#", category: "法規" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            資源與
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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

        {/* 資源分類 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {resourceCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <category.icon className={`h-5 w-5 mr-2 ${category.color}`} />
                  {category.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                        <Badge variant="outline" className="text-xs mt-2">
                          {resource.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        {resource.isExternal ? (
                          <ExternalLink className="h-4 w-4" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快速連結 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-primary" />
              快速連結
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <div key={index} className="group">
                  <div className="text-xs text-muted-foreground mb-1">{link.category}</div>
                  <Button variant="outline" size="sm" className="w-full justify-start group-hover:border-primary">
                    {link.name}
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 聯絡與支援 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-primary" />
              需要協助？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <MessageCircle className="h-6 w-6 mb-2" />
                <span className="font-medium">線上諮詢</span>
                <span className="text-xs text-muted-foreground">即時回答您的問題</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Users className="h-6 w-6 mb-2" />
                <span className="font-medium">加入社群</span>
                <span className="text-xs text-muted-foreground">與其他開發者交流</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Target className="h-6 w-6 mb-2" />
                <span className="font-medium">專家諮詢</span>
                <span className="text-xs text-muted-foreground">一對一專業建議</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Resources;