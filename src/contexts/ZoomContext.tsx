import React, { createContext, useContext, useState, useMemo } from 'react';

interface ZoomContextType {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
};

interface ZoomProviderProps {
  children: React.ReactNode;
}

export const ZoomProvider: React.FC<ZoomProviderProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 1.2));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.8));
  };
  
  const value = useMemo(() => ({ scale, zoomIn, zoomOut }), [scale]);

  return (
    <ZoomContext.Provider value={value}>
      {children}
    </ZoomContext.Provider>
  );
}; 