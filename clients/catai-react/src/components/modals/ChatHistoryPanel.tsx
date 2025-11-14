import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Clock, Search, Trash2} from 'lucide-react';
import {useIndexedDB} from '../../hooks/useIndexedDB';
import {ChatSearchResult, StoredChatSession} from '../../types/chatHistory';
import {Button} from '../ui/Button';

interface ChatHistoryPanelProps {
    onSelectSession: (session: StoredChatSession) => void;
    onLoadSession: (sessionId: string) => Promise<void>;
}

export const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
                                                                      onSelectSession,
                                                                      onLoadSession,
                                                                  }) => {
    const {searchSessions, getSession, deleteSession} = useIndexedDB();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<ChatSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const RESULTS_PER_PAGE = 20;

    // Search with debounce
    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                setPage(0);
                return;
            }

            setLoading(true);
            try {
                const searchResults = await searchSessions(searchQuery, RESULTS_PER_PAGE);
                setResults(searchResults);
                setPage(0);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, searchSessions]);

    const handleSelectSession = useCallback(
        async (result: ChatSearchResult) => {
            try {
                const session = await getSession(result.sessionId);
                if (session) {
                    onSelectSession(session);
                    await onLoadSession(result.sessionId);
                }
            } catch (error) {
                console.error('Failed to load session:', error);
            }
        },
        [getSession, onSelectSession, onLoadSession]
    );

    const handleDeleteSession = useCallback(
        async (sessionId: string, e: React.MouseEvent) => {
            e.stopPropagation();
            try {
                await deleteSession(sessionId);
                setResults((prev) => prev.filter((r) => r.sessionId !== sessionId));
            } catch (error) {
                console.error('Failed to delete session:', error);
            }
        },
        [deleteSession]
    );

    const formatDate = useCallback((timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    }, []);

    const displayedResults = useMemo(
        () => results.slice(0, (page + 1) * RESULTS_PER_PAGE),
        [results, page]
    );

    const canLoadMore = useMemo(
        () => displayedResults.length < results.length,
        [displayedResults.length, results.length]
    );

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                {searchQuery && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto">
                {loading && !displayedResults.length && (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-slate-500 dark:text-slate-400">Searching...</div>
                    </div>
                )}

                {!searchQuery && !displayedResults.length && (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <Clock className="w-8 h-8 text-slate-400 mb-2"/>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Search your chat history
                        </p>
                    </div>
                )}

                {searchQuery && !loading && displayedResults.length === 0 && (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-slate-500 dark:text-slate-400">No results found</div>
                    </div>
                )}

                <AnimatePresence>
                    {displayedResults.map((result, index) => (
                        <motion.div
                            key={result.sessionId}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{delay: index * 0.05}}
                            onClick={() => handleSelectSession(result)}
                            className="p-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-slate-900 dark:text-white truncate">
                                        {result.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                        {result.preview}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                        {formatDate(result.updatedAt)}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => handleDeleteSession(result.sessionId, e)}
                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Delete session"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400"/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Load More */}
                {canLoadMore && (
                    <div className="p-4 text-center">
                        <Button
                            onClick={() => setPage((p) => p + 1)}
                            variant="secondary"
                            size="sm"
                            className="w-full"
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
