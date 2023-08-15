import BaseBindClass, {type ChatContext} from '../base-bind-class.js';
import {LlamaModel} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';

type NodeLlamaCppOptions = {
    wrapper?: string;
}

export default class NodeLlamaCpp extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp';
    private _model?: LlamaModel;
    createChat(): ChatContext {
        return new NodeLlamaCppChat(this, new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model,
        }));
    }

    initialize(): Promise<void> | void {
    }
}
