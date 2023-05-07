import {createRequire} from 'module';

export function easyDlWithoutMaxListenersExceededWarning() {
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

const EasyDL = easyDlWithoutMaxListenersExceededWarning();

export function easyDlHandleBadConnection(link, savePath, settings) {
    const dlDownloader = new EasyDL(link, savePath, settings);

    dlDownloader.on('error', error => {
        if (error.code === "ECONNRESET") {
            return;
        }

        throw error;
    });

    const wait = dlDownloader.wait.bind(dlDownloader);
    dlDownloader.wait = () => new Promise(async res => {
        dlDownloader.once('close', res);
        try {
            await wait();
        } catch {}
    });

    return dlDownloader;
}