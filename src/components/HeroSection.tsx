import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
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
                <span className="block text-muted-foreground">
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

          {/* Right Content - Illustration/Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl"></div>
            <div className="relative bg-card/50 backdrop-blur-sm border rounded-lg p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">數據驅動決策</h3>
                <p className="text-muted-foreground">
                  透過深度分析群眾集資數據，為您的遊戲開發與行銷策略提供科學依據
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;