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

  // 計算統計數據
  const stats = {
    totalProjects: taiwanProjects.length,
    totalAmount: taiwanProjects.reduce((sum, p) => sum + p.amount, 0),
    totalBackers: taiwanProjects.reduce((sum, p) => sum + p.backers, 0),
    successRate: taiwanProjects.length > 0 
      ? Math.round(taiwanProjects.filter(p => p.status === 'completed').length / taiwanProjects.length * 100)
      : 0,
    medianAmount: taiwanProjects.length > 0 
      ? taiwanProjects.sort((a, b) => a.amount - b.amount)[Math.floor(taiwanProjects.length / 2)]?.amount || 0
      : 0,
    medianBackers: taiwanProjects.length > 0 
      ? taiwanProjects.sort((a, b) => a.backers - b.backers)[Math.floor(taiwanProjects.length / 2)]?.backers || 0
      : 0,
  };

  const avgTicket = stats.totalBackers > 0 
    ? Math.round(stats.totalAmount / stats.totalBackers)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            台灣數位遊戲
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            value={stats.totalProjects.toString()}
            subtitle="件活躍專案"
            icon={BarChart}
            trend="up"
          />
          <DataCard
            title="累計金額"
            value={`NT$ ${(stats.totalAmount / 1000000).toFixed(1)}M`}
            subtitle="總集資金額"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="支持人數"
            value={stats.totalBackers.toLocaleString()}
            subtitle="名支持者"
            icon={Users}
            trend="up"
          />
          <DataCard
            title="成功率"
            value={`${stats.successRate}%`}
            subtitle="平均成功率"
            icon={Target}
            trend="neutral"
          />
        </div>

        {/* 詳細統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DataCard
            title="中位數金額"
            value={`NT$ ${(stats.medianAmount / 1000).toFixed(0)}K`}
            subtitle="專案中位數"
            icon={TrendingUp}
          />
          <DataCard
            title="中位數人數"
            value={stats.medianBackers.toString()}
            subtitle="支持者中位數"
            icon={Users}
          />
          <DataCard
            title="平均客單價"
            value={`NT$ ${avgTicket.toLocaleString()}`}
            subtitle="平均客單價"
            icon={DollarSign}
          />
        </div>

        {/* 台灣前十名案例 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              台灣前十名成功案例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taiwanProjects.filter(p => p.status === 'completed').slice(0, 10).map((project, index) => (
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
                      {project.backers.toLocaleString()} 人支持 • {Math.round(project.success_rate)}%
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