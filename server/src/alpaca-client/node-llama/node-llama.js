import {LLamaClient} from 'llama-node';
import {CHAT_SETTINGS_NODE_LLAMA, SELECTED_BINDING} from '../../config.js';
import BuildCtx from './build-ctx.js';
import {IAlpacaClient} from '../IAlpacaClient.js';
import {MODEL_PATH} from '../../const.js';


export default class NodeLlama extends IAlpacaClient {
    static preloadLLamaClient = SELECTED_BINDING === 'node-llama' && NodeLlama.createLLamaClient();

    ctx = new BuildCtx();
    llama;
    tokenCallback;
    errorCallback;
    closeCallback

    constructor(tokenCallback = null, errorCallback = null, closeCallback = null) {
        super();
        this.tokenCallback = tokenCallback;
        this.errorCallback = errorCallback;
        this.closeCallback = closeCallback;

        this.llama = NodeLlama.preloadLLamaClient ?? NodeLlama.createLLamaClient();
        NodeLlama.preloadLLamaClient = null;
    }

    async question(text){
        const context = this.ctx.buildCtx(text);

        try {
            await this.llama.createTextCompletion( {
                prompt: context,
                ...CHAT_SETTINGS_NODE_LLAMA
            }, ({token}) => {
                process.stdout.write(token);
                this.ctx.processToken(token);
                this.tokenCallback(token);
            });
        } catch (err) {
            this.errorCallback(err.message);
        }

        this.closeCallback();
    }

    static createLLamaClient(){
        return new LLamaClient({path: MODEL_PATH, numCtxTokens: CHAT_SETTINGS_NODE_LLAMA.context}, false);
    }
}