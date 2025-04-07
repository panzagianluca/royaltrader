import { useEffect, useRef } from 'react'

export default function Watchlist() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "1M",
      "showChart": true,
      "locale": "en",
      "width": "100%",
      "height": "100%",
      "isTransparent": false,
      "showSymbolLogo": true,
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(42, 46, 57, 0)",
      "scaleFontColor": "rgba(219, 219, 219, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Indices",
          "symbols": [
            {"s": "FOREXCOM:SPXUSD", "d": "S&P 500"},
            {"s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100"},
            {"s": "FOREXCOM:DJI", "d": "Dow 30"}
          ]
        },
        {
          "title": "Forex",
          "symbols": [
            {"s": "FX:EURUSD", "d": "EUR/USD"},
            {"s": "FX:GBPUSD", "d": "GBP/USD"},
            {"s": "FX:USDJPY", "d": "USD/JPY"}
          ]
        },
        {
          "title": "Crypto",
          "symbols": [
            {"s": "BINANCE:BTCUSDT", "d": "BTC/USD"},
            {"s": "BINANCE:ETHUSDT", "d": "ETH/USD"}
          ]
        }
      ]
    })

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b dark:border-gray-700">
        <h3 className="font-medium dark:text-white">Watchlist</h3>
      </div>
      <div 
        ref={containerRef}
        className="tradingview-widget-container flex-1"
      >
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  )
}
