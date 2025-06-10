import { useEffect } from 'react';
import Layout from './components/Layout'
import { useZoom } from './contexts/ZoomContext';

function App() {
  const { scale } = useZoom();

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * 16}px`;
  }, [scale]);

  return <Layout />
}

export default App
