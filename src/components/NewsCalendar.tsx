import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget: React.FC<{ widgetOptions: any; scriptSrc: string; theme: string }> = memo(({ widgetOptions, scriptSrc }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // Forcefully clear the container to ensure the old widget is removed
    currentContainer.innerHTML = '';

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(widgetOptions);
    
    currentContainer.appendChild(script);

  }, [widgetOptions, scriptSrc]); // Re-run effect when options change

  return (
    // The container is intentionally empty as the script will populate it.
    <div ref={container} style={{ height: '100%', width: '100%' }} />
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';

interface NewsCalendarProps {
  darkMode: boolean;
}

export default function NewsCalendar({ darkMode }: NewsCalendarProps) {
  const colorTheme = darkMode ? 'dark' : 'light';

  // Using useMemo to prevent re-creating options unless the theme changes
  const eventsWidgetOptions = React.useMemo(() => ({
    "width": "100%",
    "height": "100%",
    "colorTheme": colorTheme,
    "isTransparent": false,
    "locale": "en",
    "importanceFilter": "0,1",
    "countryFilter": "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
  }), [colorTheme]);

  const timelineWidgetOptions = React.useMemo(() => ({
    "feedMode": "all_symbols",
    "isTransparent": false,
    "displayMode": "regular",
    "width": "100%",
    "height": "100%",
    "colorTheme": colorTheme,
    "locale": "en"
  }), [colorTheme]);

  return (
    <div className="flex-1 flex flex-row p-1 gap-1 min-h-0">
      <div className="flex-1 bg-background-primary rounded-md p-1 overflow-hidden">
        <TradingViewWidget 
          widgetOptions={eventsWidgetOptions} 
          scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
          theme={colorTheme}
        />
      </div>
      <div className="flex-1 bg-background-primary rounded-md p-1 overflow-hidden">
        <TradingViewWidget 
          widgetOptions={timelineWidgetOptions} 
          scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
          theme={colorTheme}
        />
      </div>
    </div>
  );
} 