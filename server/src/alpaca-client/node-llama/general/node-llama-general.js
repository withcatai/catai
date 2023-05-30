import BuildCtx from './build-ctx.js';
import {IAlpacaClient} from '../../IAlpacaClient.js';

export default class NodeLlamaGeneral extends IAlpacaClient {
    static pull;

    static name = 'node-llama-general';

    ctx = new BuildCtx();
    llama;

    #textInReview = '';

    async question(text){
        const context = this.ctx.buildCtx(text);
        this.abortSignal.abort();

        const abortSignal = new AbortController();
        this.abortSignal = abortSignal;

        await this.constructor.pull.question(context, {
            callback: (token) => {
                const reviewContent = this.checkForStopSequence(token, this.tokenCallback);
                if(!reviewContent) return;

                process.stdout.write(reviewContent);
                this.ctx.processToken(reviewContent);
                this.tokenCallback(reviewContent);

            },
            errorCallback: this.errorCallback,
            abortSignal: abortSignal.signal
        });

        this.closeCallback();
    }

    get stopSequence(){
        const stopSequence = this.constructor.modelSettings.settingsLLamaChat.stopSequence;
        if(!Array.isArray(stopSequence)){
            return [stopSequence];
        }

        return stopSequence;
    }

    checkForStopSequence(token){
        const stopSequence = this.stopSequence;

        const textReview = this.#textInReview + token;
        const waitForNextTextReview = stopSequence.find(x => x.startsWith(textReview));

        if(waitForNextTextReview){
            const stopSequenceMatch = stopSequence.find(x => x.includes(textReview));
            if(stopSequenceMatch){
                this.abortSignal.abort('stop-sequence');
                console.log('--stop sequence abort--');
                return false;
            }

            this.#textInReview = textReview;
            return false;
        }

        this.#textInReview = '';
        return textReview;
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