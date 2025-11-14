import { useState, useCallback, useEffect } from 'react';

export interface BuiltInAPISettings {
  webSearch: boolean;
  date: boolean;
  weather: boolean;
  currency: boolean;
}

const SETTINGS_KEY = 'catai_builtin_api_settings';
const DEFAULT_SETTINGS: BuiltInAPISettings = {
  webSearch: false,
  date: false,
  weather: false,
  currency: false,
};

export function useBuiltInAPISettings() {
  const [settings, setSettingsState] = useState<BuiltInAPISettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load built-in API settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  const setSetting = useCallback(
    (key: keyof BuiltInAPISettings, value: boolean) => {
      setSettingsState((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save built-in API settings:', error);
        }
        return updated;
      });
    },
    []
  );

  // Set all settings at once
  const setAllSettings = useCallback((newSettings: Partial<BuiltInAPISettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save built-in API settings:', error);
      }
      return updated;
    });
  }, []);

  // Reset to default
  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to reset built-in API settings:', error);
    }
  }, []);

  return {
    settings,
    setSetting,
    setAllSettings,
    resetSettings,
    isLoading,
  };
}
