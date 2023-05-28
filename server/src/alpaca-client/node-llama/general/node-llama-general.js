import BuildCtx from './build-ctx.js';
import {IAlpacaClient} from '../../IAlpacaClient.js';

export default class NodeLlamaGeneral extends IAlpacaClient {
    static pull;

    static name = 'node-llama-general';

    ctx = new BuildCtx();
    llama;

    async question(text){
        const context = this.ctx.buildCtx(text);
        this.abortSignal.abort();

        const abortSignal = new AbortController();
        this.abortSignal = abortSignal;

        await this.constructor.pull.question(context, {
            callback: (token) => {
                if(this.callbackWithStopSequence(token, this.tokenCallback)){
                    process.stdout.write(token);
                    this.ctx.processToken(token);
                }
            },
            errorCallback: this.errorCallback,
            abortSignal: abortSignal.signal
        });

        this.closeCallback();
    }

    callbackWithStopSequence(token, tokenCallback){
        const fullResponse = this.ctx.lastResponse + token;

        let stopSequence = this.constructor.modelSettings.settingsLLamaChat.stopSequence;
        if(!Array.isArray(stopSequence)){
            stopSequence = [stopSequence];
        }

        if(stopSequence.find(seq => fullResponse.endsWith(seq))){
            this.abortSignal.abort('stop-sequence');
            console.log('--stop sequence abort--');
            return false;
        }

        tokenCallback(token);
        return true;
    }

    close() {
        this.abortSignal.abort('close');
    }

    static trimMessageEnd(message) {
        return super.trimMessageEnd(message, '<end>');
    }

    static onceSelected() {
        throw new Error('Not implemented!');
    }
}