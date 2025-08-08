import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Globe, Award, BarChart } from "lucide-react";

const GlobalData = () => {
  const kickstarterTop10 = [
    {
      rank: 1,
      name: "Bloodstained: Ritual of the Night",
      amount: "$5,545,991",
      backers: 64853,
      country: "日本",
      category: "動作冒險"
    },
    {
      rank: 2,
      name: "Shenmue III",
      amount: "$6,333,295",
      backers: 69320,
      country: "日本",
      category: "冒險"
    },
    {
      rank: 3,
      name: "Pillars of Eternity II: Deadfire",
      amount: "$4,407,598",
      backers: 33614,
      country: "美國",
      category: "RPG"
    },
    {
      rank: 4,
      name: "Torment: Tides of Numenera",
      amount: "$4,188,927",
      backers: 74405,
      country: "美國",
      category: "RPG"
    },
    {
      rank: 5,
      name: "Mighty No. 9",
      amount: "$3,845,170",
      backers: 67226,
      country: "日本",
      category: "動作"
    }
  ];

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
              {ksStats2024.map((stat, index) => (
                <DataCard
                  key={index}
                  title={stat.category}
                  value={stat.value}
                  subtitle={stat.change}
                  icon={index === 0 ? BarChart : index === 1 ? Award : index === 2 ? DollarSign : TrendingUp}
                  trend={stat.change.includes("+") ? "up" : "down"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 全球市場概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DataCard
            title="全球平台總數"
            value="50+"
            subtitle="主要群眾集資平台"
            icon={Globe}
          />
          <DataCard
            title="年度集資總額"
            value="$2.1B"
            subtitle="全球遊戲類別"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="活躍支持者"
            value="8.5M"
            subtitle="全球支持者數量"
            icon={Users}
            trend="up"
          />
          <DataCard
            title="平均成功率"
            value="37%"
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
              {kickstarterTop10.map((project, index) => (
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
                          {project.country}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">{project.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {project.backers.toLocaleString()} 名支持者
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 區域分析 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">北美市場</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">市場佔比</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">平均金額</span>
                  <span className="font-semibold">$85K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">成功率</span>
                  <span className="font-semibold">42%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">歐洲市場</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">市場佔比</span>
                  <span className="font-semibold">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">平均金額</span>
                  <span className="font-semibold">$62K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">成功率</span>
                  <span className="font-semibold">38%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">亞太市場</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">市場佔比</span>
                  <span className="font-semibold">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">平均金額</span>
                  <span className="font-semibold">$48K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">成功率</span>
                  <span className="font-semibold">35%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GlobalData;