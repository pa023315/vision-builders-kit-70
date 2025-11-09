import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
          title: "專案企劃書指南",
          description: "標準化的專案企劃書格式與範例",
          url: "https://pa023315.com/game-crowdfunding-plan-writing-guide/"
        },
        {
          title: "預算規劃表",
          description: "詳細的成本分析與預算規劃工具",
          url: "https://pa023315.com/game-crowdfunding-cost-guide/"
        },
        {
          title: "準備流程表",
          description: "群眾集資專案的準備流程規劃範本",
          url: "https://pa023315.com/game-crowdfunding-prep-checklist/"
        }
      ]
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
    { name: "Wadiz", url: "https://www.wadiz.kr/home", category: "平台" },
    { name: "Tumblbug", url: "https://tumblbug.com/", category: "平台" },
    { name: "Ulule", url: "https://www.ulule.com/", category: "平台" },
    { name: "Fig", url: "https://republic.com/fig", category: "平台" },
    { name: "BackerKit", url: "https://www.backerkit.com/", category: "平台" },
    { name: "Gamefound", url: "https://gamefound.com/en", category: "平台" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>資源與工具庫 - GameCF</title>
        <meta property="og:title" content="資源與工具庫 - GameCF" />
        <meta property="og:description" content="提供群眾集資所需的各種資源、工具與教學材料" />
        <meta property="og:image" content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png" />
      </Helmet>
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
                <Card key={idx} className="border hover:shadow-md transition-shadow cursor-pointer">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <FileText className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </CardContent>
                  </a>
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
                <Card key={idx} className="border hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                  <a href={guide.url} target="_blank" rel="noopener noreferrer" className="block">
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
                      <div className="flex items-center mb-4">
                        {!guide.image_url && <BookOpen className="h-10 w-10 text-blue-600" />}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">{guide.name}</h3>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </CardContent>
                  </a>
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

      </main>
      <Footer />
    </div>
  );
};

export default Resources;