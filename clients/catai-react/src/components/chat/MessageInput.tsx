import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Send, Square} from 'lucide-react';
import {Button} from '../ui/Button';

interface MessageInputProps {
    onSend: (message: string) => void;
    onAbort: () => void;
    isLoading: boolean;
    isConnected: boolean;
    placeholder?: string;
    sentMessages?: string[];
    completion?: string;
    onCompletion?: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
                                                              onSend,
                                                              onAbort,
                                                              isLoading,
                                                              isConnected,
                                                              placeholder = 'Type your message here...',
                                                              sentMessages = [],
                                                              completion = '',
                                                              onCompletion,
                                                          }) => {
    const [message, setMessage] = useState('');
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }, [message]);

    const handleSend = () => {
        if (message.trim() && isConnected && !isLoading) {
            onSend(message);
            setMessage('');
            setHistoryIndex(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    // Request completion from server
    const requestCompletion = (text: string) => {
        if (completionTimeoutRef.current) {
            clearTimeout(completionTimeoutRef.current);
        }

        completionTimeoutRef.current = setTimeout(() => {
            onCompletion?.(text);
        }, 300); // Debounce completion requests
    };

    const handleNavigateHistory = (direction: 'up' | 'down') => {
        const totalMessages = sentMessages.length;
        if (totalMessages === 0) return;

        let newIndex: number;

        if (historyIndex === null) {
            // Start history navigation
            newIndex = direction === 'up' ? 0 : -1;
        } else if (direction === 'up') {
            newIndex = Math.min(historyIndex + 1, totalMessages - 1);
        } else {
            newIndex = historyIndex - 1;
        }

        if (newIndex < 0) {
            // Going below history (show empty input)
            setMessage('');
            setHistoryIndex(null);
        } else {
            // Navigate to history item
            setMessage(sentMessages[totalMessages - 1 - newIndex]);
            setHistoryIndex(newIndex);
        }
    };

    const handleCompleteCompletion = () => {
        if (completion) {
            const newMessage = message + completion;
            setMessage(newMessage);
            requestCompletion(newMessage);
        }
    };

    const handlePartialCompletion = () => {
        if (completion) {
            // Complete just one word or until the next space
            const completionParts = completion.split(/(\s+)/);
            if (completionParts.length > 0) {
                const firstPart = completionParts[0] + (completionParts.length > 1 ? completionParts[1] : '');
                const newMessage = message + firstPart;
                setMessage(newMessage);
                requestCompletion(newMessage);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Tab: Complete full suggestion
        if (e.key === 'Tab') {
            e.preventDefault();
            handleCompleteCompletion();
            return;
        }

        // Arrow up: History navigation or completion navigation
        if (e.key === 'ArrowUp') {
            const cursorPos = textareaRef.current?.selectionStart ?? 0;
            const textBeforeCursor = message.substring(0, cursorPos);
            const isOnFirstLine = !textBeforeCursor.includes('\n');

            if (isOnFirstLine) {
                e.preventDefault();
                handleNavigateHistory('up');
                return;
            }
        }

        // Arrow down: History navigation or completion navigation
        if (e.key === 'ArrowDown') {
            const cursorPos = textareaRef.current?.selectionStart ?? 0;
            const textAfterCursor = message.substring(cursorPos);
            const isOnLastLine = !textAfterCursor.includes('\n');

            if (isOnLastLine) {
                e.preventDefault();
                handleNavigateHistory('down');
                return;
            }
        }

        // Arrow right: Partial completion
        if (e.key === 'ArrowRight' && completion) {
            const cursorPos = textareaRef.current?.selectionStart ?? 0;
            if (cursorPos === message.length) {
                // Cursor is at end of input
                e.preventDefault();
                handlePartialCompletion();
                return;
            }
        }

        // Enter: Send message
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        setHistoryIndex(null); // Exit history mode when typing
        // Don't clear completion - let it update from server
        requestCompletion(newMessage);
    };

    return (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-4 py-3 sm:py-4">
            <div className="max-w-4xl mx-auto px-1 sm:px-0">
                <div className="flex gap-3">
                    {/* Input */}
                    <div className="flex-1 relative">
                        {/* Completion suggestion (shows behind textarea with reduced opacity) */}
                        {completion && (
                            <div
                                className="absolute top-3 left-4 pointer-events-none font-mono text-sm leading-tight"
                                style={{
                                    color: '#9ca3af',
                                    opacity: 0.5,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    maxWidth: 'calc(100% - 32px)',
                                }}
                            >
                                {message}<span style={{color: '#6b7280'}}>{completion}</span>
                            </div>
                        )}

                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={!isConnected}
                            className="relative w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            rows={1}
                            style={{minHeight: '44px', maxHeight: '120px'}}
                        />

                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-lg backdrop-blur-xs">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Connecting...
                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Button - Toggle between Send and Stop */}
                    <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                        <Button
                            onClick={isLoading ? onAbort : handleSend}
                            disabled={(!message.trim() || !isConnected) && !isLoading}
                            variant={isLoading ? 'danger' : 'primary'}
                            size="md"
                            className="flex-shrink-0 p-3"
                            aria-label={isLoading ? 'Stop generating' : 'Send message'}
                        >
                            {isLoading ? (
                                <Square className="w-5 h-5 fill-current"/>
                            ) : (
                                <Send className="w-5 h-5"/>
                            )}
                        </Button>
                    </motion.div>
                </div>

                {/* Helper Text */}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Shift+Enter for new line • ↑↓ History • Tab to complete</span>
                    {!isConnected && (
                        <span className="text-amber-600 dark:text-amber-400">
              ⚠ Waiting for connection...
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};
