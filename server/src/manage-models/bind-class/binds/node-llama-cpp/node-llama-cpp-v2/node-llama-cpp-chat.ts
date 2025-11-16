import type {ChatHistoryItem, LLamaChatPromptOptions, LlamaChatResponseChunk, LlamaChatSession} from 'node-llama-cpp';
import {ChatContext, ChatResponse} from '../../../chat-context.js';
import {NodeLlamaCppOptions} from './node-llama-cpp-v2.js';

export default class NodeLlamaCppChat extends ChatContext<NodeLlamaCppOptions> {

    constructor(protected _promptSettings: Partial<NodeLlamaCppOptions>, private _session: LlamaChatSession) {
        super();
    }

    public setChatHistory(chatHistory: ChatHistoryItem[]) {
        this._session.setChatHistory(chatHistory);
    }

    public async complete(prompt: string, chatResponse?: ChatResponse) {
        let completion = '';

        try {
            await this._session.completePrompt(prompt, {
                onTextChunk: (text) => {
                    completion += text;
                    chatResponse?.(text, 'complete-token');
                    this.emit('complete-token', text);
                },
                maxTokens: this._promptSettings.completion?.maxTokens ?? this._promptSettings.maxTokens
            });
        } catch {}

        return completion;
    }

    public async prompt(prompt: string, chatResponse?: ChatResponse | Partial<NodeLlamaCppOptions>, overrideSettings?: Partial<NodeLlamaCppOptions>): Promise<string | null> {
        if (typeof chatResponse !== 'function') {
            overrideSettings = chatResponse as Partial<NodeLlamaCppOptions>;
            chatResponse = undefined;
        }

        this.emit('abort', 'Aborted by new prompt');
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            this.off('abort', closeCallback);
        };

        const cleanup = () => {
            closeCallback();
            this._session.dispose({disposeSequence: true});
        };

        this.once('abort', closeCallback);
        this.once('close', cleanup);

        let response = null;
        try {
            const allSettings: LLamaChatPromptOptions = Object.assign({}, this._promptSettings, overrideSettings);

            response = await this._session.prompt(prompt, {
                ...allSettings,
                signal: abort.signal,
                onResponseChunk: chunk => this._onResponseChunk(chunk, chatResponse),
            });
        } catch (error: any) {
            this.emit('error', error.message);
        } finally {
            closeCallback();
            this.emit('modelResponseEnd', response);
        }

        return response;
    }

    private _onResponseChunk(chunk: LlamaChatResponseChunk, onResponse?: ChatResponse) {
        if (chunk.type === 'segment' || chunk.type == null && chunk.text) {
            switch (chunk.segmentType) {
                case 'thought':
                    onResponse?.(chunk.text, 'think-token');
                    this.emit('think-token', chunk.text);
                    break;
                default:
                    onResponse?.(chunk.text, 'token');
                    this.emit('token', chunk.text);
            }
        }
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }

    close() {
        this.emit('close');
    }
}
