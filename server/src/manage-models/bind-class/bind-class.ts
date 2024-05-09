import BaseBindClass, {CreateChatOptions} from './binds/base-bind-class.js';
import AppDb, {ModelSettings} from '../../storage/app-db.js';
import NodeLlamaCppV2 from './binds/node-llama-cpp/node-llama-cpp-v2/node-llama-cpp-v2.js';
import {withLock} from "lifecycle-utils";

export const ALL_BINDS = [NodeLlamaCppV2];
const cachedBinds: { [key: string]: InstanceType<typeof BaseBindClass> } = {};

export function findLocalModel(modelName?: string) {
    const modelDetails = AppDb.db.models[modelName || AppDb.db.activeModel!];

    if (!modelDetails)
        throw new Error('No active model');

    if (!modelDetails.settings.bind)
        throw new Error('No bind class');

    return modelDetails;
}

export function getCacheBindClass(modelDetails: ModelSettings<any> = findLocalModel()) {
    const bind = modelDetails.settings.bind;

    if (cachedBinds[bind])
        return cachedBinds[bind];

    return null;
}

const lockContext = {};
export default async function createChat(options?: CreateChatOptions) {
    return await withLock(lockContext, "createChat", async () => {
        const modelDetails = findLocalModel(options?.model);
        const cachedBindClass = getCacheBindClass(modelDetails);

        if (cachedBindClass)
            return await cachedBindClass.createChat(options);

        const bind = modelDetails.settings.bind;

        const bindClass = ALL_BINDS.find(x => x.shortName === bind);
        if (!bindClass)
            throw new Error(`Bind class "${bind}" not found. Try to update the model/CatAI`);

        const bindClassInstance = cachedBinds[bind] ??= new bindClass(modelDetails);
        await bindClassInstance.initialize();
        return await bindClassInstance.createChat(options);
    });
}

export function getModelPath(name: string) {
    return findLocalModel(name).downloadedFiles?.model;
}