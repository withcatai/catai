import wretch from 'wretch';
import {easyDlHandleBadConnection} from './easydl-smart.js';

export default class FileDownloader {
    static defaultSettings = { connections: 8, maxRetry: 5, existBehavior: 'overwrite' };
    #downloadLink;
    #withRedirect;

    constructor(downloadLink, savePath, settings = FileDownloader.defaultSettings) {
        this.#downloadLink = downloadLink;
        this.savePath = savePath;
        this.settings = settings;
    }

    async #getHead() {
        const { url } = await wretch(this.#downloadLink).head()
            .notFound(() => {
                throw new Error(`Model URL is broken, try to install directly from URL: catai install https://...`);
            })
            .res()
            .catch(error => {
                throw new Error(`Error while getting file head: ${error.status}`);
            });

        this.#withRedirect = url;
    }

    #createDownloader() {
        this.dlDownloader = easyDlHandleBadConnection(this.#withRedirect,
            this.savePath,
            this.settings
        );
    }

    async prepare() {
        await this.#getHead();
        this.#createDownloader();
    }
}