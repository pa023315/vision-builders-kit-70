import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataCard from "@/components/DataCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Target, Globe, MapPin } from "lucide-react";
import { useTaiwanProjects, useGlobalProjects } from "@/hooks/useProjects";

export const StatsAdmin = () => {
  const { data: taiwanProjects = [] } = useTaiwanProjects();
  const { data: globalProjects = [] } = useGlobalProjects();

  // 計算台灣統計數據
  const taiwanStats = {
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

  const avgTicket = taiwanStats.totalBackers > 0 
    ? Math.round(taiwanStats.totalAmount / taiwanStats.totalBackers)
    : 0;

  // 計算全球統計數據
  const globalStats = {
    totalProjects: globalProjects.length,
    totalAmount: globalProjects.reduce((sum, p) => sum + p.amount, 0),
    totalBackers: globalProjects.reduce((sum, p) => sum + p.backers, 0),
    successRate: globalProjects.length > 0 
      ? Math.round(globalProjects.filter(p => p.status === 'completed').length / globalProjects.length * 100)
      : 0,
  };

  // 平台分布數據
  const platformData = [...taiwanProjects, ...globalProjects].reduce((acc, project) => {
    acc[project.platform] = (acc[project.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(platformData).map(([platform, count]) => ({
    name: platform,
    value: count,
  }));

  // 分類分布數據
  const categoryData = [...taiwanProjects, ...globalProjects].reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + project.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount: amount / 1000000, // 轉換為百萬
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="space-y-6">
      {/* 台灣數據總覽 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            台灣數據總覽
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <DataCard
              title="專案數"
              value={taiwanStats.totalProjects.toString()}
              icon={Target}
              trend="neutral"
            />
            <DataCard
              title="累計金額"
              value={`NT$ ${(taiwanStats.totalAmount / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              trend="up"
            />
            <DataCard
              title="支持人數"
              value={taiwanStats.totalBackers.toLocaleString()}
              icon={Users}
              trend="up"
            />
            <DataCard
              title="成功率"
              value={`${taiwanStats.successRate}%`}
              icon={TrendingUp}
              trend="up"
            />
            <DataCard
              title="中位數金額"
              value={`NT$ ${(taiwanStats.medianAmount / 1000).toFixed(0)}K`}
              icon={DollarSign}
              trend="neutral"
            />
            <DataCard
              title="中位數人數"
              value={taiwanStats.medianBackers.toString()}
              icon={Users}
              trend="neutral"
            />
            <DataCard
              title="平均客單價"
              value={`NT$ ${avgTicket.toLocaleString()}`}
              icon={DollarSign}
              trend="neutral"
            />
          </div>
        </CardContent>
      </Card>

      {/* 全球數據總覽 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            全球數據總覽
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DataCard
              title="專案數"
              value={globalStats.totalProjects.toString()}
              icon={Target}
              trend="neutral"
            />
            <DataCard
              title="累計金額"
              value={`$ ${(globalStats.totalAmount / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              trend="up"
            />
            <DataCard
              title="支持人數"
              value={globalStats.totalBackers.toLocaleString()}
              icon={Users}
              trend="up"
            />
            <DataCard
              title="成功率"
              value={`${globalStats.successRate}%`}
              icon={TrendingUp}
              trend="up"
            />
          </div>
        </CardContent>
      </Card>

      {/* 圖表分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>分類募資金額分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}M`, '金額(百萬)']} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>平台專案數量分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 近期活動專案 */}
      <Card>
        <CardHeader>
          <CardTitle>專案狀態分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {[...taiwanProjects, ...globalProjects].filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">已完成</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {[...taiwanProjects, ...globalProjects].filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">進行中</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {[...taiwanProjects, ...globalProjects].filter(p => p.status === 'failed').length}
              </div>
              <div className="text-sm text-muted-foreground">失敗</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};