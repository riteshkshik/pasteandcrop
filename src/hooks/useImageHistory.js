import { useState, useEffect } from 'react';

const HISTORY_KEY = 'image_history';
const MAX_HISTORY_ITEMS = 10;

export function useImageHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = async (blobUrl) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = () => {
        const base64data = reader.result;
        
        setHistory(prevHistory => {
          const newHistory = [
            { id: Date.now(), src: base64data, timestamp: new Date().toISOString() },
            ...prevHistory
          ].slice(0, MAX_HISTORY_ITEMS);
          
          // Helper to try saving with recursive reduction
          const trySave = (items) => {
            try {
              localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
              return items;
            } catch (e) {
              if (e.name === 'QuotaExceededError' && items.length > 0) {
                // Remove oldest and try again
                return trySave(items.slice(0, -1));
              }
              return items; // Failed to save, return what we have (or handle error differently)
            }
          };

          const savedItems = trySave(newHistory);
          return savedItems;
        });
      };
    } catch (error) {
      console.error("Failed to add to history:", error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const removeFromHistory = (id) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return { history, addToHistory, clearHistory, removeFromHistory };
}
