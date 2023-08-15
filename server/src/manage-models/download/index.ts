import FastDownload from './fast-download.js';
import CLIDownloadProgress from './cli-download-progress.js';

export default async function downloadFileCLI(url: string, savePath: string, name: string) {
    const downloader = new FastDownload(url, savePath);
    await downloader.init();
    const progress = new CLIDownloadProgress(downloader, name);
    await progress.startDownload();
}
