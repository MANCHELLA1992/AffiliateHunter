import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MousePointer, ExternalLink, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Deals() {
  const { data: deals, isLoading } = useQuery({
    queryKey: ["/api/deals"],
  });

  if (isLoading) {
    return (
      <>
        <Header title="Active Deals" subtitle="Manage your scraped deals" />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-20" />
                    <div className="h-6 bg-muted rounded w-16" />
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
      <Header title="Active Deals" subtitle="Manage your scraped deals" />
      <main className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals?.map((deal: any) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {deal.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={deal.imageUrl} 
                    alt={deal.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{deal.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                      <DropdownMenuItem>Post to Telegram</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {deal.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-green-600">
                      ₹{parseFloat(deal.salePrice).toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{parseFloat(deal.originalPrice).toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {deal.discountPercentage}% OFF
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{deal.views || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer className="w-4 h-4" />
                      <span>{deal.clicks || 0}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{deal.category}</Badge>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => window.open(deal.affiliateUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Deal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!deals || deals.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No deals found. Run the scrapers to fetch new deals.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
