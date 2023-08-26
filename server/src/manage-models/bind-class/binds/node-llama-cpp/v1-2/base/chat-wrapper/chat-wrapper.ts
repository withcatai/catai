export default function createChatWrapper(_package: typeof import('node-llama-cpp-v1'), wrapper: string | null = null) {
    switch (wrapper) {
        case 'llama':
            return new _package.LlamaChatPromptWrapper();
        case null:
            return new _package.GeneralChatPromptWrapper();
    }

    throw new Error(`Unknown chat wrapper: ${wrapper}`);
}
