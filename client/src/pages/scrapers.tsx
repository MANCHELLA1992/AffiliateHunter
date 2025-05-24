import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, Play, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Scrapers() {
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

  const runScraperMutation = useMutation({
    mutationFn: (platformId: number) => 
      apiRequest("POST", "/api/scrapers/run", { platformId }),
    onSuccess: () => {
      toast({ title: "Scraper started successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
    },
    onError: () => {
      toast({ title: "Failed to start scraper", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <>
        <Header title="Scrapers" subtitle="Manage platform scrapers" />
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                      <div>
                        <div className="h-5 bg-muted rounded w-32 mb-2" />
                        <div className="h-4 bg-muted rounded w-48" />
                      </div>
                    </div>
                    <div className="h-10 bg-muted rounded w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Scrapers" subtitle="Manage platform scrapers" />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Platform Scrapers</h2>
            <p className="text-muted-foreground">Configure and monitor your deal scrapers</p>
          </div>
          <Button 
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </div>

        <div className="space-y-4">
          {platforms?.map((platform: any) => (
            <Card key={platform.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${platform.color.replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
                      <i className={`${platform.icon} text-${platform.color} text-xl`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{platform.displayName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          Last scan: {platform.lastScanAt 
                            ? new Date(platform.lastScanAt).toLocaleString()
                            : "Never"
                          }
                        </span>
                        <Badge 
                          variant={platform.status === "active" ? "secondary" : 
                                 platform.status === "error" ? "destructive" : "outline"}
                        >
                          {platform.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={platform.isActive}
                        onCheckedChange={(checked) => {
                          // Update platform status
                        }}
                      />
                      <span className="text-sm">Active</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runScraperMutation.mutate(platform.id)}
                      disabled={runScraperMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
