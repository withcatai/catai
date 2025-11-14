import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {History, Settings, Trash2, X, Zap,} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onHistoryClick: () => void;
    onSettingsClick: () => void;
    onClearClick: () => void;
    isAdmin: boolean;
    isConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    isOpen,
                                                    onClose,
                                                    onHistoryClick,
                                                    onSettingsClick,
                                                    onClearClick,
                                                    isAdmin,
                                                    isConnected,
                                                }) => {
    const actions = [
        {
            icon: History,
            label: 'History',
            onClick: onHistoryClick,
            show: true,
        },
        {
            icon: Trash2,
            label: 'Clear Chat',
            onClick: onClearClick,
            show: true,
        },
        {
            icon: Settings,
            label: 'Settings',
            onClick: onSettingsClick,
            show: isAdmin,
        },
    ];

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
                            actions={actions}
                            isConnected={isConnected}
                            onClose={onClose}
                            showCloseButton={true}
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Always visible on lg) */}
            <aside className="hidden lg:flex lg:flex-col relative h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto flex-col">
                <SidebarContent
                    actions={actions}
                    isConnected={isConnected}
                    onClose={onClose}
                    showCloseButton={false}
                />
            </aside>
        </>
    );
};

interface SidebarContentProps {
    actions: any[];
    isConnected: boolean;
    onClose: () => void;
    showCloseButton: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({actions, isConnected, onClose, showCloseButton}) => (
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
                        backgroundColor: isConnected
                            ? 'rgb(34, 197, 94)'
                            : 'rgb(239, 68, 68)',
                    }}
                    className="w-2 h-2 rounded-full"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
            </div>
        </div>

        {/* Actions */}
        <nav className="p-4 space-y-2 flex-1">
            {actions.map(
                (action) =>
                    action.show && (
                        <motion.button
                            key={action.label}
                            whileHover={{x: 4}}
                            onClick={() => {
                                action.onClick();
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                        >
                            <action.icon className="w-5 h-5 flex-shrink-0"/>
                            <span className="text-sm font-medium">{action.label}</span>
                        </motion.button>
                    )
            )}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Zap className="w-4 h-4"/>
                <span>Powered by CatAI</span>
            </div>
        </div>
    </>
);
