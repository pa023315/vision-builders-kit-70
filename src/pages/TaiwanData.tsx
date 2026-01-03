import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  const { data: allProjects = [], isLoading } = useAllTaiwanProjects();
  const [chartType, setChartType] = useState<'line' | 'column' | 'backers' | 'both'>('line');

  // 只計算 completed + failed 狀態的專案（與後台同步）
  const taiwanProjects = useMemo(() => {
    return allProjects.filter(p => p.status === 'completed' || p.status === 'failed');
  }, [allProjects]);

  // 成功專案 = status 為 completed
  const successfulProjects = useMemo(() => {
    return allProjects.filter(p => p.status === 'completed');
  }, [allProjects]);

  // 動態計算年度專案數量資料（只計算成功專案）
  const yearlyData = useMemo(() => {
    const yearCounts: { [key: number]: number } = {};
    successfulProjects.forEach(p => {
      if (p.launch_date) {
        const year = parseInt(p.launch_date.split('-')[0]) || parseInt(p.launch_date.split('/')[0]);
        if (year >= 2013 && year <= 2025) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      }
    });
    return Array.from({ length: 13 }, (_, i) => ({
      year: 2013 + i,
      count: yearCounts[2013 + i] || 0
    }));
  }, [successfulProjects]);

  // 動態計算年度贊助金額資料（只計算成功專案）
  const yearlyAmountData = useMemo(() => {
    const yearAmounts: { [key: number]: number } = {};
    successfulProjects.forEach(p => {
      if (p.launch_date) {
        const year = parseInt(p.launch_date.split('-')[0]) || parseInt(p.launch_date.split('/')[0]);
        if (year >= 2013 && year <= 2025) {
          yearAmounts[year] = (yearAmounts[year] || 0) + (p.amount || 0);
        }
      }
    });
    return Array.from({ length: 13 }, (_, i) => ({
      year: 2013 + i,
      amount: yearAmounts[2013 + i] || 0
    }));
  }, [successfulProjects]);

  // 動態計算年度贊助人數資料（只計算成功專案）
  const yearlyBackersData = useMemo(() => {
    const yearBackers: { [key: number]: number } = {};
    successfulProjects.forEach(p => {
      if (p.launch_date) {
        const year = parseInt(p.launch_date.split('-')[0]) || parseInt(p.launch_date.split('/')[0]);
        if (year >= 2013 && year <= 2025) {
          yearBackers[year] = (yearBackers[year] || 0) + (p.backers || 0);
        }
      }
    });
    return Array.from({ length: 13 }, (_, i) => ({
      year: 2013 + i,
      backers: yearBackers[2013 + i] || 0
    }));
  }, [successfulProjects]);

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
        spacingBottom: 40,
        marginBottom: 60,
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
          },
          y: 20
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
          condition: { maxWidth: 640 },
          chartOptions: {
            chart: { spacingBottom: 64, marginBottom: 80 },
            xAxis: {
              labels: {
                rotation: 0,
                style: { fontSize: '10px' },
                y: 16,
                step: 2
              }
            },
            legend: { enabled: false }
          }
        }]
      }
    };
  }, [yearlyData]);

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
        spacingBottom: 40,
        marginBottom: 60,
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
          },
          y: 20
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
          condition: { maxWidth: 640 },
          chartOptions: {
            chart: { spacingBottom: 64, marginBottom: 80 },
            xAxis: {
              labels: {
                rotation: 0,
                style: { fontSize: '10px' },
                y: 16,
                step: 2
              }
            },
            legend: { enabled: false }
          }
        }]
      }
    };
  }, [yearlyAmountData]);

  // Highcharts 三軸對照圖配置
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
        spacingBottom: 40,
        marginBottom: 60,
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
          },
          y: 20
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
          // 中軸 - 贊助人數  
          title: {
            text: '贊助人數',
            style: {
              color: getThemeColor('--muted-foreground')
            }
          },
          gridLineWidth: 0,
          lineColor: getThemeColor('--border'),
          labels: {
            style: {
              color: getThemeColor('--muted-foreground')
            }
          },
          max: Math.max(...yearlyBackersData.map(d => d.backers)) * 1.2
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
          name: '贊助人數',
          type: 'column',
          yAxis: 1,
          data: yearlyBackersData.map(d => d.backers),
          color: '#FFFFFF',
          borderRadius: 4,
          pointPadding: 0.1,
          borderWidth: 1,
          borderColor: getThemeColor('--border')
        },
        {
          name: '專案數量',
          type: 'line',
          yAxis: 2,
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
            } else if (point.series.name === '贊助人數') {
              tooltip += `贊助人數: ${point.y.toLocaleString()}<br/>`;
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
          condition: { maxWidth: 640 },
          chartOptions: {
            chart: { spacingBottom: 64, marginBottom: 80 },
            xAxis: {
              labels: {
                rotation: 0,
                style: { fontSize: '10px' },
                y: 16,
                step: 2
              }
            },
            legend: { enabled: false }
          }
        }]
      }
    };
  }, [yearlyData, yearlyAmountData, yearlyBackersData]);

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
        spacingBottom: 40,
        marginBottom: 60,
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
          },
          y: 20
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
          condition: { maxWidth: 640 },
          chartOptions: {
            chart: { spacingBottom: 64, marginBottom: 80 },
            xAxis: {
              labels: {
                rotation: 0,
                style: { fontSize: '10px' },
                y: 16,
                step: 2
              }
            },
            legend: { enabled: false }
          }
        }]
      }
    };
  }, [yearlyBackersData]);
   
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

  // 動態計算統計數據（與後台同步）
  const correctStats = useMemo(() => {
    const totalAmount = successfulProjects.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalBackers = successfulProjects.reduce((sum, p) => sum + (p.backers || 0), 0);
    
    // 計算中位數金額
    const amounts = successfulProjects.map(p => p.amount).filter(a => a > 0).sort((a, b) => a - b);
    const medianAmount = amounts.length > 0
      ? amounts.length % 2 === 0
        ? Math.round((amounts[Math.floor(amounts.length / 2) - 1] + amounts[Math.floor(amounts.length / 2)]) / 2)
        : amounts[Math.floor(amounts.length / 2)]
      : 0;
    
    // 計算中位數人數
    const backers = successfulProjects.map(p => p.backers).filter(b => b > 0).sort((a, b) => a - b);
    const medianBackers = backers.length > 0
      ? backers.length % 2 === 0
        ? Math.round((backers[Math.floor(backers.length / 2) - 1] + backers[Math.floor(backers.length / 2)]) / 2)
        : backers[Math.floor(backers.length / 2)]
      : 0;
    
    return {
      totalProjects: taiwanProjects.length,
      totalAmount,
      totalBackers,
      avgAmount: successfulProjects.length > 0 ? Math.round(totalAmount / successfulProjects.length) : 0,
      medianAmount,
      medianBackers,
      avgTicket: totalBackers > 0 ? Math.round(totalAmount / totalBackers) : 0,
      successRate: taiwanProjects.length > 0 
        ? Math.round(successfulProjects.length / taiwanProjects.length * 100)
        : 0,
    };
  }, [taiwanProjects, successfulProjects]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>台灣數位遊戲群眾集資數據 - GameCF</title>
        <meta property="og:title" content="台灣數位遊戲群眾集資數據 - GameCF" />
        <meta property="og:description" content="深入了解台灣數位遊戲群眾集資市場的表現與趨勢" />
        <meta property="og:image" content="https://mkllbwsxvkcacyztgsgv.supabase.co/storage/v1/object/public/lovable-uploads/0b5d0079-3daa-413d-a1d9-80c077436eb5.png" />
      </Helmet>
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
            subtitle="件專案"
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {chartType === 'line' 
                  ? '年度專案數量趨勢（2013-2025年份）' 
                  : chartType === 'column'
                  ? '年度贊助金額趨勢（2013-2025年份）'
                  : chartType === 'backers'
                  ? '年度贊助人數趨勢（2013-2025年份）'
                  : '年度專案數量、贊助金額與贊助人數對照（2013-2025年份）'
                }
              </CardTitle>
              <div className="w-full overflow-x-auto -mx-1 sm:mx-0">
                <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'column' | 'backers' | 'both')}>
                  <TabsList className="whitespace-nowrap">
                    <TabsTrigger value="line">專案數量</TabsTrigger>
                    <TabsTrigger value="column">贊助金額</TabsTrigger>
                    <TabsTrigger value="backers">專案人數</TabsTrigger>
                    <TabsTrigger value="both">三者對照</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80 lg:h-96 mb-4">
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
      <Footer />
    </div>
  );
};

export default TaiwanData;