import { useState, useCallback, useEffect } from 'react';

const SYSTEM_PROMPT_KEY = 'catai_system_prompt';
const DEFAULT_SYSTEM_PROMPT = 'You are a helpful AI assistant.';

export function useSystemPrompt() {
  const [systemPrompt, setSystemPromptState] = useState<string>(DEFAULT_SYSTEM_PROMPT);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SYSTEM_PROMPT_KEY);
      if (saved) {
        setSystemPromptState(saved);
      }
    } catch (error) {
      console.error('Failed to load system prompt:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const setSystemPrompt = useCallback((prompt: string) => {
    try {
      setSystemPromptState(prompt);
      localStorage.setItem(SYSTEM_PROMPT_KEY, prompt);
    } catch (error) {
      console.error('Failed to save system prompt:', error);
    }
  }, []);

  // Reset to default
  const resetSystemPrompt = useCallback(() => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
  }, [setSystemPrompt]);

  return {
    systemPrompt,
    setSystemPrompt,
    resetSystemPrompt,
    isLoading,
  };
}
