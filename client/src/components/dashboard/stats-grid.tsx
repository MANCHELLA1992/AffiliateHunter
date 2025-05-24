import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, MessageCircle, Tags, MousePointer } from "lucide-react";

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-8 bg-muted rounded w-16" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Deals",
      value: stats?.activeDeals || 0,
      change: "+12% from last week",
      changeType: "positive",
      icon: Tags,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Today's Revenue",
      value: `₹${stats?.todayRevenue?.toLocaleString() || 0}`,
      change: "+8% from yesterday",
      changeType: "positive",
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Click-through Rate",
      value: `${stats?.clickThroughRate?.toFixed(1) || 0}%`,
      change: "-0.2% from average",
      changeType: "negative",
      icon: MousePointer,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: "Telegram Groups",
      value: stats?.telegramGroups || 0,
      change: "2 active campaigns",
      changeType: "neutral",
      icon: MessageCircle,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === "positive" ? "text-green-600" :
                    stat.changeType === "negative" ? "text-red-600" :
                    "text-muted-foreground"
                  }`}>
                    {stat.changeType === "positive" && <TrendingUp className="w-3 h-3 mr-1" />}
                    {stat.changeType === "negative" && <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${stat.iconColor} text-xl`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
