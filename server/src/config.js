import yn from 'yn';

export const PORT = parseInt(process.env.CATAI_PORT) || 3000;
export const OPEN_IN_BROWSER = yn(process.env.CATAI_OPEN_IN_BROWSER) ?? true;
export const MAX_ACTIVE_SESSIONS = parseInt(process.env.CATAI_MAX_ACTIVE_SESSIONS) || 5;

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