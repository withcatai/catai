import React, {useCallback, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowUp, MessageSquare} from 'lucide-react';
import {GhostTextInput} from '../ui/GhostTextInput';

interface CompletionInputProps {
    onSend: (message: string) => void;
    onAbort: () => void;
    isLoading: boolean;
    isConnected: boolean;
    sentMessages?: string[];
    completion?: string;
    onCompletion?: (text: string) => void;
}

export const CompletionInput: React.FC<CompletionInputProps> = ({
                                                                    onSend,
                                                                    onAbort,
                                                                    isLoading,
                                                                    isConnected,
                                                                    sentMessages = [],
                                                                    completion = '',
                                                                    onCompletion,
                                                                }) => {
    const [message, setMessage] = useState('');
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Handle message change
    const handleChange = useCallback((newMessage: string) => {
        setMessage(newMessage);
        setHistoryIndex(null);
    }, []);

    // Request completion from server
    const requestCompletion = useCallback((text: string) => {
        if (completionTimeoutRef.current) {
            clearTimeout(completionTimeoutRef.current);
        }

        if (text.trim()) {
            completionTimeoutRef.current = setTimeout(() => {
                onCompletion?.(text);
            }, 300);
        }
    }, [onCompletion]);

    // Handle message send
    const handleSend = useCallback(() => {
        if (message.trim() && isConnected && !isLoading) {
            onSend(message);
            setMessage('');
            setHistoryIndex(null);
            setIsEditing(false);
        }
    }, [message, isConnected, isLoading, onSend]);

    // Navigate message history
    const handleNavigateHistory = (direction: 'up' | 'down') => {
        const totalMessages = sentMessages.length;
        if (totalMessages === 0) return;

        let newIndex: number;

        if (historyIndex === null) {
            newIndex = direction === 'up' ? 0 : -1;
        } else if (direction === 'up') {
            newIndex = Math.min(historyIndex + 1, totalMessages - 1);
        } else {
            newIndex = historyIndex - 1;
        }

        if (newIndex < 0) {
            setMessage('');
            setHistoryIndex(null);
        } else {
            setMessage(sentMessages[totalMessages - 1 - newIndex]);
            setHistoryIndex(newIndex);
            setIsEditing(false);
        }
    };

    // Check cursor position for smart key handling
    const getCursorLineInfo = () => {
        const selection = window.getSelection();
        if (!selection || !inputRef.current) {
            return {isOnFirstLine: true, isOnLastLine: true};
        }

        try {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(inputRef.current);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            const textBeforeCursor = preCaretRange.toString();
            const textAfterCursor = inputRef.current.textContent?.substring(textBeforeCursor.length) || '';

            return {
                isOnFirstLine: !textBeforeCursor.includes('\n'),
                isOnLastLine: !textAfterCursor.includes('\n'),
            };
        } catch {
            return {isOnFirstLine: true, isOnLastLine: true};
        }
    };

    // Handle full completion acceptance
    const handleCompleteCompletion = () => {
        if (completion) {
            const newMessage = message + completion;
            setMessage(newMessage);
            requestCompletion(newMessage);
        }
    };

    // Handle partial completion (single word)
    const handlePartialCompletion = () => {
        if (completion) {
            const completionParts = completion.split(/(\s+)/);
            if (completionParts.length > 0) {
                const firstPart = completionParts[0] + (completionParts.length > 1 ? completionParts[1] : '');
                const newMessage = message + firstPart;
                setMessage(newMessage);
                requestCompletion(newMessage);
            }
        }
    };

    // Handle key events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Tab: Accept full completion
        if (e.key === 'Tab' && completion) {
            e.preventDefault();
            handleCompleteCompletion();
            return;
        }

        // Arrow right: Accept single word completion
        if (e.key === 'ArrowRight' && completion) {
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (range && range.startOffset === message.length) {
                e.preventDefault();
                handlePartialCompletion();
            }
            return;
        }

        // Arrow up: History navigation or send
        if (e.key === 'ArrowUp') {
            const {isOnFirstLine} = getCursorLineInfo();
            if (isOnFirstLine && !message.trim()) {
                e.preventDefault();
                handleNavigateHistory('up');
                return;
            }
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                handleSend();
                return;
            }
        }

        // Arrow down: History navigation
        if (e.key === 'ArrowDown') {
            const {isOnLastLine} = getCursorLineInfo();
            if (isOnLastLine && !message.trim()) {
                e.preventDefault();
                handleNavigateHistory('down');
                return;
            }
        }

        // Enter: Send message (Shift+Enter for new line)
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow new line
                return;
            } else {
                e.preventDefault();
                handleSend();
            }
        }
    };

    // Check if input is empty
    const isEmpty = !message.trim();

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 sm:px-6 py-6 sm:py-7">
            <div className="max-w-4xl mx-auto w-full">
                {/* Editing indicator */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{opacity: 0, y: 4}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 4}}
                            className="mb-4 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400"
                        >
                            <MessageSquare className="w-3.5 h-3.5"/>
                            <span>Editing message • Press Enter to send, Esc to cancel</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main input container */}
                <div className="relative">
                    {/* Ghost text input */}
                    <GhostTextInput
                        ref={inputRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onCompletion={requestCompletion}
                        completion={completion}
                        disabled={!isConnected || isLoading}
                        placeholder="Type your message here..."
                        className="px-5 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent dark:focus:ring-offset-0 transition-all resize-none overflow-y-auto shadow-sm dark:shadow-none"
                        style={{
                            minHeight: '56px',
                            maxHeight: '200px',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            lineHeight: '1.5rem',
                        }}
                    />

                    {/* Send button - Arrow Up inside input */}
                    <motion.button
                        onClick={handleSend}
                        disabled={isEmpty || !isConnected || isLoading}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.98}}
                        className="absolute bottom-3.5 right-3.5 p-2.5 rounded-lg transition-all duration-200"
                        style={{
                            backgroundColor: isEmpty || !isConnected || isLoading ? '#e5e7eb' : '#3b82f6',
                            cursor: isEmpty || !isConnected || isLoading ? 'not-allowed' : 'pointer',
                        }}
                        aria-label={isLoading ? 'Stop' : 'Send message'}
                    >
                        <ArrowUp
                            className="w-5 h-5"
                            style={{
                                color: isEmpty || !isConnected || isLoading ? '#9ca3af' : '#ffffff',
                            }}
                        />
                    </motion.button>

                    {/* Connecting overlay */}
                    {!isConnected && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Connecting...
              </span>
                        </div>
                    )}
                </div>

                {/* Helper text and actions */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex gap-5">
            <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium">
                ↵
              </kbd>
              <span>send</span>
            </span>
                        <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium">
                Shift ↵
              </kbd>
              <span>new line</span>
            </span>
                        <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium">
                Tab
              </kbd>
              <span>complete</span>
            </span>
                        <span className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium">
                ↑ ↓
              </kbd>
              <span>history</span>
            </span>
                    </div>
                    {isLoading && (
                        <button
                            onClick={onAbort}
                            className="px-3 py-1 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium transition-colors"
                        >
                            Stop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
