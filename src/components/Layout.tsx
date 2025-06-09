import { useState } from 'react'
import { Theme } from '@radix-ui/themes'
import { AppSidebar as LeftSidebar } from './app-sidebar'
import RightSidebar from './RightSidebar'
import TopNav from './TopNav'
import Chart from './Chart'
import BottomBanner from './BottomBanner'
import { themeConfig } from '../styles/theme'
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import '@radix-ui/themes/styles.css'
import '../styles/theme.css'
import { Account } from "@/data/accounts";

function LeftSidebarToggleButton() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
      <PanelLeft className={`transition-transform duration-300 ${state === 'expanded' ? 'rotate-180' : ''}`} /> 
      <span className="sr-only">Toggle Left Sidebar</span>
    </Button>
  );
}

export default function Layout() {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [bottomBannerExpanded, setBottomBannerExpanded] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true
  })

  return (
    <Theme 
      {...themeConfig} 
      appearance={darkMode ? 'dark' : 'light'}
      accentColor="violet"
      grayColor="gray"
      radius="medium"
      scaling="100%"
    >
      <SidebarProvider defaultOpen={true}> 
        <div className="flex h-screen overflow-hidden bg-background-primary">
          <LeftSidebar 
            selectedAccount={selectedAccount} 
            onAccountSelect={setSelectedAccount} 
          />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center border-b border-gray-7 bg-background-primary">
              <LeftSidebarToggleButton />
              <div className="flex-1">
                <TopNav 
                  darkMode={darkMode} 
                  setDarkMode={setDarkMode} 
                  selectedAccount={selectedAccount}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <div className={`flex flex-1 min-h-0 transition-all duration-500 ease-in-out ${bottomBannerExpanded ? 'h-[calc(100%-200px)]' : 'h-[calc(100%-40px)]'}`}>
                <div className="flex-1">
                  <Chart darkMode={darkMode} />
                </div>
                <RightSidebar 
                  collapsed={rightSidebarCollapsed}
                  onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                />
              </div>
              <BottomBanner 
                isExpanded={bottomBannerExpanded}
                onToggleExpand={() => setBottomBannerExpanded(!bottomBannerExpanded)}
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Theme>
  )
}
