import type {LlamaModel, LlamaModelOptions} from 'node-llama-cpp-v2';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';

type NodeLlamaCppOptions = LlamaModelOptions & {
    wrapper?: string,
    maxTokens?: number,
};

export default class NodeLlamaCppV2 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v2';
    public static override description = 'node-llama-cpp v2, that support GGUF model, and advanced feature such as output format, max tokens and much more';
    private _model?: LlamaModel;
    private _package?: typeof import('node-llama-cpp-v2');

    createChat() {
        return new NodeLlamaCppChat(this, this._model!, this._package!);
    }

    async initialize(): Promise<void> {
        const {LlamaModel, ...others} = await import('node-llama-cpp-v2');
        this._package = others as any;

        this._model = new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
