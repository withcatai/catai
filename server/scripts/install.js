import {$, fs} from 'zx';
import path from 'path';
import wretch from 'wretch';
import {DOWNLOAD_LOCATION} from '../src/model-settings.js';
import FileDownloader from './utils/file-downloader.js';
import CLIDownloadProgress from './utils/download-progress.js';

const DOWNLOAD_TEMPLATE = "https://huggingface.co/Pi3141/alpaca-{{number}}B-ggml/resolve/main/ggml-model-q4_0.bin";
const SEARCH_MODEL = "https://raw.githubusercontent.com/ido-pluto/catai/main/models-links.json";
let modelsDownloadLinks;

let model = process.argv[3];
let tag = process.argv[4] ?? model;
let downloadLink;

// download from direct link
if (model.startsWith('http')) {
    downloadLink = model;
    model = model.split('/').pop();
} else {
    // download from repo models
    modelsDownloadLinks = await wretch(SEARCH_MODEL).get().json();
    downloadLink = modelsDownloadLinks[model] ?? modelsDownloadLinks[model.toUpperCase()];
}

// if model not found, try to download with template
if (!downloadLink) {
    console.warn("Model unknown, we will download with template URL. You can also try one of thous:" + Object.keys(modelsDownloadLinks).join(", "));
    downloadLink = DOWNLOAD_TEMPLATE.replace("{{number}}", model);
}

const downloadDir = path.join(DOWNLOAD_LOCATION, "models");
await fs.ensureDir(downloadDir);

const downloadFile = path.join(downloadDir, tag);

try {
    const downloader = new FileDownloader(downloadLink, downloadFile);
    await downloader.prepare();

    const progressBar = new CLIDownloadProgress(downloader.dlDownloader, tag);
    await progressBar.startDownload();

} catch (err) {
    console.error(err.message);
    process.exit(1);
}

console.log("Download complete");
await $`npm run use ${tag}`;
