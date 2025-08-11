import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Globe, Award, BarChart } from "lucide-react";
import { useGlobalProjects } from "@/hooks/useProjects";

const GlobalData = () => {
  const { data: globalProjects = [], isLoading } = useGlobalProjects();
  
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

  // 計算統計數據
  const stats = {
    totalProjects: globalProjects.length,
    totalAmount: globalProjects.reduce((sum, p) => sum + p.amount, 0),
    totalBackers: globalProjects.reduce((sum, p) => sum + p.backers, 0),
    successRate: globalProjects.length > 0 
      ? Math.round(globalProjects.filter(p => p.status === 'completed').length / globalProjects.length * 100)
      : 0,
  };

  const ksStats2024 = [
    { category: "遊戲總數", value: "3,245", change: "+12%" },
    { category: "成功專案", value: "1,876", change: "+8%" },
    { category: "總集資額", value: "$142.5M", change: "+15%" },
    { category: "平均金額", value: "$75,984", change: "+3%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            國際數位遊戲
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              群眾集資數據
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            探索全球數位遊戲群眾集資市場的表現與 Kickstarter 平台數據
          </p>
        </div>

        {/* Kickstarter 2024年度統計 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary" />
              Kickstarter 2024年度統計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DataCard
                title="遊戲總數"
                value={stats.totalProjects.toString()}
                subtitle="+12%"
                icon={BarChart}
                trend="up"
              />
              <DataCard
                title="成功專案"
                value={globalProjects.filter(p => p.status === 'completed').length.toString()}
                subtitle="+8%"
                icon={Award}
                trend="up"
              />
              <DataCard
                title="總集資額"
                value={`$${(stats.totalAmount / 1000000).toFixed(1)}M`}
                subtitle="+15%"
                icon={DollarSign}
                trend="up"
              />
              <DataCard
                title="平均金額"
                value={`$${stats.totalProjects > 0 ? Math.round(stats.totalAmount / stats.totalProjects / 1000) : 0}K`}
                subtitle="+3%"
                icon={TrendingUp}
                trend="up"
              />
            </div>
          </CardContent>
        </Card>

        {/* 全球市場概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            title="專案總數"
            value={stats.totalProjects.toString()}
            subtitle="國際專案"
            icon={Globe}
          />
          <DataCard
            title="累計金額"
            value={`$${(stats.totalAmount / 1000000).toFixed(1)}M`}
            subtitle="總集資金額"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="支持人數"
            value={stats.totalBackers.toLocaleString()}
            subtitle="全球支持者"
            icon={Users}
            trend="up"
          />
          <DataCard
            title="成功率"
            value={`${stats.successRate}%`}
            subtitle="全球平均"
            icon={TrendingUp}
            trend="neutral"
          />
        </div>

        {/* Kickstarter 史上前十名 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Kickstarter 史上前十名遊戲專案
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {globalProjects.slice(0, 10).map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {project.country}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">
                      ${(project.amount / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.backers.toLocaleString()} 名支持者
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campfire 歷年統計 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              Campfire 歷年統計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DataCard
                title="遊戲總數"
                value="1,234"
                subtitle="累計專案數"
                icon={BarChart}
                trend="up"
              />
              <DataCard
                title="集資金額"
                value="¥2.8B"
                subtitle="總募資金額"
                icon={DollarSign}
                trend="up"
              />
              <DataCard
                title="贊助人數"
                value="245K"
                subtitle="總支持者數"
                icon={Users}
                trend="up"
              />
              <DataCard
                title="成功率"
                value="71%"
                subtitle="平均成功率"
                icon={TrendingUp}
                trend="up"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GlobalData;