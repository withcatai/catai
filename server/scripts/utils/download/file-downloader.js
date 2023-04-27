import wretch from 'wretch';
import EasyDl from 'easydl';
import { createRequire } from 'module';

function easyDlWithoutMaxListenersExceededWarning() {
    const require = createRequire(import.meta.url);
    const fs = require('fs');
    const createWriteStream = fs.createWriteStream.bind(fs);
    fs.createWriteStream = (...args) => {
        const stream = createWriteStream(...args);
        stream.setMaxListeners(Infinity);
        return stream;
    };

    return require('easydl');
}

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
            .fetchError(error => {
                throw new Error(`Error while getting file head: ${error.status}`);
            })
            .res();

        this.#withRedirect = url;
    }

    #createDownloader() {
        this.dlDownloader = new (easyDlWithoutMaxListenersExceededWarning())(this.#withRedirect,
            this.savePath,
            this.settings
        );
        this.dlDownloader.setMaxListeners(Infinity);
    }

    async prepare() {
        await this.#getHead();
        this.#createDownloader();
    }
}