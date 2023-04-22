export const PORT = 3000;

export const OPEN_IN_BROWSER = true;

export const SELECTED_BINDING = 'alpaca-cpp' || 'node-llama';
export const CHAT_SETTINGS_ALPACA_CPP = {
    ctx_size: 2048,
    temp: 0.1,
    top_p: 0.9,
    top_k: 40,
    repeat_penalty: 1.3,
    repeat_last_n: 64,
    batch_size: 20
};

export const CHAT_SETTINGS_NODE_LLAMA = {
    context: 2048,
    numPredict: BigInt(128),
    temp: 0.1,
    topP: 0.9,
    topK: BigInt(40),
    repeatPenalty: 1.3,
    repeatLastN: BigInt(64),
    seed: BigInt(0),
    feedPrompt: true
};