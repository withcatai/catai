import {EventEmitter} from 'events';
import {ChatHistoryItem} from 'node-llama-cpp';

type ResponseTypes = 'token' | 'think-token'

export interface ChatContextEvents {
    on(event: ResponseTypes | 'error' | 'abort', listener: (message: string | Uint8Array) => void): this;

    on(event: 'modelResponseEnd' | 'close', listener: () => void): this;

    emit(event: ResponseTypes | 'error' | 'abort', message: string | Uint8Array): boolean;

    emit(event: 'modelResponseEnd' | 'close'): boolean;
}

export type ChatResponse = (content: string | Uint8Array, type: ResponseTypes) => void;

export abstract class ChatContext<Settings = any> extends EventEmitter implements ChatContextEvents {

    abstract setChatHistory(chatHistory: ChatHistoryItem[]): void
    abstract resetChatHistory(): void;

    /**
     * Prompt the model and stream the response
     */
    abstract prompt(prompt: string, overrideSettings?: Partial<Settings>): Promise<string | null>;
    abstract prompt(prompt: string, onResponse?: ChatResponse, overrideSettings?: Partial<Settings>): Promise<string | null>;

    /**
     * Abort the model response
     * @param reason
     */
    abstract abort(reason?: string): void;

    abstract close(): void
}
