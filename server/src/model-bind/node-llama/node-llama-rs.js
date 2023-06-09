import NodeLlamaGeneral from './general/node-llama-general.js';
import NodeLlamaActivePull from './general/process-pull.js';
import { LLMRS } from "llama-node/dist/llm/llm-rs.js";
import { ModelType } from "@llama-node/core";
import objectAssignDeep from 'object-assign-deep';
import {llamaObjectProxy} from './general/process-pull.js';
export const MAX_ACTIVE_SESSIONS = 5;
export const SETTINGS_NODE_LLAMA = {
    modelType: ModelType.Llama
};

export const CHAT_SETTINGS_NODE_LLAMA = {
    numPredict: 2048,
    temperature: 0.2,
    topP: 1,
    topK: 40,
    repeatPenalty: 1,
    repeatLastN: 64,
    seed: 0,
    feedPrompt: true,
    stopSequence: "### Human"
};

const defaultSettings = {
    maxConcurrentSession: MAX_ACTIVE_SESSIONS,
    settingsLLamaLoad: SETTINGS_NODE_LLAMA,
    settingsLLamaChat: CHAT_SETTINGS_NODE_LLAMA
}

export default class NodeLlamaRS extends NodeLlamaGeneral {
    static name = 'node-llama-rs';

    static onceSelected() {
        NodeLlamaRS.modelSettings = objectAssignDeep({}, defaultSettings, NodeLlamaRS.modelSettings);
        NodeLlamaRS.modelSettings.settingsLLamaLoad.modelPath = NodeLlamaRS.modelSettings.downloadedFiles.model;

        NodeLlamaRS.pull = new NodeLlamaActivePull(
            llamaObjectProxy(NodeLlamaRS, 'modelSettings'),
            LLMRS
        );
    }
}