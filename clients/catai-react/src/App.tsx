import {useEffect, useRef, useState} from 'react';
import {Layout} from './components/layout/Layout';
import {ChatContainer} from './components/chat/ChatContainer';
import {HistoryModal} from './components/modals/HistoryModal';
import {SettingsModal} from './components/modals/SettingsModal';
import {ToastContainer, useToast} from './components/ui/Toast';
import {useTheme} from './hooks/useTheme';
import {useChat} from './hooks/useChat';
import {useHistory} from './hooks/useHistory';
import {useAdmin} from './hooks/useAdmin';
import {useIndexedDB} from './hooks/useIndexedDB';
import {StoredChatSession} from './types/chatHistory';
import {generateId} from './lib/utils';

function App() {
    const {theme, toggle: toggleTheme} = useTheme();
    const {messages, isLoading, error, isConnected, sendMessage, clearMessages, abort, setChatHistory, getHistoryFormat} =
        useChat();
    const {history, addToHistory, clearHistory} = useHistory();
    const {isAdmin} = useAdmin();
    const {toasts, addToast, removeToast} = useToast();
    const {isReady: isIndexedDBReady, getSession, saveSession} = useIndexedDB();

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const prevMessageCountRef = useRef(0);
    const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentSessionIdRef = useRef<string | null>(null);

    // Auto-save chat to IndexedDB when messages change
    useEffect(() => {
        if (!isIndexedDBReady || messages.length === 0) return;

        // Debounce auto-save to avoid excessive writes
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(async () => {
            try {
                // Generate a session ID on first message
                if (!currentSessionIdRef.current) {
                    currentSessionIdRef.current = generateId();
                }

                const session: StoredChatSession = {
                    id: currentSessionIdRef.current,
                    title: messages[0]?.content?.substring(0, 50) || 'Untitled Chat',
                    history: getHistoryFormat(),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };

                await saveSession(session);
            } catch (error) {
                console.error('Failed to auto-save chat:', error);
            }
        }, 2000); // Auto-save every 2 seconds of inactivity

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [messages, isIndexedDBReady, getHistoryFormat, saveSession]);

    // Add to history only when a new user message is sent
    useEffect(() => {
        // Only add to history when message count increases by 2 (user + assistant)
        if (messages.length > prevMessageCountRef.current && messages.length >= 2) {
            const lastMessage = messages[messages.length - 2]; // Get user message (before assistant)
            if (lastMessage && lastMessage.role === 'user') {
                addToHistory(lastMessage.content);
            }
        }
        prevMessageCountRef.current = messages.length;
    }, [messages.length, addToHistory]);

    const handleSendMessage = (prompt: string) => {
        sendMessage(prompt);
    };

    const handleSelectPrompt = (prompt: string) => {
        handleSendMessage(prompt);
    };

    const handleClearChat = () => {
        setChatHistory([]);
        clearMessages();
        currentSessionIdRef.current = null;
        addToast('New chat started', 'info');
    };

    const handleSelectChatSession = (session: StoredChatSession) => {
        // Load the chat session history
        setChatHistory(session.history);
        // Set the session ID to prevent creating a new chat when auto-saving
        currentSessionIdRef.current = session.id;
    };

    const handleLoadChatSession = async (sessionId: string) => {
        if (!isIndexedDBReady) {
            return;
        }

        try {
            // Set the session ID FIRST, before loading, to prevent auto-save from creating a new chat
            currentSessionIdRef.current = sessionId;

            const session = await getSession(sessionId);
            if (session) {
                setChatHistory(session.history);
            }
        } catch (err) {
            console.error('Error loading session:', err);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-950">
            <Layout
                theme={theme}
                onThemeToggle={toggleTheme}
                onSettingsClick={() => setSettingsModalOpen(true)}
                onClearClick={handleClearChat}
                onSelectChatSession={handleSelectChatSession}
                onLoadChatSession={handleLoadChatSession}
                isAdmin={isAdmin}
                isConnected={isConnected}
            >
                <ChatContainer
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    isConnected={isConnected}
                    onSend={handleSendMessage}
                    onAbort={abort}
                    isEmpty={messages.length === 0}
                />
            </Layout>

            {/* Modals */}
            <HistoryModal
                isOpen={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                history={history}
                onSelectPrompt={handleSelectPrompt}
                onClearHistory={clearHistory}
            />

            <SettingsModal
                isOpen={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
            />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast}/>
        </div>
    );
}

export default App;
