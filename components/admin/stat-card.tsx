import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: "primary" | "secondary" | "accent" | "neutral";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  icon,
  color = "primary",
  trend,
}: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary-50 border-primary-200",
    secondary: "bg-secondary-50 border-secondary-200",
    accent: "bg-accent-50 border-accent-200",
    neutral: "bg-neutral-50 border-neutral-200",
  };

  const iconColorClasses = {
    primary: "text-primary-700",
    secondary: "text-secondary-700",
    accent: "text-accent-700",
    neutral: "text-neutral-700",
  };

  return (
    <Card variant="outlined" className={cn("p-6", colorClasses[color])}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm mt-2",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={cn("text-4xl", iconColorClasses[color])}>{icon}</div>
      </div>
    </Card>
  );
}
