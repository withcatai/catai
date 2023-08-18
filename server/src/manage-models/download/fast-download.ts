import TurboDownloader from 'turbo-downloader';
import wretch from 'wretch';
import fs from 'fs-extra';


export default class FastDownload {
    public downloader?: typeof TurboDownloader;
    private _redirectedURL?: string;

    constructor(private _url: string, private _savePath: string) {
    }

    public async init() {
        await fs.ensureFile(this._savePath);
        this.downloader = new (TurboDownloader.default as any)({
            url: await this._getRedirectedURL(),
            destFile: this._savePath,
            chunkSize: 50 * 1024 * 1024, // Size of chunk (default 16MB)
            concurrency: 8,
            canBeResumed: true,
        });
    }

    private async _getRedirectedURL() {
        const {url} = await wretch(this._url).head()
            .notFound(() => {
                throw new Error(`Model URL is broken, try to install directly from URL: catai install https://...`);
            })
            .res()
            .catch(error => {
                throw new Error(`Error while getting file head: ${error.status}`);
            });
        return this._redirectedURL = url;
    }
}
