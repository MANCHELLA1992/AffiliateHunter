import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, DollarSign, Settings, Plus } from "lucide-react";

export default function Affiliate() {
  const { data: programs, isLoading } = useQuery({
    queryKey: ["/api/affiliate-programs"],
  });

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
  });

  if (isLoading) {
    return (
      <>
        <Header title="Affiliate Programs" subtitle="Manage your affiliate partnerships" />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div>
                      <div className="h-5 bg-muted rounded w-32 mb-2" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
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
      <Header title="Affiliate Programs" subtitle="Manage your affiliate partnerships" />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Affiliate Programs</h2>
            <p className="text-muted-foreground">Configure tracking and commission settings</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms?.map((platform: any) => {
            const program = programs?.find((p: any) => p.platformId === platform.id);
            
            return (
              <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${platform.color.replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
                        <i className={`${platform.icon} text-${platform.color} text-xl`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{platform.displayName}</h3>
                        <Badge variant={program?.isActive ? "secondary" : "outline"}>
                          {program ? (program.isActive ? "Active" : "Inactive") : "Not Setup"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {program ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Commission Rate</Label>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">{program.commissionRate}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Program</Label>
                          <p className="font-medium">{program.programName}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Tracking ID</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                            {program.trackingId || "Not set"}
                          </code>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Test Link
                        </Button>
                        <Button size="sm" className="flex-1">
                          Update Config
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">
                        No affiliate program configured for this platform.
                      </p>
                      <Button size="sm">
                        Setup Program
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Global Affiliate Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultCommission">Default Commission Rate (%)</Label>
                <Input id="defaultCommission" type="number" placeholder="5.0" />
              </div>
              <div>
                <Label htmlFor="trackingDomain">Tracking Domain</Label>
                <Input id="trackingDomain" placeholder="track.yourdomain.com" />
              </div>
              <div>
                <Label htmlFor="linkFormat">Link Format Template</Label>
                <Input id="linkFormat" placeholder="{originalUrl}?ref={trackingId}" />
              </div>
              <div>
                <Label htmlFor="conversionWindow">Conversion Window (days)</Label>
                <Input id="conversionWindow" type="number" placeholder="30" />
              </div>
            </div>
            <Button className="w-full">Save Global Settings</Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
