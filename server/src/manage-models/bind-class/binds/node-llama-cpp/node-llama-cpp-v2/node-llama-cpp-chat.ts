import type {LLamaChatPromptOptions, LlamaChatSession, Token} from 'node-llama-cpp';
import {ChatContext} from '../../../chat-context.js';

export default class NodeLlamaCppChat extends ChatContext<LLamaChatPromptOptions> {

    constructor(protected _promptSettings: Partial<LLamaChatPromptOptions>, private _session: LlamaChatSession) {
        super();
    }

    public async prompt(prompt: string, onTokenText?: ((token: string) => void) | Partial<LLamaChatPromptOptions>, overrideSettings?: Partial<LLamaChatPromptOptions>): Promise<string | null> {
        if (typeof onTokenText !== 'function') {
            overrideSettings = onTokenText as Partial<LLamaChatPromptOptions>;
            onTokenText = undefined;
        }

        this.emit('abort', 'Aborted by new prompt');
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            this.off('abort', closeCallback);
        };
        this.once('abort', closeCallback);

        let response = null;
        try {
            const allSettings: LLamaChatPromptOptions = Object.assign({}, this._promptSettings, overrideSettings);
            response = await this._session.prompt(prompt, {
                ...allSettings,
                signal: abort.signal,
                onToken: tokens => this._onToken(tokens, onTokenText),
            });
        } catch (error: any) {
            this.emit('error', error.message);
        } finally {
            closeCallback();
            this.emit('modelResponseEnd', response);
        }

        return response;
    }

    private _onToken(tokens: Token[], onToken?: (token: string) => void) {
        const text = this._session.context!.model.detokenize(tokens);
        this.emit('token', text);
        onToken?.(text);
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }
}
