export default function createChatWrapper(_package: typeof import('node-llama-cpp-v2'), wrapper: string | null = null) {
    switch (wrapper) {
        case 'llama':
            return new _package.LlamaChatPromptWrapper();
        case 'mlp':
            return new _package.ChatMLPromptWrapper();
        case null:
            return new _package.GeneralChatPromptWrapper();
    }

    throw new Error(`Unknown chat wrapper: ${wrapper}`);
}
