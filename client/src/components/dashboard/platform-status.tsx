import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PlatformStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: platforms, isLoading } = useQuery({
    queryKey: ["/api/platforms"],
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/actions/refresh-platforms"),
    onSuccess: () => {
      toast({ title: "Platforms refreshed successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
    },
    onError: () => {
      toast({ title: "Failed to refresh platforms", variant: "destructive" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-600 font-medium">Error</span>
          </div>
        );
      case "rate_limited":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-600 font-medium">Rate Limited</span>
          </div>
        );
      case "paused":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">Paused</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-600 font-medium">Unknown</span>
          </div>
        );
    }
  };

  const getLastScanText = (lastScanAt: string | null) => {
    if (!lastScanAt) return "Never";
    
    const now = new Date();
    const scanTime = new Date(lastScanAt);
    const diffMs = now.getTime() - scanTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
    return scanTime.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="platform-status-item animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-lg" />
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-1" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {platforms?.map((platform: any) => (
            <div key={platform.id} className="platform-status-item">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-20`}
                     style={{ 
                       backgroundColor: platform.color === 'orange-600' ? '#EA580C20' :
                                      platform.color === 'blue-600' ? '#2563EB20' :
                                      platform.color === 'purple-600' ? '#9333EA20' :
                                      platform.color === 'red-600' ? '#DC262620' :
                                      platform.color === 'pink-600' ? '#DB277720' : '#64748B20'
                     }}>
                  <i className={`${platform.icon}`} 
                     style={{ 
                       color: platform.color === 'orange-600' ? '#EA580C' :
                              platform.color === 'blue-600' ? '#2563EB' :
                              platform.color === 'purple-600' ? '#9333EA' :
                              platform.color === 'red-600' ? '#DC2626' :
                              platform.color === 'pink-600' ? '#DB2777' : '#64748B'
                     }} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{platform.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    Last scan: {getLastScanText(platform.lastScanAt)}
                  </p>
                </div>
              </div>
              {getStatusBadge(platform.status)}
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          Refresh All Platforms
        </Button>
      </CardContent>
    </Card>
  );
}
