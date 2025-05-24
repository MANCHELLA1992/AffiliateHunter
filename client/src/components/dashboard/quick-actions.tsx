import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Clock, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const actions = [
    {
      title: "Post Manual Deal",
      icon: Plus,
      href: "/deals",
      color: "hover:border-primary hover:bg-primary/5 hover:text-primary",
      description: "Add a deal manually to post to groups"
    },
    {
      title: "Bulk Upload",
      icon: Upload,
      href: "/deals",
      color: "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600",
      description: "Upload multiple deals at once"
    },
    {
      title: "Schedule Posts",
      icon: Clock,
      href: "/settings",
      color: "hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600",
      description: "Configure posting schedule"
    },
    {
      title: "Export Reports",
      icon: Download,
      onClick: () => {
        toast({ title: "Generating report...", description: "Your analytics report will be ready shortly" });
      },
      color: "hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600",
      description: "Download performance analytics"
    },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const ActionButton = (
              <Button
                variant="ghost"
                className={`h-auto p-6 border-2 border-dashed border-border transition-all duration-200 ${action.color} flex-col space-y-2`}
                onClick={action.onClick}
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium text-center">{action.title}</span>
              </Button>
            );

            return action.href ? (
              <Link key={index} href={action.href}>
                {ActionButton}
              </Link>
            ) : (
              <div key={index}>
                {ActionButton}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
