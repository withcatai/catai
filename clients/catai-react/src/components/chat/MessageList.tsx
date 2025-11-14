import React, {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {ArrowDown} from 'lucide-react';
import {Message} from '../../types';
import {Message as MessageComponent} from './Message';

interface MessageListProps {
  messages: Message[];
  isEmpty: boolean;
    onLoadMore?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
                                                          messages,
                                                          isEmpty,
                                                            onLoadMore,
                                                        }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      if (isAtBottom) {
        setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        }, 0);
      }
    }
  }, [messages]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      // Check if at bottom
      const isAtBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isAtBottom);

      // Check if scrolled near top for infinite scroll
      if (onLoadMore && container.scrollTop < 200) {
        onLoadMore();
      }
    }
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
      <div className="h-full w-full flex flex-col">
        {/* Messages Container */}
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4"
        >
          {isEmpty ? (
              <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  className="h-full flex flex-col items-center justify-center text-center"
              >
                <div
                    className="mb-4 w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
                  <img
                      src="/logo.png"
                      alt="CatAI"
                      className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Start a Conversation
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                  Ask me anything! I'm here to help with questions, coding, writing, analysis, and much more.
                </p>
              </motion.div>
          ) : (
              <AnimatePresence>
                {messages.map((message) => (
                    <MessageComponent key={message.id} message={message}/>
                ))}
              </AnimatePresence>
          )}

        </div>

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
              <motion.button
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  onClick={scrollToBottom}
                  className="absolute right-6 bottom-20 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-soft-lg hover:shadow-soft-xl transition-shadow z-10"
                  aria-label="Scroll to bottom"
              >
                <ArrowDown className="w-5 h-5 text-slate-600 dark:text-slate-400"/>
              </motion.button>
          )}
        </AnimatePresence>
      </div>
  );
};
