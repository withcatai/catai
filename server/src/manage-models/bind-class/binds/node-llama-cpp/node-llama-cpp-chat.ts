import {type ChatContext} from '../base-bind-class.js';
import {EventEmitter} from 'events';
import type NodeLlamaCpp from './node-llama-cpp.js';
import {LlamaChatSession, LlamaModel} from 'node-llama-cpp';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';

export default class NodeLlamaCppChat extends EventEmitter implements ChatContext {
    session: LlamaChatSession;

    constructor(protected parent: NodeLlamaCpp, protected model: LlamaModel) {
        super();
        this.session = new LlamaChatSession({
            model,
            promptWrapper: createChatWrapper(parent.modelSettings.settings?.wrapper),
        });
    }

    async prompt(prompt: string): Promise<string | null> {
        this.emit('abort', 'Aborted by new prompt');

        const abort = new AbortController();
        const abortCallback = abort.abort.bind(abort);
        this.once('abort', abortCallback);

        let response = null;
        try {
            response = await this.session.prompt(prompt, this.onToken.bind(this), {signal: abort.signal});
        } catch (error: any) {
            this.emit('error', error.message);
        }

        this.off('abort', abortCallback);
        this.emit('modelResponseEnd', response);
        return response;
    }

    private onToken(token: number | number[]) {
        const text = this.model.decode(Uint32Array.from([token].flat()));
        this.emit('token', text);
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }
}
