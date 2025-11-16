import React from 'react';
import {MessageList} from './MessageList';
import {CompletionInput} from './CompletionInput';
import {Message} from '../../types';

interface ChatContainerProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
    onSend: (message: string) => void;
    onAbort: () => void;
    isEmpty: boolean;
    sentMessages?: string[];
    completion?: string;
    onCompletion?: (text: string) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
                                                                messages,
                                                                isLoading,
                                                                error,
                                                                isConnected,
                                                                onSend,
                                                                onAbort,
                                                                isEmpty,
                                                                sentMessages = [],
                                                                completion = '',
                                                                onCompletion,
                                                            }) => {
    return (
        <div className="flex flex-grow flex-col flex-1 min-h-0 bg-white dark:bg-slate-950">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
                    ⚠️ {error}
                </div>
            )}

            {/* Messages - Containerized */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                    <MessageList
                        messages={messages}
                        isEmpty={isEmpty}
                    />
                </div>
            </div>

            {/* Input */}
            <CompletionInput
                onSend={onSend}
                onAbort={onAbort}
                isLoading={isLoading}
                isConnected={isConnected}
                sentMessages={sentMessages}
                completion={completion}
                onCompletion={onCompletion}
            />
        </div>
    );
};
