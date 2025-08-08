import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target, Award, BarChart } from "lucide-react";

const TaiwanData = () => {
  const topProjects = [
    {
      rank: 1,
      name: "台灣製造：復古像素RPG",
      amount: "NT$ 8,500,000",
      backers: 2156,
      successRate: "156%",
      platform: "嘖嘖",
      category: "RPG"
    },
    {
      rank: 2,
      name: "島嶼冒險：探索台灣",
      amount: "NT$ 6,200,000",
      backers: 1834,
      successRate: "124%",
      platform: "FlyingV",
      category: "冒險"
    },
    {
      rank: 3,
      name: "夜市大亨：經營模擬",
      amount: "NT$ 4,800,000",
      backers: 1567,
      successRate: "192%",
      platform: "嘖嘖",
      category: "模擬"
    },
    {
      rank: 4,
      name: "古早味彈珠台",
      amount: "NT$ 3,900,000",
      backers: 1245,
      successRate: "130%",
      platform: "FlyingV",
      category: "休閒"
    },
    {
      rank: 5,
      name: "台語桌遊數位版",
      amount: "NT$ 3,200,000",
      backers: 987,
      successRate: "106%",
      platform: "嘖嘖",
      category: "桌遊"
    }
  ];

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
            value="134"
            subtitle="件活躍專案"
            icon={BarChart}
            trend="up"
          />
          <DataCard
            title="累計金額"
            value="NT$ 70,930,000"
            subtitle="總集資金額"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="支持人數"
            value="58,801"
            subtitle="名支持者"
            icon={Users}
            trend="up"
          />
          <DataCard
            title="成功率"
            value="68%"
            subtitle="平均成功率"
            icon={Target}
            trend="neutral"
          />
        </div>

        {/* 詳細統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DataCard
            title="中位數金額"
            value="NT$ 220,000"
            subtitle="專案中位數"
            icon={TrendingUp}
          />
          <DataCard
            title="中位數人數"
            value="156"
            subtitle="支持者中位數"
            icon={Users}
          />
          <DataCard
            title="中位數客單價"
            value="NT$ 1,192"
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
              {topProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {project.rank}
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
                    <div className="font-bold text-lg">{project.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.backers} 人支持 • {project.successRate}
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