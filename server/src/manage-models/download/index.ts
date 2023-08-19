import FastDownload from './stream-progress/fast-download.js';
import CLIDownloadProgress from './cli-download-progress.js';
import {IStreamProgress} from './stream-progress/istream-progress.js';
import CopyProgress from './stream-progress/copy-progress.js';
import {fileURLToPath} from 'url';

export default async function downloadFileCLI(url: string, savePath: string, name: string) {
    let progressStream: IStreamProgress;

    if (url.startsWith('http')) {
        progressStream = new FastDownload(url, savePath);
    } else if (url.startsWith('file')) {
        progressStream = new CopyProgress(fileURLToPath(url), savePath);
    } else {
        throw new Error('Unknown download protocol');
    }

    await progressStream.init();


    const progress = new CLIDownloadProgress(progressStream, name);
    await progress.startDownload();
}
