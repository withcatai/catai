import {LLamaClient} from 'llama-node';
import {fileURLToPath} from 'url';
import {jsonModelSettings} from '../model-settings.js';
import {CHAT_SETTINGS} from '../const.js';
import path from 'path';
import BuildCtx from './build-ctx.js';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const MODEL_PATH = path.join(__dirname, '..', '..', jsonModelSettings.model);

export class ChatManager {
    static preloadLLamaClient = ChatManager.createLLamaClient();

    ctx = new BuildCtx();
    llama;
    tokenCallback;
    errorCallback;

    constructor(tokenCallback = null, errorCallback = null) {
        this.tokenCallback = tokenCallback;
        this.errorCallback = errorCallback;

        this.llama = ChatManager.preloadLLamaClient ?? ChatManager.createLLamaClient();
        ChatManager.preloadLLamaClient = null;
    }

    async question(text){
        const context = this.ctx.buildCtx(text);

        try {
            await this.llama.createTextCompletion( {
                prompt: context,
                ...CHAT_SETTINGS
            }, ({token}) => {
                this.ctx.processToken(token);
                this.tokenCallback(token);
            });
        } catch (err) {
            this.errorCallback(err.message);
        }
    }

    static createLLamaClient(){
        return new LLamaClient({path: MODEL_PATH, numCtxTokens: CHAT_SETTINGS.context}, false);
    }
}