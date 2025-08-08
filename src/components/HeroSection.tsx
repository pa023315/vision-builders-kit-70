import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import DataCard from "./DataCard";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                數位遊戲
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  群眾集資
                </span>
                洞察平台
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                探索台灣與全球數位遊戲群眾集資趨勢，掌握市場脈動，發現成功案例背後的關鍵數據與策略。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/taiwan-data">
                <Button size="lg" className="group">
                  探索台灣數據
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/global-data">
                <Button variant="outline" size="lg" className="group">
                  查看國際趨勢
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DataCard
              title="台灣專案總數"
              value="134"
              subtitle="件活躍專案"
              icon={TrendingUp}
              trend="up"
            />
            <DataCard
              title="累計集資金額"
              value="$70.9M"
              subtitle="新台幣"
              icon={DollarSign}
              trend="up"
            />
            <DataCard
              title="支持人數"
              value="58.8K"
              subtitle="名支持者"
              icon={Users}
              trend="up"
            />
            <DataCard
              title="成功率"
              value="68%"
              subtitle="平均成功率"
              icon={TrendingUp}
              trend="neutral"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;