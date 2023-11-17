export default function createChatWrapper(_package: typeof import('node-llama-cpp'), wrapper: string | null = null) {
    switch (wrapper) {
        case 'llamaChat':
            return new _package.LlamaChatPromptWrapper();
        case 'chatML':
            return new _package.ChatMLChatPromptWrapper();
        case 'falconChat':
            return new _package.FalconChatPromptWrapper();
        case null:
            return new _package.GeneralChatPromptWrapper();
    }

    throw new Error(`Unknown chat wrapper: ${wrapper}`);
}
