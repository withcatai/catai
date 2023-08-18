import BaseBindClass from '../base-bind-class.js';
import {LlamaModel} from 'node-llama-cpp';
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
    public static override shortName = 'node-llama-cpp';
    private _model?: LlamaModel;

    createChat() {
        return new NodeLlamaCppChat(this, this._model!);
    }

    initialize(): Promise<void> | void {
        this._model = new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
