import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const DataCard = ({ title, value, subtitle, icon: Icon, trend, className }: DataCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-primary";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-5 w-5 text-primary group-hover:text-secondary transition-colors" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {value}
        </div>
        {subtitle && (
          <p className={`text-sm mt-1 ${getTrendColor()}`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;