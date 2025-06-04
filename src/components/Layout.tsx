import { useState } from 'react'
import { Theme } from '@radix-ui/themes'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import TopNav from './TopNav'
import Chart from './Chart'
import BottomBanner from './BottomBanner'
import { themeConfig } from '../styles/theme'
import '@radix-ui/themes/styles.css'
import '../styles/theme.css'

interface Account {
  id: string
  accountNumber: string
  balance: number
  type: 'demo' | 'live'
  isVisible?: boolean
  isActive?: boolean
}

export default function Layout() {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [bottomBannerExpanded, setBottomBannerExpanded] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true // Default to dark mode
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
      <div className="flex h-screen overflow-hidden bg-background-primary">
        <LeftSidebar 
          selectedAccount={selectedAccount} 
          onAccountSelect={setSelectedAccount} 
        />
        <div className="flex-1 flex flex-col">
          <TopNav 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            selectedAccount={selectedAccount}
          />
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
    </Theme>
  )
}
