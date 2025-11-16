import WebSocket, {ClientOptions} from 'ws';
import {ClientRequestArgs} from 'http';
import {ChatContext, ChatResponse} from '../../manage-models/bind-class/chat-context.js';
import {ChatHistoryItem} from 'node-llama-cpp';

export default class RemoteCatAI extends ChatContext {
    private _ws: WebSocket;
    private _closed = false;
    private _promiseOpen?: Promise<void>;

    /**
     * Connect to remote Catai server, and use it as a chat context
     * @param url - WebSocket URL
     * @param options - WebSocket options
     */
    constructor(url: string, options?: ClientRequestArgs | ClientOptions) {
        super();
        this._ws = new WebSocket(url, options);
        this._init();
    }

    private _init() {
        this._ws.on('message', this._onMessage.bind(this));

        this._ws.on('error', (message) => {
            this.emit('error', message.message);
        });

        this._ws.on('close', (code) => {
            if (this._closed) return;
            this.emit('error', 'Connection closed: ' + code);
        });

        this._ws.on('open', () => {
            this.emit('open');
        });

        this._promiseOpen = new Promise((resolve, reject) => {
            this.once('open', resolve);
            this.once('error', reject);
        });
    }

    private _onMessage(message: string) {
        const {event, value} = JSON.parse(message);
        switch (event) {
            case 'token':
                this.emit('token', value);
                break;
            case 'think-token':
                this.emit('think-token', value);
                break;
            case 'error':
                this.emit('error', value);
                break;
            case 'abort':
                this.emit('abort', value);
                break;
            case 'end':
                this.emit('modelResponseEnd', value);
                break;
        }
    }

    private _send(event: 'prompt' | 'complete' | 'abort' | 'setChatHistory', value?: any) {
        this._ws.send(JSON.stringify({event, value}));
    }

    abort(reason?: string): void {
        this._send('abort', reason || 'Aborted by user');
    }

    setChatHistory(chatHistory: ChatHistoryItem[]) {
        this._send('setChatHistory', chatHistory);
    }

    async complete(text: string, chatResponse?: ChatResponse): Promise<string | null> {
        this._send('complete', text);

        let buildText = '';
        const tokenEvent = (token: string) => {
            buildText += token;
            chatResponse?.(token, 'token');
        };

        this.on('complete-token', tokenEvent);

        return await new Promise<string | null>((resolve, reject) => {
            this.once('error', reject);
            this.once('modelResponseEnd', () => {
                this.off('complete-token', tokenEvent);
                this.off('error', reject);
                resolve(buildText);
            });
        });
    }

    async prompt(prompt: string, chatResponse?: ChatResponse): Promise<string | null> {
        await this._promiseOpen;
        this._send('prompt', prompt);

        let buildText = '';
        const tokenEvent = (token: string) => {
            buildText += token;
            chatResponse?.(token, 'token');
        };

        this.on('token', tokenEvent);
        this.on('think-token', content => chatResponse?.(content, 'think-token'));

        return await new Promise<string | null>((resolve, reject) => {
            this.once('error', reject);
            this.once('modelResponseEnd', () => {
                this.off('token', tokenEvent);
                this.off('error', reject);
                resolve(buildText);
            });
        });
    }

    close() {
        this._closed = true;
        this._ws.close();
    }

    [Symbol.dispose]() {
        this.close();
    }
}
