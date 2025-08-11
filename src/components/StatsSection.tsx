import { TrendingUp, Users, DollarSign } from "lucide-react";
import DataCard from "./DataCard";

const StatsSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">平台數據總覽</h2>
          <p className="text-lg text-muted-foreground">
            掌握數位遊戲群眾集資的最新趨勢與關鍵指標
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard
            title="專案總數"
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
    </section>
  );
};

export default StatsSection;