import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Eye, MousePointer, ShoppingBag } from "lucide-react";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: purchases } = useQuery({
    queryKey: ["/api/purchases"],
  });

  const { data: deals } = useQuery({
    queryKey: ["/api/deals"],
  });

  const totalRevenue = purchases?.reduce((sum: number, purchase: any) => 
    sum + parseFloat(purchase.amount || "0"), 0) || 0;

  const totalCommission = purchases?.reduce((sum: number, purchase: any) => 
    sum + parseFloat(purchase.commission || "0"), 0) || 0;

  const topDeals = deals?.slice(0, 5) || [];

  return (
    <>
      <Header title="Analytics" subtitle="Performance insights and metrics" />
      <main className="flex-1 overflow-auto p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5% vs last month
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Commission</p>
                  <p className="text-3xl font-bold">₹{totalCommission.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.3% vs last month
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="text-blue-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{stats?.todayViews?.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-red-600">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    -2.1% vs yesterday
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-purple-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold">{stats?.todayClicks?.toLocaleString()}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +5.7% vs yesterday
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="text-orange-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performing Deals */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDeals.map((deal: any, index: number) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{deal.title}</h4>
                        <p className="text-sm text-muted-foreground">{deal.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{deal.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MousePointer className="w-4 h-4" />
                          <span>{deal.clicks || 0}</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-green-600">
                        CTR: {deal.views > 0 ? ((deal.clicks || 0) / deal.views * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Purchases */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases?.slice(0, 5).map((purchase: any) => (
                  <div key={purchase.id} className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Purchase #{purchase.id}</h4>
                        <p className="text-sm text-muted-foreground">
                          {purchase.username} • {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{parseFloat(purchase.amount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Commission: ₹{parseFloat(purchase.commission).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Amazon", "Flipkart", "Ajio"].map((platform) => (
                <div key={platform} className="text-center p-6 rounded-lg border">
                  <h3 className="font-semibold text-lg mb-2">{platform}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Deals Posted</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 50) + 10}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Clicks</span>
                      <Badge variant="outline">{Math.floor(Math.random() * 1000) + 100}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conversions</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 20) + 5}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-green-600">
                        ₹{(Math.random() * 50000 + 10000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
