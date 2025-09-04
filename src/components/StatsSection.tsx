import { TrendingUp, Users, DollarSign } from "lucide-react";
import DataCard from "./DataCard";

const StatsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kickstarter 2024年度統計</h2>
          <p className="text-lg text-muted-foreground">
            全球最大遊戲群眾集資平台數據總覽
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard
            title="2024年度募資金額"
            value="$26M"
            subtitle="美元"
            icon={DollarSign}
            trend="up"
          />
          <DataCard
            title="全球遊戲市場佔比"
            value="67%"
            subtitle="市場領導地位"
            icon={TrendingUp}
            trend="up"
          />
          <DataCard
            title="數位遊戲成功率"
            value="40%"
            subtitle="平均成功率"
            icon={Users}
            trend="neutral"
          />
          <DataCard
            title="高額專案優勢"
            value="78%"
            subtitle="10萬美元以上專案"
            icon={TrendingUp}
            trend="up"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;