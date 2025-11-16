import React from 'react';
import {Menu as MenuIcon, Moon, Sun} from 'lucide-react';
import {motion} from 'framer-motion';

interface HeaderProps {
    onMenuClick: () => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
                                                  onMenuClick,
                                                  theme,
                                                  onThemeToggle,
                                              }) => {
    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.95}}
                            className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                        >
                            <img
                                src="/logo.png"
                                alt="Catai Logo"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                                Catai
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Chat with AI
                            </p>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={onThemeToggle}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
                            ) : (
                                <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
                            )}
                        </motion.button>

                        {/* Menu Toggle (Mobile) */}
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={onMenuClick}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
                            aria-label="Toggle menu"
                        >
                            <MenuIcon className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
                        </motion.button>
                    </div>
                </div>
            </div>
        </header>
    );
};
