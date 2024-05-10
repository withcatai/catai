import {getLlama, Llama, LLamaChatPromptOptions, LlamaChatSession, LlamaChatSessionOptions, LlamaContextOptions, LlamaModel, LlamaModelOptions, LlamaOptions} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';

export type NodeLlamaCppOptions =
    Omit<LlamaContextOptions, 'model'> &
    Omit<LlamaModelOptions, 'modelPath'> &
    Omit<LlamaChatSessionOptions, 'contextSequence'> &
    LLamaChatPromptOptions;


let cachedLlama: Llama | null = null;

export async function initCatAILlama(options?: LlamaOptions) {
    return cachedLlama = await getLlama(options);
}

export default class NodeLlamaCppV2 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v2';
    public static override description = 'node-llama-cpp v2, that support GGUF model, and advanced feature such as output format, max tokens and much more';
    private _model?: LlamaModel;

    async createChat(overrideSettings?: NodeLlamaCppOptions) {
        if (!this._model)
            throw new Error('Model not initialized');

        const settings = Object.assign({}, this.modelSettings.settings, overrideSettings);
        const context = await this._model.createContext({
            ...settings
        });

        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
            ...settings
        });

        return new NodeLlamaCppChat(settings, session);
    }

    async initialize(): Promise<void> {
        const llama = cachedLlama ?? await initCatAILlama();
        this._model = await llama.loadModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
