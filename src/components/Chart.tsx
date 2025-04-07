import { useEffect } from 'react'
import { useTrading } from '../context/TradingContext'

export default function Chart() {
  const { symbol, setSymbol } = useTrading()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      new (window as any).TradingView.widget({
        container_id: 'tradingview_chart',
        symbol: `BINANCE:${symbol}`,
        interval: '1',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies'
        ],
        height: '100%',
        width: '100%',
        hide_side_toolbar: false,
        withdateranges: true,
        hide_legend: false,
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
        // Add symbol change callback
        custom_indicators_getter: (PineJS: any) => {
          return Promise.resolve([])
        },
        symbol_search_request_delay: 500,
        auto_save_delay: 5,
        // Listen for symbol changes
        onSymbolChange: (symbolData: string) => {
          const cleanSymbol = symbolData.replace('BINANCE:', '')
          setSymbol(cleanSymbol)
        },
      })
    }
    document.head.appendChild(script)

    return () => {
      const script = document.getElementById('tradingview-widget-script')
      if (script) {
        document.head.removeChild(script)
      }
    }
  }, [setSymbol]) // Only re-run if setSymbol changes

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800">
      <div className="h-full">
        <div className="tradingview-widget-container h-full">
          <div id="tradingview_chart" className="h-full"></div>
          <div className="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
              <span className="blue-text">Track all markets on TradingView</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 