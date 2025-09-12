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
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center mb-6 w-full">
                <img 
                  src="/lovable-uploads/b79d8205-f3ec-4197-980e-d8746e20225f.png" 
                  alt="GameCF logo 數位遊戲群眾募資資訊站" 
                  className="block w-full max-w-[min(90vw,1000px)] h-auto object-contain" 
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))', transform: 'none', clipPath: 'none' }}
                />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                數位遊戲群眾募資資訊站
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                探索台灣與全球數位遊戲群眾集資趨勢，掌握市場脈動，發現成功案例背後的關鍵數據與策略。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;