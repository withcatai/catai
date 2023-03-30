import {CHAT_SETTINGS_ALPACA_CPP} from '../../config.js';
import ChatThread from './chat-threads.js';
import {IAlpacaClient} from '../IAlpacaClient.js';
import {ALPACA_CPP_EXEC, MODEL_PATH} from '../../const.js';

export default class AlpacaCPPClient extends IAlpacaClient{
    thread;
    question;
    onclose;

    constructor(callback, onerror, onclose) {
        super();
        this.onclose = onclose;
        this.thread = new ChatThread(ALPACA_CPP_EXEC, {model: MODEL_PATH, ...CHAT_SETTINGS_ALPACA_CPP}, callback, onerror, onclose);
        this.#init();
    }

    #init() {
        const {prompt, waitInit} = this.thread.run();
        const promiseInit = waitInit();
        promiseInit.then(this.onclose);

        this.question = async (text) => {
            await promiseInit;
            await prompt(text);
            this.onclose?.();
        };
    }

    close() {
        this.thread.kill();
    }
}