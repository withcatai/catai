import {WebSocketEvent} from '../types';

type WebSocketHandler = (event: WebSocketEvent) => void;

export class WebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private handlers: WebSocketHandler[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private isManualClose = false;

    constructor() {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        this.url = `${protocol}://${window.location.host}/ws`;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);
                this.isManualClose = false;

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    this.notifyHandlers({type: 'connected' as any});
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        // Normalize the event format from backend (event -> type)
                        if (data.event && !data.type) {
                            data.type = data.event;
                        }
                        this.notifyHandlers(data);
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.notifyHandlers({type: 'error', error: 'Connection error'});
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.notifyHandlers({type: 'disconnected' as any});

                    if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.reconnectAttempts++;
                        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
                        console.log(`Attempting to reconnect in ${delay}ms...`);
                        setTimeout(() => this.connect().catch(console.error), delay);
                    }
                };

                // Timeout if connection doesn't establish in 5 seconds
                const timeout = setTimeout(() => {
                    if (this.ws?.readyState === WebSocket.CONNECTING) {
                        this.ws?.close();
                        reject(new Error('WebSocket connection timeout'));
                    }
                }, 5000);

                const ws = this.ws;
                const originalOnOpen = ws.onopen;
                ws.onopen = (event) => {
                    clearTimeout(timeout);
                    originalOnOpen?.call(ws, event);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    disconnect(): void {
        this.isManualClose = true;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(event: string, value?: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({event, value}));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    sendPrompt(prompt: string): void {
        this.send('prompt', prompt);
    }

    abort(): void {
        this.send('abort');
    }

    subscribe(handler: WebSocketHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter((h) => h !== handler);
        };
    }

    private notifyHandlers(event: WebSocketEvent): void {
        this.handlers.forEach((handler) => {
            try {
                handler(event);
            } catch (error) {
                console.error('Error in WebSocket handler:', error);
            }
        });
    }

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}

export const wsClient = new WebSocketClient();
