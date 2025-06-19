import * as React from "react"
import {
  Wallet,
  LineChart,
  Settings2,
  Terminal,
  CandlestickChart,
  ShieldCheck,
  Newspaper,
  History,
  Wifi, 
  WifiOff, 
  Signal
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import AccountManageModal from "./AccountManageModal"
import { accountsData, Account } from "@/data/accounts";
import { useAccountStore } from "@/store/accountStore";
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  markets: [
    {
      name: "Royal Trader",
      logo: LineChart,
      plan: "Forex",
    },
  ],
  navMain: [
    {
      title: "Accounts",
      items: [
        {
          title: "Live",
          url: "#",
          icon: Wallet,
          items: [],
        },
        {
          title: "Demo",
          url: "#",
          icon: Terminal,
          items: [],
        },
        {
          title: "Manage",
          url: "#",
          icon: Settings2,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Chart",
      url: "chart",
      icon: CandlestickChart,
      isActive: true,
    },
    {
      name: "Risk Management",
      url: "risk-management",
      icon: ShieldCheck,
    },
    {
      name: "News Calendar",
      url: "news-calendar",
      icon: Newspaper,
    },
    {
      name: "History & Analysis",
      url: "history-analysis",
      icon: History,
    },
    {
      name: "Settings",
      url: "settings",
      icon: Settings2,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedAccount: Account | null;
  onAccountSelect: (account: Account) => void;
  navigateTo: (page: string) => void;
  currentPage: string;
}

type ConnectionStatus = 'Good' | 'Regular' | 'Bad' | 'Disconnected';

function ConnectionStatusIndicator() {
  const { open } = useSidebar();
  const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStatus>('Good');
  const [latency, setLatency] = React.useState(0);

  React.useEffect(() => {
    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * (120 - 20 + 1)) + 20);
    }, 2000);

    const statusInterval = setInterval(() => {
      setConnectionStatus(prevStatus => {
        if (prevStatus === 'Good') return 'Regular';
        if (prevStatus === 'Regular') return 'Bad';
        if (prevStatus === 'Bad') return 'Disconnected';
        return 'Good';
      });
    }, 5000);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(statusInterval);
    };
  }, []);

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'Good':
        return <Wifi size={16} className="text-green-500" />;
      case 'Regular':
        return <Wifi size={16} className="text-yellow-500" />;
      case 'Bad':
        return <Wifi size={16} className="text-orange-500" />;
      case 'Disconnected':
        return <WifiOff size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-2 py-1">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="cursor-default h-6 w-6 p-0">
          {getConnectionStatusIcon()}
        </Button>
        {open && (
          <span className="text-xs text-muted-foreground">
            Connection: {connectionStatus}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="cursor-default h-6 w-6 p-0">
          <Signal size={16} className="text-blue-500" />
        </Button>
        {open && (
          <span className="text-xs text-muted-foreground">Latency: {latency}ms</span>
        )}
      </div>

      <Separator />
    </div>
  )
}

export function AppSidebar({ selectedAccount, onAccountSelect, navigateTo, currentPage, ...props }: AppSidebarProps) {
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false)
  const [accounts, setAccounts] = React.useState(accountsData);
  const { selectedAccountId } = useAccountStore()

  const handleManageClick = () => {
    setIsManageModalOpen(true)
  }

  const handleUpdateAccounts = (updatedAccounts: any) => {
    setAccounts(updatedAccounts);
  };

  const visibleAccounts = accounts.filter(account => account.isVisible);

  const projectsWithActiveState = data.projects.map(project => ({
    ...project,
    isActive: project.url === currentPage,
  }));

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.markets} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain 
            items={data.navMain} 
            onManageClick={handleManageClick} 
            accounts={visibleAccounts}
            onAccountClick={onAccountSelect}
            activeAccountId={selectedAccountId ?? undefined}
          />
          <NavProjects title="Navigation" projects={projectsWithActiveState} navigateTo={navigateTo} />
        </SidebarContent>
        <SidebarFooter>
          <ConnectionStatusIndicator />
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <AccountManageModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        accounts={accounts}
        onUpdateAccounts={handleUpdateAccounts}
      />
    </>
  )
}
