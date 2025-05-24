import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, MessageCircle, Settings } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Telegram() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupChatId, setNewGroupChatId] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ["/api/telegram-groups"],
  });

  const addGroupMutation = useMutation({
    mutationFn: (data: { name: string; chatId: string }) =>
      apiRequest("POST", "/api/telegram-groups", data),
    onSuccess: () => {
      toast({ title: "Telegram group added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-groups"] });
      setIsAddGroupOpen(false);
      setNewGroupName("");
      setNewGroupChatId("");
    },
    onError: () => {
      toast({ title: "Failed to add Telegram group", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <>
        <Header title="Telegram Groups" subtitle="Manage your Telegram channels" />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div>
                      <div className="h-5 bg-muted rounded w-32 mb-2" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
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
      <Header title="Telegram Groups" subtitle="Manage your Telegram channels" />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Connected Groups</h2>
            <p className="text-muted-foreground">Manage groups where deals are posted</p>
          </div>
          
          <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Telegram Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="chatId">Chat ID</Label>
                  <Input
                    id="chatId"
                    value={newGroupChatId}
                    onChange={(e) => setNewGroupChatId(e.target.value)}
                    placeholder="Enter chat ID (e.g., -1001234567890)"
                  />
                </div>
                <Button
                  onClick={() => addGroupMutation.mutate({ 
                    name: newGroupName, 
                    chatId: newGroupChatId 
                  })}
                  disabled={!newGroupName || !newGroupChatId || addGroupMutation.isPending}
                  className="w-full"
                >
                  Add Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.map((group: any) => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      <Badge variant={group.isActive ? "secondary" : "outline"}>
                        {group.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Members</span>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.memberCount?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deals today</span>
                    <span className="font-medium">{group.dealsPostedToday || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last post</span>
                    <span>
                      {group.lastPostAt 
                        ? new Date(group.lastPostAt).toLocaleDateString()
                        : "Never"
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Chat ID</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {group.chatId}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Test Post
                  </Button>
                  <Button 
                    variant={group.isActive ? "destructive" : "secondary"} 
                    size="sm"
                  >
                    {group.isActive ? "Pause" : "Resume"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!groups || groups.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Telegram groups connected</h3>
              <p className="text-muted-foreground mb-4">
                Add your first Telegram group to start posting deals automatically.
              </p>
              <Button onClick={() => setIsAddGroupOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
