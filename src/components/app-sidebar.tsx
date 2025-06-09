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
} from "@/components/ui/sidebar"
import AccountManageModal from "./AccountManageModal"
import { accountsData, Account } from "@/data/accounts";

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
      url: "#",
      icon: CandlestickChart,
      isActive: true,
    },
    {
      name: "Risk Management",
      url: "#",
      icon: ShieldCheck,
    },
    {
      name: "News Calendar",
      url: "#",
      icon: Newspaper,
    },
    {
      name: "History & Analysis",
      url: "#",
      icon: History,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedAccount: Account | null;
  onAccountSelect: (account: Account) => void;
}

export function AppSidebar({ selectedAccount, onAccountSelect, ...props }: AppSidebarProps) {
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false)
  const [accounts, setAccounts] = React.useState(accountsData);

  const handleManageClick = () => {
    setIsManageModalOpen(true)
  }

  const handleUpdateAccounts = (updatedAccounts: any) => {
    setAccounts(updatedAccounts);
  };

  const visibleAccounts = accounts.filter(account => account.isVisible);

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
          />
          <NavProjects title="Navigation" projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
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
