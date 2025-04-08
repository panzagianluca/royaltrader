import { useState, useEffect } from 'react'
import { Theme } from '@radix-ui/themes'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import TopNav from './components/TopNav'
import Chart from './components/Chart'
import BottomBanner from './components/BottomBanner'
import { themeConfig } from './styles/theme'
import './styles/theme.css'

function App() {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [bottomBannerExpanded, setBottomBannerExpanded] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : true // Default to dark mode
  })

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
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
      <div className="flex h-screen overflow-hidden bg-background-primary">
        <LeftSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />
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

export default App
