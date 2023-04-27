import prettyBytes from 'pretty-bytes';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import prettyMs from 'pretty-ms';

export default class CLIDownloadProgress {
    #speeds = [];
    constructor(downloader, name) {
        this.downloader = downloader;
        this.progressBar = new cliProgress.SingleBar({
            format: `Downloading ${name} | ${colors.cyan('{bar}')} | {percentage}% | {value}/{total} chunks | Speed: {speed} | Time: {timeLeft}`,
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: false
        });

        this.#initEvents();
    }

    #initEvents(){
        this.downloader.on('progress', this.#progress.bind(this));
    }

    static #prettySpeed(speed){
        return prettyBytes(Math.min(speed, 9999999999) || 0) + '/s';
    }

    #averageSpeed(currentSpeed){
        if(currentSpeed < Infinity){
            this.#speeds.push(currentSpeed);
        }

        this.#speeds = this.#speeds.slice(-40);
        return this.#speeds.reduce((a, b) => a + b, 0) / this.#speeds.length;
    }

    #progress({details, total}){
        this.progressBar.setTotal(details.length);

        const speed = this.#averageSpeed(total.speed);
        const timeLeft = (this.downloader.size - total.bytes) / speed;
        const chunks = details.filter(x => x.percentage === 100).length;

        this.progressBar.update(chunks, {
            speed: CLIDownloadProgress.#prettySpeed(speed),
            percentage: total.percentage,
            timeLeft: prettyMs((timeLeft || 0) * 1000)
        });

        if(total.percentage === 100){
            this.progressBar.stop();
            console.log('\nConnecting downloaded chunks, please wait...');
        }
    }

    async startDownload(){
        this.progressBar.start(Infinity, 0, {
            speed: 'N/A',
            percentage: 0,
            timeLeft: 'N/A'
        });

        const response = await this.downloader.wait();

        return response;
    }
}