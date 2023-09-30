import BaseBindClass from './binds/base-bind-class.js';
import AppDb from '../../storage/app-db.js';
import NodeLlamaCppV2 from './binds/node-llama-cpp/node-llama-cpp-v2/node-llama-cpp-v2.js';
import AwaitLock from 'await-lock';

export const ALL_BINDS = [NodeLlamaCppV2];
const cachedBinds: { [key: string]: InstanceType<typeof BaseBindClass> } = {};

function getActiveModelDetails() {
    const modelDetails = AppDb.db.models[AppDb.db.activeModel!];

    if (!modelDetails)
        throw new Error('No active model');

    if (!modelDetails.settings.bind)
        throw new Error('No bind class');

    return modelDetails;
}

export function getCacheBindClass() {
    const modelDetails = getActiveModelDetails();

    const bind = modelDetails.settings.bind;

    if (cachedBinds[bind])
        return cachedBinds[bind];

    return null;
}

const bindLock = new (typeof AwaitLock === 'function' ? AwaitLock : AwaitLock.default);
export default async function createChat() {
    try {
        await bindLock.acquireAsync();

        const modelDetails = getActiveModelDetails();
        const cachedBindClass = getCacheBindClass();

        if (cachedBindClass)
            return cachedBindClass.createChat();

        const bind = modelDetails.settings.bind;

        const bindClass = ALL_BINDS.find(x => x.shortName === bind);
        if (!bindClass)
            throw new Error(`Bind class "${bind}" not found. Try to update the model/CatAI`);

        const bindClassInstance = cachedBinds[bind] ??= new bindClass(modelDetails);
        await bindClassInstance.initialize();
        return bindClassInstance.createChat();
    } finally {
        bindLock.release();
    }
}

