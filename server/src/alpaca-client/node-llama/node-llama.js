import BuildCtx from './build-ctx.js';
import {IAlpacaClient} from '../IAlpacaClient.js';
import NodeLlamaActivePull from './process-pull.js';


const NodeLlamaPull = new NodeLlamaActivePull();

export default class NodeLlama extends IAlpacaClient {
    static name = 'node-llama';

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
    }

    async question(text){
        const context = this.ctx.buildCtx(text);
        this.abortSignal.abort();

        const abortSignal = new AbortController();
        this.abortSignal = abortSignal;

        await NodeLlamaPull.question(context, {
            callback: (token) => {
                process.stdout.write(token);
                this.ctx.processToken(token);
                this.tokenCallback(token);
            },
            errorCallback: this.errorCallback,
            abortSignal: abortSignal.signal
        });

        this.closeCallback();
    }

    close() {
        this.abortSignal.abort();
    }

    static trimMessageEnd(message) {
        return super.trimMessageEnd(message, '<end>');
    }
}