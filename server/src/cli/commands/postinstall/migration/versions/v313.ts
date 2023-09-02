import path from 'path';
import ENV_CONFIG from '../../../../../storage/config.js';
import fs from 'fs-extra';
import AppDb from '../../../../../storage/app-db.js';

const EXECUTABLE_DIR = path.join(ENV_CONFIG.CATAI_DIR!, 'executable');
const MIN_SIZE_BYTES = 10485760 * 2; // 20mb

export default async function migration() {
    const models = await fs.readdir(ENV_CONFIG.MODEL_DIR!);

    for (const model of models) {
        const modelPath = path.join(ENV_CONFIG.MODEL_DIR!, model);
        const stat = await fs.stat(modelPath);

        if (stat.size < MIN_SIZE_BYTES) continue;

        AppDb.db.models[model] = {
            downloadedFiles: {
                model: modelPath,
            },
            bindClass: 'node-llama',
            createDate: stat.birthtime.getTime(),
            compatibleCatAIVersionRange: ['0.3.0', '0.3.12'],
            version: 0,
            settings: {},
            defaultSettings: {},
        } as any;
    }

    await AppDb.saveDB();
    await fs.remove(EXECUTABLE_DIR);
}
