import 'zx/globals';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import path from 'path';

const use = process.argv[3];
const modelDir = path.join(DOWNLOAD_LOCATION, "models");


const selectedModel = path.join(modelDir, use);
if (!await fs.pathExists(selectedModel)) {
    console.error("Model not found, install the model: catai install [MODEL]");
    process.exit(1);
}

jsonModelSettings.model = path.join('models', use);
await saveModelSettings();
console.log("Model set to " + use);
