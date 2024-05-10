import type {
    LLamaChatPromptOptions,
    LlamaChatSessionOptions,
    LlamaContextOptions,
    LlamaModel,
    LlamaModelOptions
} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';
import objectAssignDeep from "object-assign-deep";

export type NodeLlamaCppOptions =
    Omit<LlamaContextOptions, 'model'> &
    Omit<LlamaModelOptions, 'modelPath'> &
    Omit<LlamaChatSessionOptions, 'contextSequence'> &
    LLamaChatPromptOptions;

export default class NodeLlamaCppV2 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v2';
    public static override description = 'node-llama-cpp v2, that support GGUF model, and advanced feature such as output format, max tokens and much more';
    private _model?: LlamaModel;
    private _package?: typeof import('node-llama-cpp');

    async createChat(overrideSettings?: NodeLlamaCppOptions) {
        if (!this._model || !this._package)
            throw new Error('Model not initialized');

        const settings= objectAssignDeep({}, this.modelSettings.settings, overrideSettings);
        const context = await this._model.createContext({
            ...settings
        });

        const session = new this._package.LlamaChatSession({
            contextSequence: context.getSequence(),
            ...settings
        });

        return new NodeLlamaCppChat(settings, session);
    }

    async initialize(): Promise<void> {
        const {getLlama, ...others} = await import('node-llama-cpp');
        this._package = others as any;

        const llama = await getLlama();
        this._model = await llama.loadModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
