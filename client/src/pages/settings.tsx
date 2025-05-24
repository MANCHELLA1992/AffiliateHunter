import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, TestTube } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const [formData, setFormData] = useState({
    telegramBotToken: "",
    webhookUrl: "",
    defaultPostingInterval: 30,
    maxDealsPerDay: 50,
    notifications: true,
    autoPosting: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        telegramBotToken: settings.telegramBotToken || "",
        webhookUrl: settings.webhookUrl || "",
        defaultPostingInterval: settings.defaultPostingInterval || 30,
        maxDealsPerDay: settings.maxDealsPerDay || 50,
        notifications: settings.settings?.notifications || true,
        autoPosting: settings.settings?.autoPosting || true,
      });
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("PATCH", `/api/settings/${settings?.id}`, data),
    onSuccess: () => {
      toast({ title: "Settings updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: () => {
      toast({ title: "Failed to update settings", variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate({
      telegramBotToken: formData.telegramBotToken,
      webhookUrl: formData.webhookUrl,
      defaultPostingInterval: formData.defaultPostingInterval,
      maxDealsPerDay: formData.maxDealsPerDay,
      settings: {
        notifications: formData.notifications,
        autoPosting: formData.autoPosting,
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Settings" subtitle="Configure your DealBot Pro" />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-10 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
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
      <Header title="Settings" subtitle="Configure your DealBot Pro" />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Telegram Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Telegram Bot Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="botToken">Bot Token</Label>
                <Input
                  id="botToken"
                  type="password"
                  value={formData.telegramBotToken}
                  onChange={(e) => setFormData({ ...formData, telegramBotToken: e.target.value })}
                  placeholder="Enter your Telegram bot token"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Get your bot token from @BotFather on Telegram
                </p>
              </div>
              
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  placeholder="https://your-domain.com/api/telegram/webhook"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL where Telegram will send updates
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" size="sm">
                  Set Webhook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posting Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Posting Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postingInterval">Default Posting Interval (minutes)</Label>
                  <Input
                    id="postingInterval"
                    type="number"
                    value={formData.defaultPostingInterval}
                    onChange={(e) => setFormData({ ...formData, defaultPostingInterval: parseInt(e.target.value) })}
                    min="5"
                    max="1440"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Time between automatic posts
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="maxDealsPerDay">Max Deals Per Day</Label>
                  <Input
                    id="maxDealsPerDay"
                    type="number"
                    value={formData.maxDealsPerDay}
                    onChange={(e) => setFormData({ ...formData, maxDealsPerDay: parseInt(e.target.value) })}
                    min="1"
                    max="200"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Maximum deals to post per group per day
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Posting</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post deals to Telegram groups
                    </p>
                  </div>
                  <Switch
                    checked={formData.autoPosting}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoPosting: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Purchase Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when users make purchases through your links
                    </p>
                  </div>
                  <Switch
                    checked={formData.notifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scraping Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Scraping Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scraperFrequency">Scraper Run Frequency (minutes)</Label>
                <Input
                  id="scraperFrequency"
                  type="number"
                  placeholder="30"
                  min="5"
                  max="1440"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How often to run the deal scrapers
                </p>
              </div>
              
              <div>
                <Label htmlFor="minDiscount">Minimum Discount Percentage</Label>
                <Input
                  id="minDiscount"
                  type="number"
                  placeholder="20"
                  min="1"
                  max="90"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Only scrape deals with at least this discount
                </p>
              </div>
              
              <div>
                <Label htmlFor="excludeKeywords">Exclude Keywords</Label>
                <Textarea
                  id="excludeKeywords"
                  placeholder="Enter keywords to exclude (comma-separated)"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Deals containing these keywords will be ignored
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amazonApiKey">Amazon Associates API Key</Label>
                <Input
                  id="amazonApiKey"
                  type="password"
                  placeholder="Enter Amazon API key"
                />
              </div>
              
              <div>
                <Label htmlFor="flipkartApiKey">Flipkart Affiliate API Key</Label>
                <Input
                  id="flipkartApiKey"
                  type="password"
                  placeholder="Enter Flipkart API key"
                />
              </div>
              
              <div>
                <Label htmlFor="shortenerApiKey">URL Shortener API Key</Label>
                <Input
                  id="shortenerApiKey"
                  type="password"
                  placeholder="Enter URL shortener API key (optional)"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  For creating short affiliate links
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button 
              onClick={handleSave}
              disabled={updateSettingsMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
