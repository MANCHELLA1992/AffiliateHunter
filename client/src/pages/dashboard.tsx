import Header from "@/components/layout/header";
import StatsGrid from "@/components/dashboard/stats-grid";
import RecentDeals from "@/components/dashboard/recent-deals";
import PlatformStatus from "@/components/dashboard/platform-status";
import TelegramGroups from "@/components/dashboard/telegram-groups";
import RecentPurchases from "@/components/dashboard/recent-purchases";
import QuickActions from "@/components/dashboard/quick-actions";

export default function Dashboard() {
  return (
    <>
      <Header 
        title="Dashboard Overview" 
        subtitle="Monitor your affiliate deal performance" 
      />
      <main className="flex-1 overflow-auto p-6">
        <StatsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RecentDeals />
          </div>
          <PlatformStatus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TelegramGroups />
          <RecentPurchases />
        </div>

        <QuickActions />
      </main>
    </>
  );
}
