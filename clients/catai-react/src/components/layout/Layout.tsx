import React, { useState } from 'react';
import { Header } from './Header';
import { SidebarWithHistory } from './SidebarWithHistory';
import { StoredChatSession } from '../../types/chatHistory';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onSettingsClick: () => void;
  onClearClick: () => void;
  onSelectChatSession: (session: StoredChatSession) => void;
  onLoadChatSession: (sessionId: string) => Promise<void>;
  isAdmin: boolean;
  isConnected: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  theme,
  onThemeToggle,
  onSettingsClick,
  onClearClick,
  onSelectChatSession,
  onLoadChatSession,
  isAdmin,
  isConnected,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />

      <div className="flex flex-1 overflow-hidden">
        <SidebarWithHistory
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSettingsClick={onSettingsClick}
          onClearClick={onClearClick}
          onSelectChatSession={onSelectChatSession}
          onLoadChatSession={onLoadChatSession}
          isAdmin={isAdmin}
          isConnected={isConnected}
        />

        <main className="flex flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
