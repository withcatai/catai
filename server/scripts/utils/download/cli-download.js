import CLIDownloadProgress from "./download-progress.js";
import FileDownloader from "./file-downloader.js";

export async function downloadFileCLI(downloadLink, downloadFile, CLITag){
    const downloader = new FileDownloader(downloadLink, downloadFile);
    await downloader.prepare();

    const progressBar = new CLIDownloadProgress(downloader.dlDownloader, CLITag);
    await progressBar.startDownload();
}