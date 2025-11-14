import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Clock, Settings, X, Zap} from 'lucide-react';
import {StoredChatSession} from '../../types/chatHistory';
import {useRecentChats} from '../../hooks/useRecentChats';

interface SidebarWithHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    onSettingsClick: () => void;
    onClearClick: () => void;
    onSelectChatSession: (session: StoredChatSession) => void;
    onLoadChatSession: (sessionId: string) => Promise<void>;
    isAdmin: boolean;
    isConnected: boolean;
}

export const SidebarWithHistory: React.FC<SidebarWithHistoryProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          onSettingsClick,
                                                                          onClearClick,
                                                                          onLoadChatSession,
                                                                          isAdmin,
                                                                          isConnected,
                                                                      }) => {
    const {recentChats, searchQuery, setSearchQuery, hasMore, loadMore} = useRecentChats();

    const handleSelectChat = (session: StoredChatSession) => {
        onLoadChatSession(session.id);
        onClose();
    };

    return (
        <>
            {/* Backdrop (Mobile only) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 lg:hidden z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar (Hidden on lg) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{x: -300}}
                        animate={{x: 0}}
                        exit={{x: -300}}
                        transition={{duration: 0.3}}
                        className="lg:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 overflow-y-auto flex flex-col"
                    >
                        <SidebarContent
                            chats={recentChats}
                            isConnected={isConnected}
                            onClose={onClose}
                            onSelectChat={handleSelectChat}
                            onSettingsClick={onSettingsClick}
                            onClearClick={onClearClick}
                            isAdmin={isAdmin}
                            showCloseButton={true}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Always visible on lg) */}
            <aside className="hidden lg:flex lg:flex-col relative h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto flex-col">
                <SidebarContent
                    chats={recentChats}
                    isConnected={isConnected}
                    onClose={onClose}
                    onSelectChat={handleSelectChat}
                    onSettingsClick={onSettingsClick}
                    onClearClick={onClearClick}
                    isAdmin={isAdmin}
                    showCloseButton={false}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                />
            </aside>
        </>
    );
};

interface SidebarContentProps {
    chats: StoredChatSession[];
    isConnected: boolean;
    onClose: () => void;
    onSelectChat: (chat: StoredChatSession) => void;
    onSettingsClick: () => void;
    onClearClick: () => void;
    isAdmin: boolean;
    showCloseButton: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    hasMore: boolean;
    onLoadMore: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
                                                           chats,
                                                           isConnected,
                                                           onClose,
                                                           onSelectChat,
                                                           onSettingsClick,
                                                           onClearClick,
                                                           isAdmin,
                                                           showCloseButton,
                                                           onSearchChange,
                                                           hasMore,
                                                           onLoadMore,
                                                       }) => (
    <>
        {/* Close Button (Mobile only) */}
        {showCloseButton && (
            <div className="flex justify-end p-4 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
        )}

        {/* Connection Status */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
                <motion.div
                    animate={{
                        backgroundColor: isConnected ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                    }}
                    className="w-2 h-2 rounded-full"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2 border-b border-slate-200 dark:border-slate-800">
            <motion.button
                whileHover={{x: 4}}
                onClick={() => {
                    onClearClick();
                    onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
                <Zap className="w-5 h-5 flex-shrink-0"/>
                <span className="text-sm font-medium">New Chat</span>
            </motion.button>

            {isAdmin && (
                <motion.button
                    whileHover={{x: 4}}
                    onClick={() => {
                        onSettingsClick();
                        onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                >
                    <Settings className="w-5 h-5 flex-shrink-0"/>
                    <span className="text-sm font-medium">Settings</span>
                </motion.button>
            )}
        </div>

        {/* Recent Chats with Search */}
        <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Search Bar */}
            {chats.length > 0 && (
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            )}

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <div className="p-4 text-center">
                        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2"/>
                        <p className="text-sm text-slate-500 dark:text-slate-400">No recent chats</p>
                    </div>
                ) : (
                    <div className="p-2">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-2 py-2">
                            RECENT CHATS
                        </p>
                        <AnimatePresence>
                            {chats.map((chat, index) => (
                                <motion.button
                                    key={chat.id}
                                    initial={{opacity: 0, x: -10}}
                                    animate={{opacity: 1, x: 0}}
                                    exit={{opacity: 0, x: -10}}
                                    transition={{delay: index * 0.05}}
                                    onClick={() => onSelectChat(chat)}
                                    className="w-full text-left p-3 mb-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <p className="font-medium text-slate-900 dark:text-white truncate text-sm">
                                        {chat.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {new Date(chat.updatedAt).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                                    </p>
                                </motion.button>
                            ))}
                        </AnimatePresence>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="p-2 text-center">
                                <button
                                    onClick={onLoadMore}
                                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                    Load more chats
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="w-4 h-4"/>
                <span>Powered by CatAI</span>
            </div>
        </div>
    </>
);
