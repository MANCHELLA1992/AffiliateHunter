import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Tags, 
  Worm, 
  MessageCircle, 
  Link as LinkIcon, 
  TrendingUp, 
  Settings,
  Bot
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Active Deals", href: "/deals", icon: Tags },
  { name: "Scrapers", href: "/scrapers", icon: Worm },
  { name: "Telegram Groups", href: "/telegram", icon: MessageCircle },
  { name: "Affiliate Links", href: "/affiliate", icon: LinkIcon },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar-background shadow-lg flex-shrink-0 hidden lg:block border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Bot className="text-sidebar-primary-foreground text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">DealBot Pro</h1>
            <p className="text-sm text-sidebar-foreground/70">v2.1.0</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "sidebar-nav-item",
                isActive && "active"
              )}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
