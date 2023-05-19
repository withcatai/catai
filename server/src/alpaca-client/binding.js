import NodeLlama from './node-llama/node-llama.js';
import {jsonModelSettings} from '../model-settings.js';

export const BINDING = [NodeLlama];

export function getSelectedBinding(){
    let foundBind;

    if(!jsonModelSettings.bindingKey){
        foundBind =  BINDING[0];
    } else {
        const foundBind = BINDING.find(binding => binding.name === jsonModelSettings.bindingKey);
        if(!foundBind){
            throw new Error(`Binding "${jsonModelSettings.bindingKey}" not found, reselect binding: "catai bind ${BINDING[0].name}"`);
        }
    }

    foundBind.key = jsonModelSettings.bindingKey;
    foundBind.onceSelected();
    return foundBind;
}