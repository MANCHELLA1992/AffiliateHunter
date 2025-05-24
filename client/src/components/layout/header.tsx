import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, User, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-background shadow-sm border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Bot Status: Active</span>
          </div>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Notifications</span>
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="text-primary-foreground text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
