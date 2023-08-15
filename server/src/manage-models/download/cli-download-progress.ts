import prettyBytes from 'pretty-bytes';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import prettyMs from 'pretty-ms';
import FastDownload from './fast-download.js';

export default class CLIDownloadProgress {
    private static readonly AVERAGE_SPEED_LAST_SECONDS = 10;
    private _speeds: {[dateInSeconds: number]: number} = [];
    private _progressBar: cliProgress.SingleBar;
    private _lastDownloaded = 0;

    public constructor(private _downloader: FastDownload, private _name: string) {
        this._progressBar = new cliProgress.SingleBar({
            format: this.getProgressBarFormat(),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: false
        });
    }

    private static formatSpeed(speed: number): string {
        return prettyBytes(Math.min(speed, 9999999999) || 0, {maximumFractionDigits: 2, minimumFractionDigits: 2}) + '/s';
    }

    private calculateSpeed(currentDownloaded: number): number {
        const dateInSeconds = Math.floor(Date.now() / 1000);
        this._speeds[dateInSeconds] ??= 0;
        this._speeds[dateInSeconds] += currentDownloaded - this._lastDownloaded;
        this._lastDownloaded = currentDownloaded;

        let averageSecondsAverageSpeed = 0;
        for (let i = 0; i < CLIDownloadProgress.AVERAGE_SPEED_LAST_SECONDS; i++) {
            averageSecondsAverageSpeed += this._speeds[dateInSeconds - i] || 0;
        }

        for(const key in this._speeds) {
            if (parseInt(key) < dateInSeconds - CLIDownloadProgress.AVERAGE_SPEED_LAST_SECONDS) {
                delete this._speeds[key];
            }
        }

        return averageSecondsAverageSpeed / CLIDownloadProgress.AVERAGE_SPEED_LAST_SECONDS;
    }

    private handleProgress(downloaded: number, total: number) {
        this._progressBar.setTotal(total);

        const speed = this.calculateSpeed(downloaded);
        const timeLeft = (total - downloaded) / speed;
        const percentage = ((downloaded / total) * 100).toFixed(2);

        this._progressBar.update(downloaded, {
            speed: CLIDownloadProgress.formatSpeed(speed),
            percentage: percentage,
            timeLeft: prettyMs((timeLeft || 0) * 1000, {millisecondsDecimalDigits: 1, keepDecimalsOnWholeSeconds: true}),
            downloadBytes:  `${prettyBytes(downloaded, {maximumFractionDigits: 2, minimumFractionDigits: 2})}/${prettyBytes(total, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
        });

        if (percentage === "100") {
            this._progressBar.stop();
            console.log('\nConnecting downloaded chunks, please wait...');
        }
    }

    public async startDownload(): Promise<any> {
        this._progressBar.start(Infinity, 0, {
            speed: 'N/A',
            percentage: 0,
            timeLeft: 'N/A',
            downloadBytes: `0 bytes/0 bytes`
        });

        return await (this._downloader.downloader as any).download(this.handleProgress.bind(this));
    }

    private getProgressBarFormat(): string {
        return `Downloading ${this._name} | ${colors.cyan('{bar}')} | {percentage}% | {downloadBytes} | Speed: {speed} | Time: {timeLeft}`;
    }
}
