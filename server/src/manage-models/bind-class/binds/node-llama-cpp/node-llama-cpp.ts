import BaseBindClass, {type ChatContext} from '../base-bind-class.js';
import {LlamaModel} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import {ClassPull} from 'class-pull';
import ENV_CONFIG from '../../../../storage/config.js';

type NodeLlamaCppOptions = {
    wrapper?: string;
}

export default class NodeLlamaCpp extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp';
    private _pull?: ClassPull<LlamaModel>;
    createChat(): ChatContext {
        return new NodeLlamaCppChat(this, this._pull!);
    }

    initialize(): Promise<void> | void {
        this._pull = new ClassPull(
            () => new LlamaModel({
                modelPath: this.modelSettings.downloadedFiles.model,
            }),
            {
                limit: ENV_CONFIG.SIMULTANEOUSLY_EXECUTING,
                createOnInit: 1
            }
        )
    }
}
