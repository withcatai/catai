import fs from 'fs-extra';
import progress from 'progress-stream';
import {IStreamProgress} from './istream-progress.js';

const UPDATE_TIME_MS = 100;

export default class CopyProgress implements IStreamProgress {
    private _progress?: ReturnType<typeof progress>;

    constructor(private _fromPath: string, private _toPath: string) {
    }

    public async init() {
        const stat = await fs.stat(this._fromPath);

        this._progress = progress({
            length: stat.size,
            time: UPDATE_TIME_MS
        });
    }

    public progress(callback: (progressBytes: number, totalBytes: number) => void) {
        return new Promise((resolve, reject) => {
            this._progress!.on('progress', (progress: { transferred: number, length: number }) => {
                callback(progress.transferred, progress.length);
            });
            const stream = fs.createReadStream(this._fromPath)
                .pipe(this._progress!)
                .pipe(fs.createWriteStream(this._toPath));
            stream.once('finish', resolve);
            stream.once('error', reject);
        });
    }
}
