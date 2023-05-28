import NodeLlamaGeneral from './general/node-llama-general.js';
import NodeLlamaActivePull from './general/process-pull.js';
import {RwkvCpp} from 'llama-node/dist/llm/rwkv-cpp.js';
import objectAssignDeep from 'object-assign-deep';

export const MAX_ACTIVE_SESSIONS = 5;
export const SETTINGS_NODE_LLAMA = {
    nThreads: 4,
    enableLogging: true,
};

export const CHAT_SETTINGS_NODE_LLAMA = {
    maxPredictLength: 2048,
    topP: 0.1,
    temp: 0.1,
    stopSequence: ["### Human", "### Assistant", "### Response"],
    presencePenalty: 0.2,
    frequencyPenalty: 0.2
};

const defaultSettings = {
    maxConcurrentSession: MAX_ACTIVE_SESSIONS,
    settingsLLamaLoad: SETTINGS_NODE_LLAMA,
    settingsLLamaChat: CHAT_SETTINGS_NODE_LLAMA,
}

export default class NodeLlamaRwkv extends NodeLlamaGeneral {
    static name = 'node-llama-rwkv';
    static onceSelected() {
        NodeLlamaRwkv.modelSettings = objectAssignDeep({}, defaultSettings, NodeLlamaRwkv.modelSettings);
        NodeLlamaRwkv.modelSettings.settingsLLamaLoad.modelPath = NodeLlamaRwkv.modelSettings.downloadedFiles.model;
        NodeLlamaRwkv.modelSettings.settingsLLamaLoad.tokenizerPath = NodeLlamaRwkv.modelSettings.downloadedFiles.tokenizer;

        NodeLlamaRwkv.pull = new NodeLlamaActivePull(NodeLlamaRwkv.modelSettings, RwkvCpp);
        NodeLlamaRwkv.onceSelected = () => {};
    }
}