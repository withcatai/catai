import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Square } from 'lucide-react';
import { Button } from '../ui/Button';

interface MessageInputProps {
  onSend: (message: string) => void;
  onAbort: () => void;
  isLoading: boolean;
  isConnected: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onAbort,
  isLoading,
  isConnected,
  placeholder = 'Type your message here...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-4 py-3 sm:py-4">
      <div className="max-w-5xl mx-auto px-1 sm:px-0">
        <div className="flex gap-3 items-end">
          {/* Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading || !isConnected}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />

            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-lg backdrop-blur-xs">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Connecting...
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {isLoading ? (
              <Button
                onClick={onAbort}
                variant="danger"
                size="md"
                className="gap-2 flex-shrink-0"
                aria-label="Stop generating"
              >
                <Square className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Stop</span>
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!message.trim() || !isConnected}
                variant="primary"
                size="md"
                className="gap-2 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Shift+Enter for new line</span>
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
