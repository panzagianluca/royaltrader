import { useState, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import { AppSidebar as LeftSidebar } from './app-sidebar'
import TopNav from './TopNav'
import Chart from './Chart'
import Watchlist from './Watchlist'
import OrderEntry from './OrderEntry'
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
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 hover:bg-transparent">
      <PanelLeft className={`transition-transform duration-300 ${state === 'expanded' ? 'rotate-180' : ''}`} /> 
      <span className="sr-only">Toggle Left Sidebar</span>
    </Button>
  );
}

export default function Layout() {
  const [bottomBannerExpanded, setBottomBannerExpanded] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

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
        {/* Main App Container */}
        <div className="flex h-screen bg-sidebar w-full">
          {/* Column A: Left Sidebar */}
          <LeftSidebar 
            selectedAccount={selectedAccount} 
            onAccountSelect={setSelectedAccount} 
          />
          
          {/* Column B: Main Content Area */}
          <div className="flex-1 flex flex-col">
            
            {/* Row B.1: Top Navigation Bar */}
            <div style={{height: '50px'}} className="flex items-center px-1 pt-1">
              <LeftSidebarToggleButton />
              <div className="flex-1">
                <TopNav 
                  darkMode={darkMode} 
                  setDarkMode={setDarkMode} 
                  selectedAccount={selectedAccount}
                />
              </div>
            </div>

            {/* Row B.2: Middle Section (Chart + Right Sidebar) */}
            <div className="flex-1 flex flex-row p-1 gap-1 min-h-0">
              {/* Sub-Column 1: TradingView Chart */}
              <div className="flex-1 bg-background-primary rounded-md p-0.5">
                <Chart darkMode={darkMode} />
              </div>

              {/* Sub-Column 2: Right Sidebar */}
              <div style={{flexBasis: '20%'}} className="flex flex-col gap-1">
                <div className="flex-1 min-h-0 bg-background-primary rounded-2xl p-1">
                  <Watchlist />
                </div>
                <div className="flex-1 min-h-0 bg-background-primary rounded-2xl p-1">
                  <OrderEntry />
                </div>
              </div>
            </div>

            {/* Row B.3: Bottom Terminal */}
            <div className={`p-1 transition-all duration-500 ease-in-out ${bottomBannerExpanded ? 'h-[250px]' : 'h-[56px]'}`}>
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

