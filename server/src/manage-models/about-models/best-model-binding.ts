import NodeLlamaCppV2 from '../bind-class/binds/node-llama-cpp/v1-2/node-llama-cpp-v2.js';
import NodeLlamaCppV1 from '../bind-class/binds/node-llama-cpp/v1-2/node-llama-cpp-v1.js';


const DEFAULT_BIND_CLASS = NodeLlamaCppV2.shortName;

export const MODELS_REGEX = {
    [NodeLlamaCppV1.shortName]: [/ggml/],
    [NodeLlamaCppV2.shortName]: [/gguf/]
};

export default function findBestModelBinding(files: { [key: string]: string }) {
    for (const [key, regexes] of Object.entries(MODELS_REGEX)) {
        if (regexes.every(regex => regex.test(files.model)))
            return key;
    }

    return DEFAULT_BIND_CLASS;
}
