import {useCallback, useEffect, useMemo, useState} from 'react';
import {useIndexedDB} from './useIndexedDB';
import {StoredChatSession} from '../types/chatHistory';

const ITEMS_PER_PAGE = 10;

export function useRecentChats() {
    const {isReady, getAllSessions} = useIndexedDB();
    const [allChats, setAllChats] = useState<StoredChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);

    const loadAllChats = useCallback(async () => {
        if (!isReady) return;

        setIsLoading(true);
        try {
            const sessions = await getAllSessions();
            setAllChats(sessions);
            setPage(0);
        } catch (error) {
            console.error('Failed to load recent chats:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isReady, getAllSessions]);

    // Search or filter chats
    const filteredChats = useMemo(() => {
        if (!searchQuery.trim()) {
            return allChats;
        }

        const query = searchQuery.toLowerCase();
        return allChats.filter((chat) =>
            chat.title.toLowerCase().includes(query)
        );
    }, [allChats, searchQuery]);

    // Paginated results
    const displayedChats = useMemo(() => {
        return filteredChats.slice(0, (page + 1) * ITEMS_PER_PAGE);
    }, [filteredChats, page]);

    const hasMore = useMemo(() => {
        return displayedChats.length < filteredChats.length;
    }, [displayedChats.length, filteredChats.length]);

    // Handle search with debounce
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setPage(0);
    }, []);

    // Load chats on mount and when isReady changes
    useEffect(() => {
        loadAllChats();
    }, [loadAllChats]);

    // Refresh chats periodically to catch updates
    useEffect(() => {
        if (!isReady) return;

        const interval = setInterval(() => {
            loadAllChats();
        }, 2000); // Refresh every 2 seconds

        return () => clearInterval(interval);
    }, [isReady, loadAllChats]);

    const loadMore = useCallback(() => {
        setPage((p) => p + 1);
    }, []);

    return {
        recentChats: displayedChats,
        allChats,
        isLoading,
        searchQuery,
        setSearchQuery: handleSearch,
        hasMore,
        loadMore,
        refresh: loadAllChats,
    };
}
