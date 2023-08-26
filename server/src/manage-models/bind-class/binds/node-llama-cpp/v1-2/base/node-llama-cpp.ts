import BaseBindClass from '../../../base-bind-class.js';
import type {LlamaModel} from 'node-llama-cpp-v1';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';

type NodeLlamaCppOptions = {
    wrapper?: string;
    seed?: number | null;
    contextSize?: number;
    batchSize?: number;
    gpuCores?: number;
    lowVram?: boolean;
    f16Kv?: boolean;
    logitsAll?: boolean;
    vocabOnly?: boolean;
    useMmap?: boolean;
    useMlock?: boolean;
    embedding?: boolean;
}

export default class NodeLlamaCpp extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v1';
    public static importName = 'node-llama-cpp-v1';
    private _model?: LlamaModel;
    private _package?: typeof import('node-llama-cpp-v1');

    createChat() {
        return new NodeLlamaCppChat(this, this._model!, this._package!);
    }

    async initialize(): Promise<void> {
        const {LlamaModel, ...others} = await import((this.constructor as any).importName);
        this._package = others as any;

        this._model = new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
