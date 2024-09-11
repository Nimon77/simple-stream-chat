import "@/styles/globals.css";
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/socket');
  }, []);
  return <Component {...pageProps} />;
}
