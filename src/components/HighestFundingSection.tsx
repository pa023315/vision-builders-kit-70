import { ExternalLink, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


const HighestFundingSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            史上募資金額最高專案
          </h2>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* 圖片區域 */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="/lovable-uploads/a6e7c438-2772-4d0c-acd0-83b63f0d2ec9.png" 
                  alt="Star Citizen - 史上募資金額最高的遊戲專案"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 內容區域 */}
              <div className="p-8 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      <a 
                        href="https://robertsspaceindustries.com/en/funding-goals"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
                      >
                        星際公民 Star Citizen
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">贊助人數</div>
                      <div className="text-2xl font-bold text-primary">
                        {(864198850).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">贊助金額</div>
                      <div className="text-2xl font-bold text-primary">
                        ${(5895600).toLocaleString()} USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HighestFundingSection;