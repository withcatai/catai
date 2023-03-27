import 'zx/globals';
import Downloader from 'nodejs-file-downloader';
import wretch from 'wretch';
import extract from 'extract-zip';
import {jsonModelSettings, saveModelSettings} from '../src/model-settings.js';

const ALPACA_RELEASES = "https://api.github.com/repos/antimatter15/alpaca.cpp/releases/latest";
const {assets} = await wretch(ALPACA_RELEASES).get().json();

let platform = process.platform;

if (platform.startsWith("win")) {
    platform = "win";
} else if (platform === "darwin") {
    platform = "mac";
} else {
    platform = "linux";
}

const downloadURL = assets.find(x => x.name.includes(platform)).browser_download_url;

const downloadDir = path.join(__dirname, '..', "models", "executable");
await fs.ensureDir(downloadDir);

const downloader = new Downloader({
    url: downloadURL,
    directory: downloadDir
});

const {filePath} = await downloader.download();
await extract(filePath, {dir: downloadDir});
await fs.remove(filePath);

const files = await fs.readdir(downloadDir, {withFileTypes: true});
const executable = files.find(x => x.isFile());

jsonModelSettings.exec = path.join(downloadDir, executable.name);
await saveModelSettings();

console.log('Download complete');