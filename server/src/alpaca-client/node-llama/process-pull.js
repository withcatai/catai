import {LLama} from 'llama-node';
import {MODEL_PATH} from '../../const.js';
import {CHAT_SETTINGS_NODE_LLAMA, MAX_ACTIVE_SESSIONS, SETTINGS_NODE_LLAMA} from '../../config.js';
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";


export default class NodeLlamaActivePull {
    /**
     * @type {{node: LLama, active: boolean}[]}
     */
    #activeNodes = [];
    #waitingResponse = [];
    #maxActiveNodes;

    constructor(maxActiveNodes = MAX_ACTIVE_SESSIONS) {
        this.#maxActiveNodes = maxActiveNodes;
        this.#addNew();
    }

    #onClose(llama){
        llama.active = false;
        const waiting = this.#waitingResponse.shift();
        if(waiting){
            waiting(llama);
        }
    }

    async #findLLama(abortSignal){
        const llama = this.#activeNodes.find(({node, active}) => !active);
        if(llama) return llama;

        try {
            if(this.#activeNodes.length < this.#maxActiveNodes){
                return this.#addNew();
            }
        } catch {}

        let resolve;
        /**
         * @type {Promise<typeof llama>}
         */
        const wait = new Promise(r => resolve = r);
        this.#waitingResponse.push(resolve);

        abortSignal.onabort = () => {
            this.#waitingResponse = this.#waitingResponse.filter(r => r !== resolve);
            resolve();
        };

        return await wait;
    }

    /**
     * 
     * @param {string} context 
     * @param {{abortSignal: AbortSignal, callback: Function, errorCallback: Function}} param1 
     * @returns 
     */
    async question(context, {abortSignal, callback, errorCallback}){
        const llama = await this.#findLLama(abortSignal);
        if(!llama) return;

        llama.active = true;
        await new Promise(async closeCallback => {
            const completionParams = {...CHAT_SETTINGS_NODE_LLAMA, prompt: context};

            try {
                await llama.node.createCompletion(completionParams, (event) => {
                    callback(event.token);
                }, abortSignal);
            } catch (err) {
                errorCallback(err.message);
            }

            closeCallback();
        });

        this.#onClose(llama);
    }


    #addNew(active = false){
        const llama = new LLama(LLamaCpp);
        llama.load({
            path: MODEL_PATH,
            ...SETTINGS_NODE_LLAMA,
        });

        if(!llama) throw new Error("Error while loading model");
        const activeLlama = {node: llama, active};
        this.#activeNodes.push(activeLlama);

        return activeLlama;
    }
}