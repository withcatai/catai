import {type ChatContext} from '../base-bind-class.js';
import {EventEmitter} from 'events';
import type NodeLlamaCpp from './node-llama-cpp.js';
import {LlamaChatSession, LlamaContext} from 'node-llama-cpp';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';

export default class NodeLlamaCppChat extends EventEmitter implements ChatContext {
    private _session: LlamaChatSession;

    constructor(protected _parent: NodeLlamaCpp, context: LlamaContext) {
        super();
        this._session = new LlamaChatSession({
            context,
            promptWrapper: createChatWrapper(_parent.modelSettings.settings?.wrapper),
        });
    }

    public async prompt(prompt: string): Promise<string | null> {
        this.emit('abort', 'Aborted by new prompt');
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            this.off('abort', closeCallback);
        };
        this.once('abort', closeCallback);

        let response = null;
        try {
            response = await this._session.prompt(prompt, this.onToken.bind(this), {signal: abort.signal});
        } catch (error: any) {
            this.emit('error', error.message);
        } finally {
            closeCallback();
            this.emit('modelResponseEnd', response);
        }

        return response;
    }

    private onToken(token: number[]) {
        const text = this._session.context!.decode(Uint32Array.from(token));
        this.emit('token', text);
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }
}
