import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MousePointer, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RecentDeals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deals, isLoading } = useQuery({
    queryKey: ["/api/deals/active"],
  });

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
  });

  const trackClickMutation = useMutation({
    mutationFn: (dealId: number) => apiRequest("POST", `/api/deals/${dealId}/click`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals/active"] });
    },
  });

  const handleDealClick = (deal: any) => {
    trackClickMutation.mutate(deal.id);
    window.open(deal.affiliateUrl, '_blank');
    toast({ title: "Tracking click...", description: `Opened ${deal.title}` });
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Deals Posted</CardTitle>
            <div className="h-4 bg-muted rounded w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="deal-card animate-pulse">
                <div className="w-16 h-16 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentDeals = deals?.slice(0, 3) || [];
  const platformMap = platforms?.reduce((acc: any, platform: any) => {
    acc[platform.id] = platform;
    return acc;
  }, {}) || {};

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Deals Posted</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentDeals.length > 0 ? (
          <div className="space-y-4">
            {recentDeals.map((deal: any) => {
              const platform = platformMap[deal.platformId];
              const discountAmount = parseFloat(deal.originalPrice) - parseFloat(deal.salePrice);
              
              return (
                <div 
                  key={deal.id} 
                  className="deal-card cursor-pointer"
                  onClick={() => handleDealClick(deal)}
                >
                  <img 
                    src={deal.imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=64&h=64&fit=crop`}
                    alt={deal.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=64&h=64&fit=crop`;
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{deal.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {platform?.displayName || "Unknown"} • {deal.category}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-green-600">
                        ₹{parseFloat(deal.salePrice).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{parseFloat(deal.originalPrice).toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        {deal.discountPercentage}% OFF
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{deal.views || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
                      <MousePointer className="w-4 h-4" />
                      <span>{deal.clicks || 0} clicks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent deals found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Run the scrapers to fetch new deals
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
