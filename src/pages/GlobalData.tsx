import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Globe, Award, BarChart } from "lucide-react";
import { useKickstarterProjects, useCampfireProjects } from "@/hooks/useProjects";
import { useState } from "react";

const GlobalData = () => {
  const { data: kickstarterProjects = [], isLoading: isKickstarterLoading } = useKickstarterProjects();
  const { data: campfireProjects = [], isLoading: isCampfireLoading } = useCampfireProjects();
  const [activeTab, setActiveTab] = useState<"kickstarter" | "campfire">("kickstarter");
  
  if (isKickstarterLoading || isCampfireLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center">載入中...</div>
        </main>
      </div>
    );
  }

  // 根據當前分頁選擇對應的專案數據
  const currentProjects = activeTab === "kickstarter" ? kickstarterProjects : campfireProjects;

  // 計算統計數據
  const stats = {
    totalProjects: currentProjects.length,
    totalAmount: currentProjects.reduce((sum, p) => sum + p.amount, 0),
    totalBackers: currentProjects.reduce((sum, p) => sum + p.backers, 0),
    successRate: currentProjects.length > 0 
      ? Math.round(currentProjects.filter(p => p.status === 'completed').length / currentProjects.length * 100)
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
            <span className="text-primary">
              群眾集資數據
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            探索全球數位遊戲群眾集資市場的表現與 Kickstarter 平台數據
          </p>
          
          {/* Toggle Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              variant={activeTab === "kickstarter" ? "default" : "outline"}
              onClick={() => setActiveTab("kickstarter")}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Kickstarter
            </Button>
            <Button
              variant={activeTab === "campfire" ? "default" : "outline"}
              onClick={() => setActiveTab("campfire")}
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              Campfire
            </Button>
          </div>
        </div>

        {/* Kickstarter Content */}
        {activeTab === "kickstarter" && (
          <>
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
              </CardContent>
            </Card>

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
                  {kickstarterProjects.slice(0, 10).map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          {project.project_url ? (
                            <h3 className="font-semibold">
                              <a 
                                href={project.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                              >
                                {project.name}
                              </a>
                            </h3>
                          ) : (
                            <h3 className="font-semibold">{project.name}</h3>
                          )}
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
          </>
        )}

        {/* Campfire Content */}
        {activeTab === "campfire" && (
          <>
            {/* Campfire 歷年統計 */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary" />
                  Campfire 歷年統計
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DataCard
                    title="專案總數"
                    value={campfireProjects.length.toString()}
                    subtitle="Campfire專案"
                    icon={BarChart}
                  />
                  <DataCard
                    title="累計金額"
                    value={`¥${(campfireProjects.reduce((sum, p) => sum + p.amount, 0) / 1000000).toFixed(1)}M`}
                    subtitle="總集資金額"
                    icon={DollarSign}
                    trend="up"
                  />
                  <DataCard
                    title="支持人數"
                    value={campfireProjects.reduce((sum, p) => sum + p.backers, 0).toLocaleString()}
                    subtitle="總支持者數"
                    icon={Users}
                    trend="up"
                  />
                  <DataCard
                    title="成功率"
                    value={`${campfireProjects.length > 0 
                      ? Math.round(campfireProjects.filter(p => p.status === 'completed').length / campfireProjects.length * 100)
                      : 0}%`}
                    subtitle="平均成功率"
                    icon={TrendingUp}
                    trend="up"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Campfire 日本熱門遊戲 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Campfire 熱門遊戲專案
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campfireProjects.slice(0, 10).map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          {project.project_url ? (
                            <h3 className="font-semibold">
                              <a 
                                href={project.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                              >
                                {project.name}
                              </a>
                            </h3>
                          ) : (
                            <h3 className="font-semibold">{project.name}</h3>
                          )}
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
                          ¥{(project.amount / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {project.backers.toLocaleString()} 名支持者
                        </div>
                      </div>
                    </div>
                  ))}
                  {campfireProjects.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      暫無 Campfire 專案資料
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default GlobalData;