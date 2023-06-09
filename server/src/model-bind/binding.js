import {jsonModelSettings} from '../model-settings.js';
import NodeLlamaCpp from './node-llama/node-llama-cpp.js';
import NodeLlamaRS from './node-llama/node-llama-rs.js';
import NodeLlamaRwkv from './node-llama/node-llama-rwkv.js';
import BingChatClient from './bing-chat.js';
import { IModelClient } from './IModelClient.js';

export const BINDING = [NodeLlamaCpp, NodeLlamaRS, NodeLlamaRwkv, BingChatClient];

let cachedBinding = null;

/**
 * 
 * @returns {typeof IModelClient}
 */
export function getSelectedBinding(){
    if(cachedBinding) return cachedBinding;

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
    return cachedBinding = foundBind;
}