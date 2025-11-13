import AppDb, {ModelSettings} from '../../storage/app-db.js';
import fs from 'fs/promises';
import fsExtra from 'fs-extra';

export async function syncModels() {
    const deletedModels: Record<string, ModelSettings> = {};

    await Promise.all(Object.entries(AppDb.db.models).map(async ([model, modelSettings]) => {
        try {
            await Promise.all(Object.values(modelSettings.downloadedFiles).map(path => fs.stat(path)));
        } catch (error: any) {
            if ('code' in error && error.code !== 'ENOENT') return;

            deletedModels[model] = modelSettings;
            delete AppDb.db.models[model];

            await Promise.all(Object.values(modelSettings.downloadedFiles).map(path => fsExtra.remove(path)));
        }
    }));

    await AppDb.saveDB();

    return deletedModels;
}
