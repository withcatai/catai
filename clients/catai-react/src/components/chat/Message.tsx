import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Check, Copy, Eye, EyeOff} from 'lucide-react';
import {Message as MessageType} from '../../types';
import {MarkdownRenderer} from './MarkdownRenderer';
import {copyToClipboard} from '../../lib/utils';

interface MessageProps {
    message: MessageType;
    onCopy?: () => void;
}

export const Message: React.FC<MessageProps> = ({message, onCopy}) => {
    const [copied, setCopied] = useState(false);
    const [showThinking, setShowThinking] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(message.content);
        if (success) {
            setCopied(true);
            onCopy?.();
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 mb-4 w-full ${isUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden">
                <img
                    src={isUser ? '/user-icon.png' : '/logo.png'}
                    alt={isUser ? 'User' : 'CatAI'}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Message Bubble */}
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl group relative ${
                    isUser ? 'bg-blue-500 text-white rounded-lg rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg rounded-tl-none'
                } px-4 py-3 shadow-soft-md hover:shadow-soft-lg transition-shadow`}
            >
                {/* Thinking Section */}
                {message.thinking && (
                    <div className="mb-3 pb-3 border-b border-current border-opacity-20">
                        <button
                            onClick={() => setShowThinking(!showThinking)}
                            className="flex items-center gap-2 text-xs font-medium opacity-75 hover:opacity-100 transition-opacity"
                        >
                            {showThinking ? (
                                <EyeOff className="w-4 h-4"/>
                            ) : (
                                <Eye className="w-4 h-4"/>
                            )}
                            <span>
                {showThinking ? 'Hide' : 'Show'} thinking
              </span>
                        </button>

                        {showThinking && (
                            <div className="mt-2 p-2 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono !text-slate-700 dark:!text-slate-300">
                                {message.thinking}
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="text-sm leading-relaxed">
                    {isUser ? (
                        <p>{message.content}</p>
                    ) : (
                        <MarkdownRenderer content={message.content}/>
                    )}
                </div>

                {/* Loading Indicator */}
                {message.isStreaming && !isUser && (
                    <div className="mt-2 flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{y: [0, -4, 0]}}
                                transition={{duration: 0.6, delay: i * 0.1, repeat: Infinity}}
                                className="w-1.5 h-1.5 bg-current opacity-60 rounded-full"
                            />
                        ))}
                    </div>
                )}

                {/* Copy Button (Non-streaming) */}
                {!isUser && !message.isStreaming && (
                    <motion.button
                        initial={{opacity: 0}}
                        whileHover={{opacity: 1}}
                        onClick={handleCopy}
                        className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 bg-slate-200 dark:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-300 dark:hover:bg-slate-600"
                        aria-label="Copy message"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600"/>
                        ) : (
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300"/>
                        )}
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};
