import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus } from "lucide-react";
import { Link } from "wouter";

export default function TelegramGroups() {
  const { data: groups, isLoading } = useQuery({
    queryKey: ["/api/telegram-groups"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Telegram Groups</CardTitle>
            <div className="h-8 bg-muted rounded w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-1" />
                    <div className="h-3 bg-muted rounded w-40" />
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-12" />
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
        <div className="flex items-center justify-between">
          <CardTitle>Telegram Groups</CardTitle>
          <Link href="/telegram">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" />
              Add Group
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {groups && groups.length > 0 ? (
          <div className="space-y-4">
            {groups.slice(0, 3).map((group: any) => (
              <div key={group.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="text-blue-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {group.memberCount?.toLocaleString() || 0} members • {group.dealsPostedToday || 0} deals today
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${group.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`text-sm font-medium ${group.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                    {group.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No Telegram groups connected</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add groups to start posting deals automatically
            </p>
            <Link href="/telegram">
              <Button size="sm" className="mt-3">
                <Plus className="w-4 h-4 mr-2" />
                Add First Group
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
