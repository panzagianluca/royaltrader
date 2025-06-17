import { useEffect, useState, useRef } from 'react'
import { useTradingStore } from '@/store/trading'

interface ChartProps {
  darkMode: boolean
}

export default function Chart({ darkMode }: ChartProps) {
  const [isLoading, setIsLoading] = useState(true)
  const chartSymbol = useTradingStore((s) => s.chartSymbol)
  const positions = useTradingStore((s) => s.positions)
  const orders = useTradingStore((s) => s.orders)
  const widgetRef = useRef<any>(null)
  const orderMarkerMapRef = useRef<Map<string, any>>(new Map())

  // keep store prices in sync with what the chart shows (last close)
  const updatePrice = useTradingStore((s) => s.updatePrice)

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

        widgetRef.current = new (window as any).TradingView.widget({
          container_id: 'tradingview_chart',
          symbol: chartSymbol,
          interval: '15',
          theme: darkMode ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: darkMode ? '#1e293b' : '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: true,
          height: '100%',
          width: '100%',
          gridColor: "rgba(242, 242, 242, 0)",
          hide_side_toolbar: false,
          withdateranges: true,
          hide_legend: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          hide_volume: true,
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
  }, [darkMode, chartSymbol])

  // effect to draw position entry lines for current symbol
  useEffect(() => {
    if (!widgetRef.current) return
    const tvWidget = widgetRef.current

    const drawLines = () => {
      const chart = tvWidget.activeChart?.()
      if (!chart) return

      // clear previous shapes before drawing new ones
      chart.removeAllShapes()

      const symbolKey = chartSymbol.split(':')[1] ?? chartSymbol

      positions
        .filter((p) => p.symbol === symbolKey)
        .forEach((p) => {
          const line = chart.createShape(
            { price: p.openPrice },
            {
              shape: 'horizontal_line',
              disableSelection: true,
              disableSave: true,
              overrides: {
                linewidth: 1,
                linestyle: 2,
                linecolor: p.type === 'Buy' ? '#22c55e' : '#ef4444',
              },
            }
          )
          line.setText(
            `${p.type?.toUpperCase()} ${p.volume} | $${p.pnl.toFixed(2)}`
          )
        })
    }

    if (typeof tvWidget.onChartReady === 'function') {
      // `onChartReady` executes immediately if the chart is already ready,
      // otherwise it waits until readiness — covers both scenarios without
      // relying on non-existent `chart()` helper.
      tvWidget.onChartReady(drawLines)
    } else {
      // Fallback: try to draw right away if `activeChart` is already present.
      try {
        drawLines()
      } catch (err) {
        // noop – chart not ready yet
      }
    }
  }, [positions, chartSymbol])

  // effect to draw / update pending order markers
  useEffect(() => {
    if (!widgetRef.current) return

    const tvWidget = widgetRef.current

    const processMarkers = () => {
      const chart = tvWidget.activeChart?.()
      if (!chart) return

      const symbolKey = chartSymbol.split(':')[1] ?? chartSymbol

      const pendingOrders = orders.filter(
        (o) => o.status === 'pending' && o.symbol === symbolKey
      )

      const existingMap = orderMarkerMapRef.current

      // Remove stale markers
      existingMap.forEach((shape, orderId) => {
        const stillExists = pendingOrders.find((o) => o.id === orderId)
        if (!stillExists) {
          try {
            chart.removeEntity(shape)
          } catch {}
          existingMap.delete(orderId)
        }
      })

      // Add new markers
      pendingOrders.forEach((ord) => {
        if (existingMap.has(ord.id)) return

        const isBuy = ord.type.startsWith('Buy')
        const shape = chart.createShape(
          { price: ord.price },
          {
            shape: 'icon',
            icon: 0xf111, // simple dot icon (fa circle) – TradingView supports FontAwesome icons
            overrides: {
              color: isBuy ? '#22c55e' : '#ef4444',
              size: 8,
            },
            disableSelection: true,
            disableSave: true,
          }
        )

        shape.setText(`${ord.type}`)

        existingMap.set(ord.id, shape)
      })
    }

    if (typeof tvWidget.onChartReady === 'function') {
      tvWidget.onChartReady(processMarkers)
    } else {
      processMarkers()
    }
  }, [orders, chartSymbol])

  // keep store prices in sync with what the chart shows (last close)
  useEffect(() => {
    if (!widgetRef.current) return

    const interval = setInterval(() => {
      try {
        const chart = widgetRef.current.activeChart?.()
        if (!chart) return
        const series = chart.getSeries?.()
        if (!series || typeof series.data !== 'function') return

        const dataArr = series.data()
        if (!dataArr || !dataArr.length) return

        const lastBar: any = dataArr[dataArr.length - 1]
        const lastPrice =
          lastBar.close ?? lastBar.price ?? lastBar.value ?? lastBar.c ?? lastBar.o
        if (typeof lastPrice !== 'number' || isNaN(lastPrice)) return

        const symbolKey = chartSymbol.split(':')[1] ?? chartSymbol
        updatePrice(symbolKey, Number(lastPrice))
      } catch {}
    }, 2000)

    return () => clearInterval(interval)
  }, [chartSymbol])

  return (
    <div className="w-full h-full rounded-md overflow-hidden">
      <div className="h-full relative">
        <div className="tradingview-widget-container h-full">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div id="tradingview_chart" className="absolute -inset-px"></div>
          {/* Overlay to hide widget border */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-md border-0 border-b-2 border-b-background" />
        </div>
      </div>
    </div>
  )
}
