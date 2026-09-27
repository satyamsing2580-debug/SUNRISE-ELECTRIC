import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const NetworkStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 ${
      !isOnline 
        ? 'bg-rose-600 text-white animate-pulse' 
        : 'bg-emerald-600 text-white'
    }`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>You are currently offline. Catalog is cached for offline browsing. Orders will sync once connected.</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 flex-shrink-0" />
          <span>Back online! Live Firestore database synchronized.</span>
        </>
      )}
    </div>
  );
};
