import { useState, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import { AppSidebar as LeftSidebar } from './app-sidebar'
import TopNav from './TopNav'
import Chart from './Chart'
import Watchlist from './Watchlist'
import OrderEntry from './OrderEntry'
import BottomBanner from './BottomBanner'
import NewsCalendar from './NewsCalendar'
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
  const [currentPage, setCurrentPage] = useState('chart');
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

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'chart':
        return (
          <>
            <div className="flex-1 flex flex-row p-1 gap-1 min-h-0">
              <div className="flex-1 bg-background-primary rounded-md p-0.5">
                <Chart darkMode={darkMode} />
              </div>
              <div style={{flexBasis: '20%'}} className="flex flex-col gap-1">
                <div className="flex-1 min-h-0 bg-background-primary rounded-2xl p-1">
                  <Watchlist />
                </div>
                <div className="flex-1 min-h-0 bg-background-primary rounded-2xl p-1">
                  <OrderEntry />
                </div>
              </div>
            </div>
            <div className={`p-1 transition-all duration-500 ease-in-out ${bottomBannerExpanded ? 'h-[250px]' : 'h-[56px]'}`}>
              <BottomBanner 
                isExpanded={bottomBannerExpanded}
                onToggleExpand={() => setBottomBannerExpanded(!bottomBannerExpanded)}
              />
            </div>
          </>
        );
      case 'news-calendar':
        return <NewsCalendar darkMode={darkMode} />;
      default:
        return <div>Page not found</div>;
    }
  };

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
        <div className="flex h-screen bg-sidebar w-full">
          <LeftSidebar 
            selectedAccount={selectedAccount} 
            onAccountSelect={setSelectedAccount} 
            navigateTo={navigateTo}
            currentPage={currentPage}
          />
          
          <div className="flex-1 flex flex-col">
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
            {renderContent()}
          </div>
        </div>
      </SidebarProvider>
    </Theme>
  )
}

