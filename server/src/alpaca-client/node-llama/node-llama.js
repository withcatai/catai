import {SELECTED_BINDING} from '../../config.js';
import BuildCtx from './build-ctx.js';
import {IAlpacaClient} from '../IAlpacaClient.js';
import NodeLlamaActivePull from './process-pull.js';


const THIS_BINDING_SELECTED = SELECTED_BINDING === 'node-llama';
const NodeLlamaPull = THIS_BINDING_SELECTED && new NodeLlamaActivePull();

export default class NodeLlama extends IAlpacaClient {

    ctx = new BuildCtx();
    llama;
    tokenCallback;
    errorCallback;
    closeCallback

    abortSignal = new AbortController();

    constructor(tokenCallback = null, errorCallback = null, closeCallback = null) {
        super();
        this.tokenCallback = tokenCallback;
        this.errorCallback = errorCallback;
        this.closeCallback = closeCallback;
    }

    async question(text){
        const context = this.ctx.buildCtx(text);
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
}