import 'zx/globals';
import wretch from 'wretch';
import extract from 'extract-zip';
import {DOWNLOAD_LOCATION, jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import FileDownloader from './utils/file-downloader.js';

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

const downloadDir = path.join(DOWNLOAD_LOCATION, "executable");
const filePath = path.join(downloadDir, "alpaca.zip");
await fs.ensureDir(downloadDir);

// download file
const downloader = new FileDownloader(downloadURL, filePath);
await downloader.prepare();
await downloader.dlDownloader.wait();

// extract file
await extract(filePath, {dir: downloadDir});
await fs.remove(filePath);

const files = await fs.readdir(downloadDir, {withFileTypes: true});
const executable = files.find(x => x.isFile());

// update model settings
jsonModelSettings.exec = path.join("executable", executable.name);
await saveModelSettings();

console.log('Download complete');