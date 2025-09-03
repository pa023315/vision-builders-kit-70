import Header from "@/components/Header";
import DataCard from "@/components/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, DollarSign, Target, Award, BarChart } from "lucide-react";
import { useAllTaiwanProjects } from "@/hooks/useProjects";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useMemo, useState } from 'react';

const TaiwanData = () => {
  const { data: taiwanProjects = [], isLoading } = useAllTaiwanProjects();
  const [chartType, setChartType] = useState<'line' | 'column' | 'backers' | 'both'>('line');
  
  // 年度專案數量資料
  const yearlyData = [
    { year: 2013, count: 3 },
    { year: 2014, count: 10 },
    { year: 2015, count: 12 },
    { year: 2016, count: 7 },
    { year: 2017, count: 11 },
    { year: 2018, count: 11 },
    { year: 2019, count: 7 },
    { year: 2020, count: 15 },
    { year: 2021, count: 22 },
    { year: 2022, count: 11 },
    { year: 2023, count: 12 },
    { year: 2024, count: 8 },
    { year: 2025, count: 5 },
  ];

  // 年度贊助金額資料
  const yearlyAmountData = [
    { year: 2013, amount: 82995 },
    { year: 2014, amount: 2949611 },
    { year: 2015, amount: 1849204 },
    { year: 2016, amount: 3905309 },
    { year: 2017, amount: 2442585 },
    { year: 2018, amount: 7944010 },
    { year: 2019, amount: 1014746 },
    { year: 2020, amount: 11591248 },
    { year: 2021, amount: 18428298 },
    { year: 2022, amount: 17954962 },
    { year: 2023, amount: 1764237 },
    { year: 2024, amount: 649516 },
    { year: 2025, amount: 353887 },
  ];

  // 年度贊助人數資料
  const yearlyBackersData = [
    { year: 2013, backers: 108 },
    { year: 2014, backers: 1533 },
    { year: 2015, backers: 1205 },
    { year: 2016, backers: 4061 },
    { year: 2017, backers: 1171 },
    { year: 2018, backers: 9001 },
    { year: 2019, backers: 929 },
    { year: 2020, backers: 11474 },
    { year: 2021, backers: 15230 },
    { year: 2022, backers: 11676 },
    { year: 2023, backers: 1823 },
    { year: 2024, backers: 318 },
    { year: 2025, backers: 272 },
  ];

  // Highcharts 折線圖配置
  const lineOptions = useMemo(() => {
    const getThemeColor = (cssVar: string) => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const hslValue = computedStyle.getPropertyValue(cssVar).trim();
        if (hslValue) {
          return `hsl(${hslValue})`;
        }
      }
      return '#C59B6D'; // 預設主色
    };

    return {
      chart: {
        type: 'line',
        backgroundColor: 'transparent',
        spacingBottom: 28,
        style: {
          fontFamily: 'inherit'
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        categories: yearlyData.map(d => d.year.toString()),
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        tickColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      yAxis: {
        title: {
          text: '專案數量',
          style: {
            color: getThemeColor('--muted-foreground')
          }
        },
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      series: [{
        name: '專案數量',
        data: yearlyData.map(d => d.count),
        color: getThemeColor('--primary'),
        marker: {
          fillColor: getThemeColor('--primary'),
          lineColor: getThemeColor('--primary-foreground'),
          lineWidth: 2
        }
      }],
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: getThemeColor('--popover'),
        borderColor: getThemeColor('--border'),
        style: {
          color: getThemeColor('--popover-foreground')
        },
        formatter: function() {
          return `<b>${this.point.category}年</b><br/>專案數量: ${this.y}`;
        }
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    };
  }, []);

  // Highcharts 柱狀圖配置
  const columnOptions = useMemo(() => {
    const getThemeColor = (cssVar: string) => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const hslValue = computedStyle.getPropertyValue(cssVar).trim();
        if (hslValue) {
          return `hsl(${hslValue})`;
        }
      }
      return '#C59B6D'; // 預設主色
    };

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacingBottom: 28,
        style: {
          fontFamily: 'inherit'
        },
        reflow: true
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        categories: yearlyAmountData.map(d => d.year.toString()),
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        tickColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      yAxis: {
        title: {
          text: '贊助金額 (NT$)',
          style: {
            color: getThemeColor('--muted-foreground')
          }
        },
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          },
          formatter: function() {
            return (this.value / 1000000).toFixed(1) + 'M';
          }
        },
        min: 0,
        startOnTick: true,
        endOnTick: true
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          pointPadding: 0.1,
          borderWidth: 0,
          color: getThemeColor('--primary')
        }
      },
      series: [{
        name: '贊助金額',
        data: yearlyAmountData.map(d => d.amount),
        color: getThemeColor('--primary')
      }],
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: getThemeColor('--popover'),
        borderColor: getThemeColor('--border'),
        style: {
          color: getThemeColor('--popover-foreground')
        },
        formatter: function() {
          return `<b>${this.point.category}年</b><br/>贊助金額: NT$ ${this.y.toLocaleString()}`;
        }
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    };
  }, []);

  // Highcharts 雙軸對照圖配置
  const bothOptions = useMemo(() => {
    const getThemeColor = (cssVar: string) => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const hslValue = computedStyle.getPropertyValue(cssVar).trim();
        if (hslValue) {
          return `hsl(${hslValue})`;
        }
      }
      return '#C59B6D'; // 預設主色
    };

    const deepGold = '#8C6A2E'; // 深金色

    return {
      chart: {
        backgroundColor: 'transparent',
        spacingBottom: 28,
        style: {
          fontFamily: 'inherit'
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        categories: yearlyData.map(d => d.year.toString()),
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        tickColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      yAxis: [
        {
          // 左軸 - 贊助金額
          title: {
            text: '贊助金額 (NT$)',
            style: {
              color: getThemeColor('--muted-foreground')
            }
          },
          gridLineColor: getThemeColor('--border'),
          lineColor: getThemeColor('--border'),
          labels: {
            style: {
              color: getThemeColor('--muted-foreground')
            }
          }
        },
        {
          // 右軸 - 專案數量
          title: {
            text: '專案數量',
            style: {
              color: getThemeColor('--muted-foreground')
            }
          },
          opposite: true,
          gridLineWidth: 0,
          lineColor: getThemeColor('--border'),
          labels: {
            style: {
              color: getThemeColor('--muted-foreground')
            }
          }
        }
      ],
      series: [
        {
          name: '贊助金額',
          type: 'column',
          yAxis: 0,
          data: yearlyAmountData.map(d => d.amount),
          color: getThemeColor('--primary'),
          borderRadius: 4,
          pointPadding: 0.1,
          borderWidth: 0
        },
        {
          name: '專案數量',
          type: 'line',
          yAxis: 1,
          data: yearlyData.map(d => d.count),
          color: deepGold,
          lineWidth: 3,
          marker: {
            fillColor: deepGold,
            lineColor: getThemeColor('--primary-foreground'),
            lineWidth: 2
          }
        }
      ],
      legend: {
        enabled: false
      },
      tooltip: {
        shared: true,
        backgroundColor: getThemeColor('--popover'),
        borderColor: getThemeColor('--border'),
        style: {
          color: getThemeColor('--popover-foreground')
        },
        formatter: function() {
          let tooltip = `<b>${this.points[0].point.category}年</b><br/>`;
          this.points.forEach((point) => {
            if (point.series.name === '贊助金額') {
              tooltip += `贊助金額: NT$ ${point.y.toLocaleString()}<br/>`;
            } else {
              tooltip += `專案數量: ${point.y}`;
            }
          });
          return tooltip;
        }
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    };
  }, []);

  // Highcharts 贊助人數圖配置
  const backersOptions = useMemo(() => {
    const getThemeColor = (cssVar: string) => {
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const hslValue = computedStyle.getPropertyValue(cssVar).trim();
        if (hslValue) {
          return `hsl(${hslValue})`;
        }
      }
      return '#C59B6D'; // 預設主色
    };

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        spacingBottom: 28,
        style: {
          fontFamily: 'inherit'
        }
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'category',
        categories: yearlyBackersData.map(d => d.year.toString()),
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        tickColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      yAxis: {
        title: {
          text: '贊助人數',
          style: {
            color: getThemeColor('--muted-foreground')
          }
        },
        gridLineColor: getThemeColor('--border'),
        lineColor: getThemeColor('--border'),
        labels: {
          style: {
            color: getThemeColor('--muted-foreground')
          }
        }
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          pointPadding: 0.1,
          borderWidth: 0,
          color: getThemeColor('--primary')
        }
      },
      series: [{
        name: '贊助人數',
        data: yearlyBackersData.map(d => d.backers),
        color: getThemeColor('--primary')
      }],
      legend: {
        enabled: false
      },
      tooltip: {
        backgroundColor: getThemeColor('--popover'),
        borderColor: getThemeColor('--border'),
        style: {
          color: getThemeColor('--popover-foreground')
        },
        formatter: function() {
          return `<b>${this.point.category}年</b><br/>贊助人數: ${this.y.toLocaleString()}`;
        }
      },
      credits: {
        enabled: false
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false
            }
          }
        }]
      }
    };
  }, []);
   
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

        {/* 年度趨勢圖表 */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {chartType === 'line' 
                  ? '年度專案數量趨勢（2013-2025年份）' 
                  : chartType === 'column'
                  ? '年度贊助金額趨勢（2013-2025年份）'
                  : chartType === 'backers'
                  ? '年度贊助人數趨勢（2013-2025年份）'
                  : '年度專案數量與贊助金額對照（2013-2025年份）'
                }
              </CardTitle>
              <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'column' | 'backers' | 'both')}>
                <TabsList>
                  <TabsTrigger value="line">專案數量</TabsTrigger>
                  <TabsTrigger value="column">贊助金額</TabsTrigger>
                  <TabsTrigger value="backers">專案人數</TabsTrigger>
                  <TabsTrigger value="both">二者對照</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80 lg:h-96">
              <HighchartsReact
                key={chartType}
                highcharts={Highcharts}
                options={chartType === 'line' ? lineOptions : chartType === 'column' ? columnOptions : chartType === 'backers' ? backersOptions : bothOptions}
              />
            </div>
          </CardContent>
        </Card>

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