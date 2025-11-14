import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, WebSocketEvent } from '../types';
import { generateId } from '../lib/utils';
import { wsClient } from '../lib/websocket';
import { ChatHistoryItem } from '../types/chatHistory';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        await wsClient.connect();
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to connect to WebSocket:', err);
        setError('Failed to connect. Please refresh the page.');
      }
    };

    initializeWebSocket();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      wsClient.disconnect();
    };
  }, []);

  // Subscribe to WebSocket events
  useEffect(() => {
    unsubscribeRef.current = wsClient.subscribe((event: WebSocketEvent) => {
      console.log('WebSocket event:', event);

      if (event.type === 'connected') {
        setIsConnected(true);
        setError(null);
      } else if (event.type === 'disconnected') {
        setIsConnected(false);
      } else if (event.type === 'token') {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            updated[updated.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + (event.value || ''),
            };
          }
          return updated;
        });
      } else if (event.type === 'think-token') {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            updated[updated.length - 1] = {
              ...lastMsg,
              thinking: (lastMsg.thinking || '') + (event.value || ''),
            };
          }
          return updated;
        });
      } else if (event.type === 'error') {
        console.error('WebSocket error:', event.error);
        setError(event.error || 'An error occurred');
        setIsLoading(false);
      } else if (event.type === 'end') {
        console.log('WebSocket end event');
        setIsLoading(false);
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              updated[updated.length - 1] = {
                ...lastMsg,
                isStreaming: false,
              };
            }
          }
          return updated;
        });
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const sendMessage = useCallback((prompt: string) => {
    if (!prompt.trim() || !isConnected) {
      return;
    }

    setError(null);
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    // Add assistant message
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    // Send via WebSocket
    wsClient.sendPrompt(prompt);
  }, [isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const abort = useCallback(() => {
    wsClient.abort();
    setIsLoading(false);
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMsg,
            isStreaming: false,
          };
        }
      }
      return updated;
    });
  }, []);

  const setChatHistory = useCallback((history: ChatHistoryItem[]) => {
    const convertedMessages: Message[] = history
      .filter((item) => item.type === 'user' || item.type === 'model')
      .map((item) => {
        if (item.type === 'user') {
          return {
            id: generateId(),
            role: 'user' as const,
            content: item.text,
            timestamp: Date.now(),
          };
        } else {
          // item.type === 'model'
          const modelItem = item as any;
          let content = '';
          let thinking = '';

          // Extract content and thinking from response array
          if (Array.isArray(modelItem.response)) {
            modelItem.response.forEach((r: any) => {
              if (typeof r === 'string') {
                content += r;
              } else if (r?.type === 'segment' && r?.segmentType === 'thought') {
                thinking += r.text;
              }
            });
          }

          return {
            id: generateId(),
            role: 'assistant' as const,
            content,
            thinking: thinking || undefined,
            timestamp: Date.now(),
            isStreaming: false,
          };
        }
      });
    setMessages(convertedMessages);
  }, []);

  const resetChatHistory = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setError(null);
  }, []);

  // Convert current messages to ChatHistoryItem format for persistence
  const getHistoryFormat = useCallback((): ChatHistoryItem[] => {
    return messages.map((msg) => {
      if (msg.role === 'user') {
        return {
          type: 'user' as const,
          text: msg.content,
        };
      } else {
        // Convert assistant message back to model response format
        const response: any[] = [];

        // Add thinking if present
        if (msg.thinking) {
          response.push({
            type: 'segment' as const,
            segmentType: 'thought' as const,
            text: msg.thinking,
            ended: true,
          });
        }

        // Add content as string
        if (msg.content) {
          response.push(msg.content);
        }

        return {
          type: 'model' as const,
          response,
        };
      }
    });
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    clearMessages,
    abort,
    setChatHistory,
    resetChatHistory,
    getHistoryFormat,
  };
}
