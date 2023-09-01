import type {LlamaModel} from 'node-llama-cpp-v1';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';

type NodeLlamaCppOptions = Omit<ConstructorParameters<typeof LlamaModel>['0'], 'modelPath'> & {
    wrapper?: string
};

export default class NodeLlamaCppV1 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp';
    public static override description = 'node-llama-cpp v1, that support GGMLv3 models';
    private _model?: LlamaModel;
    private _package?: typeof import('node-llama-cpp-v1');

    createChat() {
        return new NodeLlamaCppChat(this, this._model!, this._package!);
    }

    async initialize(): Promise<void> {
        const {LlamaModel, ...others} = await import('node-llama-cpp-v1');
        this._package = others as any;

        this._model = new LlamaModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }
}
