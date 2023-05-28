import 'zx/globals';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../src/model-settings.js';

const remove = process.argv[3];
const downloadedFiles = jsonModelSettings.metadata[remove]?.downloadedFiles ?? {};

delete jsonModelSettings.model;
delete jsonModelSettings.metadata[remove];
await saveModelSettings();

// remove all
if(remove === 'all'){
    await fs.remove(DOWNLOAD_LOCATION);
    console.log("All downloaded data deleted");
    process.exit(0);
}

// remove model
for(const file of Object.values(downloadedFiles)){
    await fs.remove(file);
}

console.log("Model deleted " + remove);
