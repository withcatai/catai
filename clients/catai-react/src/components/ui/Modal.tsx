import React, {useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {cn} from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    showClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                className,
                                                showClose = true,
                                            }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.95, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.95, y: 20}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                'bg-white dark:bg-slate-900 rounded-xl shadow-soft-xl max-w-2xl w-full max-h-[80vh] overflow-auto',
                                className
                            )}
                        >
                            {/* Header */}
                            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {title}
                                </h2>
                                {showClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
