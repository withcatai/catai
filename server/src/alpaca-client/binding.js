import {jsonModelSettings} from '../model-settings.js';
import NodeLlamaCpp from './node-llama/node-llama-cpp.js';
import NodeLlamaRS from './node-llama/node-llama-rs.js';
import NodeLlamaRwkv from './node-llama/node-llama-rwkv.js';
import BingChatClient from './bing-chat.js';

export const BINDING = [NodeLlamaCpp, NodeLlamaRS, NodeLlamaRwkv, BingChatClient];

export function getSelectedBinding(){
    const modelSettings = jsonModelSettings.metadata[jsonModelSettings.model];
    if(!modelSettings){
        throw new Error(`Model "${jsonModelSettings.model}" not found, install model: "catai install"`);
    }

    const foundBind = BINDING.find(binding => binding.name === modelSettings.bind);
    if(!foundBind){
        throw new Error(`Binding "${modelSettings.bind}" not found, reselect binding: "catai bind ${jsonModelSettings.model} ${BINDING[0].name}"`);
    }

    foundBind.modelSettings = modelSettings;
    foundBind.onceSelected();
    return foundBind;
}