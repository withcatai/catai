import { useState, useCallback, useEffect } from 'react';
import { useIndexedDB } from './useIndexedDB';
import { StoredChatSession } from '../types/chatHistory';

export function useRecentChats() {
  const { isReady, getAllSessions } = useIndexedDB();
  const [recentChats, setRecentChats] = useState<StoredChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRecentChats = useCallback(async () => {
    if (!isReady) return;

    setIsLoading(true);
    try {
      const sessions = await getAllSessions();
      setRecentChats(sessions);
    } catch (error) {
      console.error('Failed to load recent chats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isReady, getAllSessions]);

  // Load chats on mount and when isReady changes
  useEffect(() => {
    loadRecentChats();
  }, [loadRecentChats]);

  // Refresh chats periodically to catch updates
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      loadRecentChats();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [isReady, loadRecentChats]);

  return {
    recentChats,
    isLoading,
    refresh: loadRecentChats,
  };
}
