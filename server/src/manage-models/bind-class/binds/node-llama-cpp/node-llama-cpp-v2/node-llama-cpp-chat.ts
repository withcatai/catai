import type {LLamaChatPromptOptions, LlamaChatSession} from 'node-llama-cpp';
import {ChatContext} from '../../../chat-context.js';

export default class NodeLlamaCppChat extends ChatContext {

    constructor(protected _promptSettings: LLamaChatPromptOptions, private _session: LlamaChatSession) {
        super();
    }

    public async prompt(prompt: string, onToken?: (token: string) => void, overrideSettings?: Partial<LLamaChatPromptOptions>): Promise<string | null> {
        this.emit('abort', 'Aborted by new prompt');
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            this.off('abort', closeCallback);
        };
        this.once('abort', closeCallback);

        let response = null;
        try {
            response = await this._session.prompt(prompt, {
                signal: abort.signal,
                onToken: tokens => this._onToken(tokens, onToken),
                ...this._promptSettings,
                ...overrideSettings
            });
        } catch (error: any) {
            this.emit('error', error.message);
        } finally {
            closeCallback();
            this.emit('modelResponseEnd', response);
        }

        return response;
    }

    private _onToken(token: number[], onToken?: (token: string) => void) {
        const text = this._session.context!.decode(Uint32Array.from(token));
        this.emit('token', text);
        onToken?.(text);
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }
}
