import {ChatContext} from '../../../chat-context.js';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';
import type NodeLlamaCpp from './node-llama-cpp-v2.js';
import type {LlamaChatSession, LlamaModel} from 'node-llama-cpp';

export default class NodeLlamaCppChat extends ChatContext {
    private _session: LlamaChatSession;

    constructor(protected _parent: NodeLlamaCpp, model: LlamaModel, private _package: typeof import('node-llama-cpp')) {
        super();
        console.log("models settings", _parent.modelSettings.settings)
        this._session = new _package.LlamaChatSession({
            context: new _package.LlamaContext({model}),
            promptWrapper: createChatWrapper(_package, _parent.modelSettings.settings?.wrapper),
            systemPrompt: _parent.modelSettings.settings?.systemPrompt,
            printLLamaSystemInfo: _parent.modelSettings.settings?.printLLamaSystemInfo,
            conversationHistory: _parent.modelSettings.settings?.conversationHistory
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
            response = await this._session.prompt(prompt, {
                signal: abort.signal,
                onToken: tokens => this._onToken(tokens, onToken),
                maxTokens: this._parent.modelSettings.settings?.maxTokens,
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
