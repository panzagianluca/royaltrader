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
import { SidebarProvider } from "@/components/ui/sidebar"
import '@radix-ui/themes/styles.css'
import '../styles/theme.css'
import { Account } from "@/data/accounts";
import { usePersistedState } from "@/hooks/usePersistedState"
import { AppToaster } from "@/components/ui/notifications";
import { useAccountStore } from "@/store/accountStore";

export default function Layout() {
  const [currentPage, setCurrentPage] = useState('chart');
  const [darkMode, setDarkMode] = usePersistedState<boolean>(
    'ui.darkMode',
    true
  )
  const [bottomBannerExpanded, setBottomBannerExpanded] = usePersistedState<boolean>(
    'ui.bottomBannerExpanded',
    true
  )
  const [sidebarOpen, setSidebarOpen] = usePersistedState<boolean>(
    'ui.sidebarExpanded',
    true
  )
  const { selectedAccountId, accounts, selectAccount } = useAccountStore()
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // sync selectedAccount when store id changes
  useEffect(() => {
    const acct = accounts.find((a: any) => a.id === selectedAccountId) as Account | undefined
    setSelectedAccount(acct ?? null)
  }, [selectedAccountId, accounts])

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
      <AppToaster />
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex h-screen bg-sidebar w-full">
          <LeftSidebar 
            selectedAccount={selectedAccount} 
            onAccountSelect={(acct) => {
              setIsSwitchingAccount(true)
              selectAccount(acct.id)
              // mimic async load
              setTimeout(() => setIsSwitchingAccount(false), 300)
            }} 
            navigateTo={navigateTo}
            currentPage={currentPage}
          />
          
          <div className="relative flex-1 flex flex-col">
            {isSwitchingAccount && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div style={{height: '50px'}} className="flex items-center px-1 pt-1">
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

