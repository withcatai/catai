import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '../../types';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  onSend: (message: string) => void;
  onAbort: () => void;
  isEmpty: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  error,
  isConnected,
  onSend,
  onAbort,
  isEmpty,
}) => {
  return (
    <div className="flex flex-grow flex-col flex-1 min-h-0">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <MessageList
          messages={messages}
          isEmpty={isEmpty}
        />
      </div>

      {/* Input */}
      <MessageInput
        onSend={onSend}
        onAbort={onAbort}
        isLoading={isLoading}
        isConnected={isConnected}
      />
    </div>
  );
};
