import 'zx/globals';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import path from 'path';

const remove = process.argv[3];

jsonModelSettings.model = null;
await saveModelSettings();

// remove all
if(remove === 'all'){
    await fs.remove(DOWNLOAD_LOCATION);
    console.log("All downloaded data deleted");
    process.exit(0);
}

// remove model
const modelDir = path.join(DOWNLOAD_LOCATION, "models");

const selectedModel = path.join(modelDir, remove);
await fs.remove(selectedModel);

console.log("Model deleted " + remove);
