import {EventEmitter} from 'events';

export interface ChatContextEvents {
    on(event: 'token' | 'error' | 'abort', listener: (message: string) => void): this;

    on(event: 'modelResponseEnd', listener: () => void): this;

    emit(event: 'token' | 'error' | 'abort', message: string): boolean;

    emit(event: 'modelResponseEnd'): boolean;
}

export abstract class ChatContext extends EventEmitter implements ChatContextEvents {

    abstract prompt(prompt: string, onToken?: (token: string) => void): Promise<string | null>;

    abstract abort(reason?: string): void;
}
