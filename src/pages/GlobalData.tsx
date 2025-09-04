import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, DollarSign, Globe, Award, BarChart } from "lucide-react";
import { useKickstarterProjects, useCampfireProjects } from "@/hooks/useProjects";
import { useState } from "react";
import { BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from "recharts";

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

  const yearlyFundingData = [
    { year: "2012", amount: 38 },
    { year: "2013", amount: 48 },
    { year: "2014", amount: 20 },
    { year: "2015", amount: 41.5 },
    { year: "2016", amount: 17 },
    { year: "2017", amount: 17 },
    { year: "2018", amount: 15 },
    { year: "2019", amount: 16.3 },
    { year: "2020", amount: 22.9 },
    { year: "2021", amount: 21.8 },
    { year: "2022", amount: 20 },
    { year: "2023", amount: 20.4 },
    { year: "2024", amount: 26.1 }
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
                    title="2024年度募資金額"
                    value="$26M"
                    subtitle="美元"
                    icon={DollarSign}
                    trend="up"
                  />
                  <DataCard
                    title="全球遊戲市場佔比"
                    value="67%"
                    subtitle="約占全球遊戲類"
                    icon={TrendingUp}
                    trend="up"
                  />
                  <DataCard
                    title="數位遊戲成功率"
                    value="40%"
                    subtitle="平均成功率"
                    icon={Users}
                    trend="neutral"
                  />
                  <DataCard
                    title="高額專案比例"
                    value="78%"
                    subtitle="10萬美元以上在 Kickstarter"
                    icon={TrendingUp}
                    trend="up"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 年度贊助金額趨勢 */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  年度贊助金額趨勢（2012-2024年份）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={yearlyFundingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="year" 
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        className="text-muted-foreground"
                        tick={{ fontSize: 12 }}
                        label={{ value: '贊助金額 (M)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}M`, '贊助金額']}
                        labelFormatter={(label) => `${label}年`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
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
                <div className="divide-y divide-border border-t border-b">
                  {kickstarterProjects.slice(0, 10).map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between py-4"
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
                                className="text-white hover:text-white/80 transition-colors cursor-pointer"
                              >
                                {project.name}
                              </a>
                            </h3>
                          ) : (
                            <h3 className="font-semibold text-white">{project.name}</h3>
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
                        <div className="font-bold text-lg text-primary">
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
                <div className="divide-y divide-border border-t border-b">
                  {campfireProjects.slice(0, 10).map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between py-4"
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
                                className="text-white hover:text-white/80 transition-colors cursor-pointer"
                              >
                                {project.name}
                              </a>
                            </h3>
                          ) : (
                            <h3 className="font-semibold text-white">{project.name}</h3>
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
                        <div className="font-bold text-lg text-primary">
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