import 'zx/globals';
import {jsonModelSettings, saveModelSettings} from '../src/model-settings.js';

const use = process.argv[3];
if (!jsonModelSettings.metadata[use]) {
    console.error(`Model not found, use "catai install"`);
    process.exit(1);
}

jsonModelSettings.model = use;
await saveModelSettings();
console.log("Model set to " + use);
