import {IStreamProgress} from 'ipull';
import fs from 'fs-extra';
import progress from 'progress-stream';
import MultiStream from 'multistream';

export default class ConnectChunksProgress implements IStreamProgress {
    private static _UPDATE_TIME_MS = 100;
    private _progress?: ReturnType<typeof progress>;

    /**
     * Connects chunks into one file, removes chunks after that and reports progress
     */
    public constructor(private _files: string[], private _toFile: string) {
    }

    public async init(): Promise<void> {
        let totalSize = 0;

        for (const file of this._files) {
            const stat = await fs.stat(file);
            totalSize += stat.size;
        }

        this._progress = progress({
            length: totalSize,
            time: ConnectChunksProgress._UPDATE_TIME_MS
        });
    }

    public async progress(callback: (progressBytes: number, totalBytes: number) => void): Promise<any> {
        this._progress!.on('progress', (progress: { transferred: number, length: number }) => {
            callback(progress.transferred, progress.length);
        });

        await fs.remove(this._toFile);

        const toFileSteam = fs.createWriteStream(this._toFile);
        const stream = new MultiStream(
            this._files.map(fromPath => fs.createReadStream(fromPath))
        );

        stream.pipe(this._progress!).pipe(toFileSteam);

        return new Promise((resolve, reject) => {
            stream.once('finish', () => {
                this._files.forEach(fs.remove);
                resolve(null);
            });
            stream.once('error', reject);
        });
    }
}
