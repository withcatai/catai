import { useState, useEffect } from 'react';
import { checkAdmin, getSettings, saveSettings, restartServer } from '../lib/api';
import { AdminSettings } from '../types';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const admin = await checkAdmin();
        setIsAdmin(admin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const getAdminSettings = async (): Promise<AdminSettings | null> => {
    try {
      return await getSettings();
    } catch (err) {
      setError('Failed to fetch settings');
      return null;
    }
  };

  const updateSettings = async (settings: AdminSettings): Promise<boolean> => {
    try {
      const success = await saveSettings(settings);
      if (!success) {
        setError('Failed to save settings');
      }
      return success;
    } catch (err) {
      setError('Failed to save settings');
      return false;
    }
  };

  const restart = async (): Promise<boolean> => {
    try {
      return await restartServer();
    } catch (err) {
      setError('Failed to restart server');
      return false;
    }
  };

  return {
    isAdmin,
    isLoading,
    error,
    getAdminSettings,
    updateSettings,
    restart,
  };
}
