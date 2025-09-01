import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target, Award, BarChart } from "lucide-react";
import { useAllTaiwanProjects } from "@/hooks/useProjects";

const TaiwanData = () => {
  const { data: taiwanProjects = [], isLoading } = useAllTaiwanProjects();
  
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

  // 根據Excel正確數字的統計數據
  const correctStats = {
    totalProjects: 134,           // 專案總數
    totalAmount: 70930608,        // 成功贊助總金額 (70,930,608)
    totalBackers: 58801,          // 成功贊助人數 (58,801)
    avgAmount: 529183,            // 平均金額 (70,930,608 / 134 = 529,183)
    medianAmount: 223628,         // 中位數金額 (223,628)
    medianBackers: 156,           // 中位數人數 (156)
    avgTicket: 1192,              // 中位數每人贊助 (1,192)
    successRate: taiwanProjects.length > 0 
      ? Math.round(taiwanProjects.filter(p => p.status === 'completed').length / taiwanProjects.length * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            台灣數位遊戲
            <span className="text-muted-foreground">
              群眾集資數據
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            深入了解台灣數位遊戲群眾集資市場的表現與趨勢
          </p>
        </div>

        {/* 核心統計數據 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            title="專案總數"
            value={correctStats.totalProjects.toString()}
            subtitle="件活躍專案"
            icon={BarChart}
            trend="up"
          />
          <DataCard
            title="累計金額"
            value={`NT$ ${(correctStats.totalAmount / 1000000).toFixed(1)}M`}
            subtitle="總集資金額"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="支持人數"
            value={correctStats.totalBackers.toLocaleString()}
            subtitle="名支持者"
            icon={Users}
            trend="up"
          />
          <DataCard
            title="成功率"
            value={`${correctStats.successRate}%`}
            subtitle="平均成功率"
            icon={Target}
            trend="neutral"
          />
        </div>

        {/* 詳細統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DataCard
            title="中位數金額"
            value={`NT$ ${(correctStats.medianAmount / 1000).toFixed(0)}K`}
            subtitle="專案中位數金額"
            icon={TrendingUp}
          />
          <DataCard
            title="中位數人數"
            value={correctStats.medianBackers.toString()}
            subtitle="支持者中位數"
            icon={Users}
          />
          <DataCard
            title="平均客單價"
            value={`NT$ ${correctStats.avgTicket.toLocaleString()}`}
            subtitle="平均客單價"
            icon={DollarSign}
          />
        </div>

        {/* 台灣前十名案例 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              台灣前十名集資案例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border border-t border-b">
              {taiwanProjects
                .slice(0, 10)
                .map((project, index) => (
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
                          {project.platform}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">NT$ {(project.amount / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">
                      {project.backers.toLocaleString()} 人支持 • {project.target > 0 ? Math.round((project.amount / project.target) * 100) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaiwanData;