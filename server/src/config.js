export const PORT = 3000;

export const OPEN_IN_BROWSER = true;

export const SELECTED_BINDING = 'node-llama' || 'alpaca-cpp';

export const MAX_ACTIVE_SESSIONS = 5;

export const SETTINGS_NODE_LLAMA = {
    enableLogging: false,
    nCtx: 1024,
    nParts: -1,
    seed: 0,
    f16Kv: false,
    logitsAll: false,
    vocabOnly: false,
    useMlock: false,
    embedding: false,
    useMmap: false
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

export const CHAT_SETTINGS_ALPACA_CPP = {
    ctx_size: 2048,
    temp: 0.1,
    top_p: 0.9,
    top_k: 40,
    repeat_penalty: 1.3,
    repeat_last_n: 64,
    batch_size: 20
};