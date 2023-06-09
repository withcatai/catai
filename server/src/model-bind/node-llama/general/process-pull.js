import {LLama} from 'llama-node';
import {LLamaCpp} from "llama-node/dist/llm/llama-cpp.js";

/**
 * @typedef {{
 *     maxConcurrentSession: number,
 *     settingsLLamaLoad: any,
 *     settingsLLamaChat: any,
 * }} NodeLlamaActivePullSettings
 */

export default class NodeLlamaActivePull {
    /**
     * @type {{node: LLama, active: boolean}[]}
     */
    #activeNodes = [];
    #waitingResponse = [];
    #modelSettings;
    #llamaConstructor;

    #initWait;

    /**
     * @param {NodeLlamaActivePullSettings} modelSettings
     * @param {typeof LLamaCpp} llamaConstructor
     */
    constructor(modelSettings, llamaConstructor = LLamaCpp) {
        this.#modelSettings = modelSettings;
        this.#llamaConstructor = llamaConstructor;
        this.#initWait = this.#addNew();
    }

    #onClose(llama){
        llama.active = false;
        const waiting = this.#waitingResponse.shift();
        if(waiting){
            waiting(llama);
        }
    }

    async #findLLama(abortSignal){
        await this.#initWait;

        const llama = this.#activeNodes.find(({node, active}) => !active);
        if(llama) return llama;

        try {
            if(this.#activeNodes.length < this.#modelSettings.maxConcurrentSession){
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
            const completionParams = {...this.#modelSettings.settingsLLamaChat, prompt: context};

            try {
                await llama.node.createCompletion(completionParams, (event) => {
                    callback(event.token);
                }, abortSignal);
            } catch (err) {
                if(abortSignal.reason !== 'stop-sequence'){
                    errorCallback(err.message);
                }
            }

            closeCallback();
        });

        this.#onClose(llama);
    }


    async #addNew(active = false){
        const llama = new LLama(this.#llamaConstructor);
        await llama.load(this.#modelSettings.settingsLLamaLoad);

        if(!llama) throw new Error("Error while loading model");
        const activeLlama = {node: llama, active};
        this.#activeNodes.push(activeLlama);

        return activeLlama;
    }
}

export function llamaObjectProxy(object, key){
    return new Proxy({}, {
        get(target, prop){
            return object[key][prop];
        }, 
        set(target, prop, value){
            return object[key][prop] = value;
        }
    });
}