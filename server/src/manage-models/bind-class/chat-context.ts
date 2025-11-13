import {EventEmitter} from 'events';

export interface ChatContextEvents {
    on(event: 'token' | 'error' | 'abort', listener: (message: string) => void): this;

    on(event: 'modelResponseEnd', listener: () => void): this;

    emit(event: 'token' | 'error' | 'abort', message: string): boolean;

    emit(event: 'modelResponseEnd'): boolean;
}

export abstract class ChatContext<Settings = any> extends EventEmitter implements ChatContextEvents {

    /**
     * Prompt the model and stream the response
     */
    abstract prompt(prompt: string, overrideSettings?: Partial<Settings>): Promise<string | null>;
    abstract prompt(prompt: string, onToken?: (token: string) => void, overrideSettings?: Partial<Settings>): Promise<string | null>;

    /**
     * Abort the model response
     * @param reason
     */
    abstract abort(reason?: string): void;
}
