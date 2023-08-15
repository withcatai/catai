import {LlamaChatPromptWrapper} from 'node-llama-cpp';
import {GeneralChatPromptWrapper} from './wrappers/general-chat-prompt-wrapper.js';

export default function createChatWrapper(wrapper: string | null = null) {
    switch (wrapper) {
        case 'llama':
            return new LlamaChatPromptWrapper();
        case null:
            return new GeneralChatPromptWrapper();
    }

    throw new Error(`Unknown chat wrapper: ${wrapper}`);
}
