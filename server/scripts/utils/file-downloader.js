import wretch from 'wretch';
import EasyDl from 'easydl';


export default class FileDownloader {
    static defaultSettings = {connections: 8, maxRetry: 5, existBehavior: 'overwrite'};
    #downloadLink;
    #withRedirect;

    constructor(downloadLink, savePath, settings = FileDownloader.defaultSettings) {
        this.#downloadLink = downloadLink;
        this.savePath = savePath;
        this.settings = settings;
    }

    async #getHead() {
        const {url, ok, status} = await wretch(this.#downloadLink).head().res();
        if (!ok) throw new Error(`Error ${status} while getting file head`);

        this.#withRedirect = url;
    }

    #createDownloader() {
         this.dlDownloader = new EasyDl(this.#withRedirect,
            this.savePath,
             this.settings
        );
    }

    async prepare() {
        await this.#getHead();
        this.#createDownloader();
    }
}