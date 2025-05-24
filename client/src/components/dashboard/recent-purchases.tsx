import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function RecentPurchases() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["/api/purchases/today"],
  });

  const { data: allPurchases } = useQuery({
    queryKey: ["/api/purchases"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Purchases</CardTitle>
            <div className="h-4 bg-muted rounded w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="purchase-card animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-1" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-16 mb-1" />
                  <div className="h-3 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentPurchases = allPurchases?.slice(0, 3) || [];
  const todaysCommission = purchases?.reduce((sum: number, purchase: any) => 
    sum + parseFloat(purchase.commission || "0"), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Purchases</CardTitle>
          <span className="text-sm text-muted-foreground">Via your affiliate links</span>
        </div>
      </CardHeader>
      <CardContent>
        {recentPurchases.length > 0 ? (
          <div className="space-y-4">
            {recentPurchases.map((purchase: any) => {
              const timeAgo = (() => {
                const now = new Date();
                const purchaseTime = new Date(purchase.createdAt);
                const diffMs = now.getTime() - purchaseTime.getTime();
                const diffMins = Math.floor(diffMs / (1000 * 60));
                
                if (diffMins < 1) return "Just now";
                if (diffMins < 60) return `${diffMins} min ago`;
                if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
                return purchaseTime.toLocaleDateString();
              })();

              return (
                <div key={purchase.id} className="purchase-card">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Purchase #{purchase.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        User: @{purchase.username || 'unknown'} • {timeAgo}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ₹{parseFloat(purchase.amount || "0").toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Comm: ₹{parseFloat(purchase.commission || "0").toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Today's Commission</span>
                <span className="text-lg font-bold text-green-600">
                  ₹{todaysCommission.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No purchases yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Purchases will appear here when users buy through your affiliate links
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
