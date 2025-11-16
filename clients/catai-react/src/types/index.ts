export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    thinking?: string;
    timestamp: number;
    isStreaming?: boolean;
}

export interface WebSocketEvent {
    type: 'token' | 'think-token' | 'error' | 'end' | 'connected' | 'disconnected' | 'complete-token';
    value?: string;
    error?: string;
    token?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    isConnected: boolean;
}

export interface HistoryItem {
    prompt: string;
    timestamp: number;
}

export interface AdminSettings {
    [key: string]: any;
}

export interface Theme {
    mode: 'light' | 'dark';
    setMode: (mode: 'light' | 'dark') => void;
    toggle: () => void;
}
