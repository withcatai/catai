import BaseBindClass from './binds/base-bind-class.js';
import AppDb from '../../storage/app-db.js';
import NodeLlamaCppV1 from './binds/node-llama-cpp/v1-2/node-llama-cpp-v1.js';
import NodeLlamaCppV2 from './binds/node-llama-cpp/v1-2/node-llama-cpp-v2.js';

export const ALL_BINDS = [NodeLlamaCppV1, NodeLlamaCppV2];
const cachedBinds: { [key: string]: InstanceType<typeof BaseBindClass> } = {};

function getActiveModelDetails() {
    const modelDetails = AppDb.db.models[AppDb.db.activeModel!];

    if (!modelDetails)
        throw new Error('No active model');

    if(!modelDetails.bindClass)
        throw new Error('No bind class');

    return modelDetails;
}

export function getCacheBindClass(){
    const modelDetails = getActiveModelDetails();

    if(cachedBinds[modelDetails.bindClass])
        return cachedBinds[modelDetails.bindClass];

    return null;
}
export default async function createChat(){
    const modelDetails = getActiveModelDetails();
    const cachedBindClass = getCacheBindClass();

    if(cachedBindClass)
        return cachedBindClass.createChat();

    const bindClass = ALL_BINDS.find(x => x.shortName === modelDetails.bindClass);
    if (!bindClass)
        throw new Error(`Bind class ${modelDetails.bindClass} not found`);

    const bindClassInstance = cachedBinds[modelDetails.bindClass] ??= new bindClass(modelDetails);
    await bindClassInstance.initialize();

    return bindClassInstance.createChat();
}

