import NodeLlamaGeneral from './general/node-llama-general.js';
import {llamaObjectProxy} from './general/process-pull.js';
import NodeLlamaActivePull from './general/process-pull.js';
import { LLamaCpp } from 'llama-node/dist/llm/llama-cpp.js';
import objectAssignDeep from 'object-assign-deep';

export const MAX_ACTIVE_SESSIONS = 5;
export const SETTINGS_NODE_LLAMA = {
    enableLogging: false,
    nCtx: 2048,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: false,
    nGpuLayers: 3,
};

export const CHAT_SETTINGS_NODE_LLAMA = {
    nThreads: 4,
    nTokPredict: 2048,
    topK: 40,
    topP: 0.1,
    temp: 0.2,
    repeatPenalty: 1,
    stopSequence: "### Human"
};

const defaultSettings = {
    maxConcurrentSession: MAX_ACTIVE_SESSIONS,
    settingsLLamaLoad: SETTINGS_NODE_LLAMA,
    settingsLLamaChat: CHAT_SETTINGS_NODE_LLAMA,
}

export default class NodeLlamaCpp extends NodeLlamaGeneral {
    static name = 'node-llama-cpp';
    static onceSelected() {
        NodeLlamaCpp.modelSettings = objectAssignDeep({}, defaultSettings, NodeLlamaCpp.modelSettings);
        NodeLlamaCpp.modelSettings.settingsLLamaLoad.path = NodeLlamaCpp.modelSettings.downloadedFiles.model;

        NodeLlamaCpp.pull = new NodeLlamaActivePull(
            llamaObjectProxy(NodeLlamaCpp, 'modelSettings'),
            LLamaCpp
        );
    }
}