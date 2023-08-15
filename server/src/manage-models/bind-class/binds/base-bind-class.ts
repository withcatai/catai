import {EventEmitter} from 'events';
import {ModelSettings} from '../../../storage/app-db.js';

export interface ChatContext extends EventEmitter {
    on(event: 'token', listener: (message: string) => void): this;
    on(event: 'error', listener: (error: string) => void): this;
    on(event: 'abort', listener: (reason: string) => void): this;
    on(event: 'modelResponseEnd', listener: (response: string | null) => void): this;

    prompt: (prompt: string) => Promise<string | null>;
    abort(reason?: string): void;
}

export default abstract class BaseBindClass<T> {
    public static shortName?: string;

    public constructor(public modelSettings: ModelSettings<T>) {
    }

    public abstract initialize(): Promise<void> | void;

    public abstract createChat(): ChatContext;
}
