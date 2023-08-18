import type NodeLlamaCpp from './node-llama-cpp.js';
import {LlamaChatSession, LlamaContext, LlamaModel} from 'node-llama-cpp';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';
import {ChatContext} from '../../chat-context.js';

export default class NodeLlamaCppChat extends ChatContext {
    private _session: LlamaChatSession;

    constructor(protected _parent: NodeLlamaCpp, model: LlamaModel) {
        super();
        this._session = new LlamaChatSession({
            context: new LlamaContext({model}),
            promptWrapper: createChatWrapper(_parent.modelSettings.settings?.wrapper),
        });
    }

    public async prompt(prompt: string, onToken?: (token: string) => void): Promise<string | null> {
        this.emit('abort', 'Aborted by new prompt');
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            this.off('abort', closeCallback);
        };
        this.once('abort', closeCallback);

        let response = null;
        try {
            response = await this._session.prompt(prompt, tokens => this._onToken(tokens, onToken), {signal: abort.signal});
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
