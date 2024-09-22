import { useEffect } from 'react';

function InternetStatus() {
  useEffect(() => {
    const handleOnline = () => {
      window.alert('You are back online!');
    };

    const handleOffline = () => {
      window.alert('You have lost your internet connection!');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null; // Không render gì trong UI
}

export default InternetStatus;
