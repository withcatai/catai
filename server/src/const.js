export const PORT = 3000;

export const CHAT_SETTINGS = {
    context: 512 * 20,
    numPredict: BigInt(128 * 3),
    temp: 0.2,
    topP: 1,
    topK: BigInt(40),
    repeatPenalty: 1,
    repeatLastN: BigInt(64),
    seed: BigInt(0),
    feedPrompt: true
}