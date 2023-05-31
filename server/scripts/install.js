import path from 'path';
import { $, fs } from 'zx';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import ModelURL from './utils/model-url.js';
import yn from 'yn';

const modelURL = new ModelURL();

await modelURL.updateLink();

if (!modelURL.remoteExits) {
    console.warn(`Model unknown, use "catai install" to select model to install`);
    process.exit(1);

} else if(!modelURL.downloadMap){ // if model dos not include download link, only set metadata
    await completeDownloadSettings();
    process.exit(0);

} else if(!yn(process.argv.latest)){
    modelURL.useExactDownloadLinks();
}

const downloadDir = path.join(DOWNLOAD_LOCATION, "models");
await fs.ensureDir(downloadDir);
const downloadFile = path.join(downloadDir, modelURL.tag);

await modelURL.createDownload(downloadFile);
await completeDownloadSettings();

async function completeDownloadSettings(){
    console.log("Download complete");
    jsonModelSettings.metadata[modelURL.tag] = modelURL.modelSettings;
    await saveModelSettings();

    await $`npm run use ${modelURL.tag}`;
}