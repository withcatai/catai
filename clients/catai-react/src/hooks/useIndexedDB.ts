import {useCallback, useEffect, useState} from 'react';
import {ChatSearchResult, StoredChatSession} from '../types/chatHistory';

const DB_NAME = 'Catai';
const STORE_NAME = 'chatSessions';
const DB_VERSION = 1;

export function useIndexedDB() {
    const [db, setDb] = useState<IDBDatabase | null>(null);
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
                        const store = database.createObjectStore(STORE_NAME, {keyPath: 'id'});
                        store.createIndex('createdAt', 'createdAt', {unique: false});
                        store.createIndex('updatedAt', 'updatedAt', {unique: false});
                    }
                };

                request.onsuccess = () => {
                    const database = request.result;
                    setDb(database);
                    setIsReady(true);
                };
            } catch (error) {
                console.error('Failed to initialize IndexedDB:', error);
            }
        };

        initDB();
    }, []);

    // Save chat session
    const saveSession = useCallback(
        async (session: StoredChatSession): Promise<void> => {
            if (!db) {
                throw new Error('Database not initialized');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = db.transaction([STORE_NAME], 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.put({
                        ...session,
                        updatedAt: Date.now(),
                    });

                    request.onsuccess = () => {
                        console.log('Session saved successfully:', session.id);
                        resolve();
                    };
                    request.onerror = () => {
                        const error = request.error || new Error('Unknown save error');
                        console.error('Failed to save session:', error);
                        reject(error);
                    };

                    transaction.onerror = () => {
                        const error = transaction.error || new Error('Transaction failed');
                        console.error('Transaction error:', error);
                        reject(error);
                    };
                } catch (err) {
                    console.error('Error in saveSession:', err);
                    reject(err);
                }
            });
        },
        [db]
    );

    // Get single session
    const getSession = useCallback(
        async (sessionId: string): Promise<StoredChatSession | null> => {
            if (!db) return null;

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(sessionId);

                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => reject(request.error);
            });
        },
        [db]
    );

    // Get all sessions sorted by updatedAt
    const getAllSessions = useCallback(
        async (): Promise<StoredChatSession[]> => {
            if (!db) return [];

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const index = store.index('updatedAt');
                const request = index.getAll();

                request.onsuccess = () => {
                    const results = request.result as StoredChatSession[];
                    resolve(results.reverse()); // Most recent first
                };
                request.onerror = () => reject(request.error);
            });
        },
        [db]
    );

    // Search sessions by title or content
    const searchSessions = useCallback(
        async (query: string, limit: number = 20): Promise<ChatSearchResult[]> => {
            if (!db) return [];

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.getAll();

                request.onsuccess = () => {
                    const allSessions = request.result as StoredChatSession[];
                    const lowerQuery = query.toLowerCase();

                    const filtered = allSessions
                        .filter((session) => {
                            // Search in title
                            if (session.title.toLowerCase().includes(lowerQuery)) return true;

                            // Search in history content
                            return session.history.some((item) => {
                                if (item.type === 'user') {
                                    return item.text.toLowerCase().includes(lowerQuery);
                                } else if (item.type === 'model') {
                                    return item.response.some((r) => {
                                        if (typeof r === 'string') {
                                            return r.toLowerCase().includes(lowerQuery);
                                        }
                                        return false;
                                    });
                                }
                                return false;
                            });
                        })
                        .slice(0, limit)
                        .map((session) => ({
                            sessionId: session.id,
                            title: session.title,
                            createdAt: session.createdAt,
                            updatedAt: session.updatedAt,
                            preview: session.history
                                .filter((item) => item.type === 'user' || item.type === 'model')
                                .slice(0, 2)
                                .map((item) => {
                                    if (item.type === 'user') {
                                        return `User: ${item.text.substring(0, 50)}...`;
                                    } else {
                                        const text = (item as any).response?.[0]?.substring?.(0, 50);
                                        return text ? `AI: ${text}...` : '';
                                    }
                                })
                                .join('\n'),
                        }));

                    resolve(filtered);
                };
                request.onerror = () => reject(request.error);
            });
        },
        [db]
    );

    // Delete session
    const deleteSession = useCallback(
        async (sessionId: string): Promise<void> => {
            if (!db) return;

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(sessionId);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },
        [db]
    );

    // Clear all sessions
    const clearAllSessions = useCallback(
        async (): Promise<void> => {
            if (!db) return;

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },
        [db]
    );

    return {
        isReady,
        saveSession,
        getSession,
        getAllSessions,
        searchSessions,
        deleteSession,
        clearAllSessions,
    };
}
