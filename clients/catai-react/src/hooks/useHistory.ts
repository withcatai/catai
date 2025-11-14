import { useState, useCallback, useEffect } from 'react';
import { HistoryItem } from '../types';

const HISTORY_KEY = 'history';
const MAX_HISTORY = 40;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const addToHistory = useCallback((prompt: string) => {
    setHistory((prev) => {
      const newHistory = [
        { prompt, timestamp: Date.now() },
        ...prev,
      ].slice(0, MAX_HISTORY);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
