import type {LlamaContextOptions, LlamaModel} from 'node-llama-cpp';
import {LLamaChatPromptOptions} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';

const DEFAULT_CONTEXT_SIZE = 4096;

type NodeLlamaCppOptions = Omit<LlamaContextOptions, 'model'> & LLamaChatPromptOptions & {
    wrapper?: string,
};

export default class NodeLlamaCppV2 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v2';
    public static override description = 'node-llama-cpp v2, that support GGUF model, and advanced feature such as output format, max tokens and much more';
    private _model?: LlamaModel;
    private _package?: typeof import('node-llama-cpp');

    createChat(overrideSettings?: NodeLlamaCppOptions): NodeLlamaCppChat {
        if (!this._model || !this._package)
            throw new Error('Model not initialized');

        const settings: NodeLlamaCppOptions = {...this.modelSettings.settings, ...overrideSettings};
        settings.batchSize ??= settings.contextSize ??= DEFAULT_CONTEXT_SIZE;

        const session = new this._package.LlamaChatSession({
            context: new this._package.LlamaContext({
                model: this._model,
                ...settings
            }),
            promptWrapper: createChatWrapper(this._package, settings?.wrapper)
        });

        return new NodeLlamaCppChat(settings, session);
    }

    async initialize(): Promise<void> {
        const {LlamaModel, ...others} = await import('node-llama-cpp');
        this._package = others as any;

        this._model = new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model
        });
    }
}
