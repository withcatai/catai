import path from 'path';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../../../src/model-settings.js';
import fs from 'fs-extra';

const DOWNLOAD_DIR = path.join(DOWNLOAD_LOCATION, "models");
const EXECUTABLE_DIR = path.join(DOWNLOAD_LOCATION, "executable");

const MIN_SIZE_BYTES = 10485760 * 2; // 20mb
export default async function migrationV0(){
    const models = await fs.readdir(DOWNLOAD_DIR);

    for(const model of models){
        const modelPath = path.join(DOWNLOAD_DIR, model);
        const stat = await fs.stat(modelPath);

        if(stat.size < MIN_SIZE_BYTES) continue;

        jsonModelSettings.metadata[model] = {
            downloadedFiles: {
                model: modelPath,
            },
            bind: 'node-llama-cpp',
            birthtime: stat.birthtime.toLocaleDateString()
        };
    }

    jsonModelSettings.model = jsonModelSettings.model.split(/\/|\\/).pop();
    delete jsonModelSettings.exec;
    await fs.remove(EXECUTABLE_DIR);
    await saveModelSettings();
}