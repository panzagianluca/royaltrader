import { useEffect, useState } from 'react'

interface ChartProps {
  darkMode: boolean
}

export default function Chart({ darkMode }: ChartProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTradingView = () => {
      if (document.getElementById('tradingview-widget-script')) {
        initializeWidget()
        return
      }

      const script = document.createElement('script')
      script.id = 'tradingview-widget-script'
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = () => {
        initializeWidget()
      }
      script.onerror = () => {
        console.error('Failed to load TradingView script')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeWidget = () => {
      try {
        if (typeof (window as any).TradingView === 'undefined') {
          console.error('TradingView widget not loaded')
          setIsLoading(false)
          return
        }

        new (window as any).TradingView.widget({
          container_id: 'tradingview_chart',
          symbol: 'FX:EURUSD',
          interval: '1',
          theme: darkMode ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: darkMode ? '#1e293b' : '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          height: '100%',
          width: '100%',
          hide_side_toolbar: false,
          withdateranges: true,
          hide_legend: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing TradingView widget:', error)
        setIsLoading(false)
      }
    }

    loadTradingView()

    return () => {
      const script = document.getElementById('tradingview-widget-script')
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [darkMode])

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800">
      <div className="h-full">
        <div className="tradingview-widget-container h-full">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div id="tradingview_chart" className="h-full"></div>
        </div>
      </div>
    </div>
  )
} 