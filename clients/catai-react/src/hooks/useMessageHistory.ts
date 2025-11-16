import {useCallback, useEffect, useState} from 'react';

interface MessageHistoryItem {
    text: string;
    timestamp: number;
}

const DB_NAME = 'Catai';
const STORE_NAME = 'messageHistory';
const DB_VERSION = 2; // Updated to include messageHistory store

export function useMessageHistory() {
    const [db, setDb] = useState<IDBDatabase | null>(null);
    const [history, setHistory] = useState<MessageHistoryItem[]>([]);
    const [isReady, setIsReady] = useState(false);

    // Initialize IndexedDB
    useEffect(() => {
        const initDB = async () => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = () => {
                    console.error('IndexedDB open error:', request.error);
                };

                request.onupgradeneeded = (event) => {
                    const database = (event.target as IDBOpenDBRequest).result;
                    if (!database.objectStoreNames.contains(STORE_NAME)) {
                        const store = database.createObjectStore(STORE_NAME, {keyPath: 'timestamp'});
                        store.createIndex('timestamp', 'timestamp', {unique: false});
                    }
                };

                request.onsuccess = () => {
                    const database = request.result;
                    setDb(database);
                    setIsReady(true);
                    loadHistory(database);
                };
            } catch (error) {
                console.error('Failed to initialize IndexedDB:', error);
            }
        };

        initDB();
    }, []);

    // Load history from IndexedDB
    const loadHistory = useCallback((database: IDBDatabase) => {
        try {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const request = index.getAll();

            request.onsuccess = () => {
                const items = request.result as MessageHistoryItem[];
                // Sort by timestamp descending (newest first) and keep last 100
                const sorted = items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
                setHistory(sorted);
            };
        } catch (error) {
            console.error('Failed to load message history:', error);
        }
    }, []);

    // Add message to history
    const addMessage = useCallback(
        async (text: string): Promise<void> => {
            if (!db) {
                throw new Error('Database not initialized');
            }

            try {
                const item: MessageHistoryItem = {
                    text,
                    timestamp: Date.now(),
                };

                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                store.add(item);

                // Update local state
                setHistory((prev) => [item, ...prev].slice(0, 100));
            } catch (error) {
                console.error('Failed to add message to history:', error);
            }
        },
        [db]
    );

    // Clear all history
    const clearHistory = useCallback(async () => {
        if (!db) {
            throw new Error('Database not initialized');
        }

        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.clear();

            setHistory([]);
        } catch (error) {
            console.error('Failed to clear message history:', error);
        }
    }, [db]);

    // Get messages as strings for input component
    const getMessages = useCallback((): string[] => {
        return history.map((item) => item.text);
    }, [history]);

    return {
        isReady,
        history,
        addMessage,
        clearHistory,
        getMessages,
    };
}
