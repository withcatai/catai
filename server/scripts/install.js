import Downloader from 'nodejs-file-downloader';
import term from 'terminal-kit';
import {$, cd, fs} from 'zx';
import {fileURLToPath} from 'url';
import path from 'path';

const {terminal} = term;

const DOWNLOAD_TEMPLATE = "https://huggingface.co/Pi3141/alpaca-{{number}}B-ggml/resolve/main/ggml-model-q4_0.bin";
const DOWNLOAD_LINKS = {
    "7B": "https://huggingface.co/Pi3141/alpaca-7B-ggml/resolve/main/ggml-model-q4_0.bin",
    "13B": "https://huggingface.co/Pi3141/alpaca-13B-ggml/resolve/main/ggml-model-q4_0.bin",
    "30B": "https://huggingface.co/Pi3141/alpaca-30B-ggml/resolve/main/ggml-model-q4_0.bin"
};

const model = process.argv[3];

const __dirname = fileURLToPath(new URL('./', import.meta.url));
cd(path.join(__dirname, ".."));
await fs.ensureDir('models');

let downloadLink = DOWNLOAD_LINKS[model];
if (!downloadLink) {
    console.warn("Model unknown, we will download with template URL. You can also try one of thous:" + Object.keys(DOWNLOAD_LINKS).join(", "));
    downloadLink = DOWNLOAD_TEMPLATE.replace("{{number}}", model);
}

const progressBar = terminal.progressBar({
    width: 80,
    title: `Downloading ${model}`,
    eta: true,
    percent: true,
    items: true
});

const downloadDir = path.join(process.cwd(), "models");
const downloader = new Downloader({
    url: downloadLink,
    directory: downloadDir,
    fileName: model,
    onProgress: function (percentage, chunk, remainingSize) {
        progressBar.update(percentage / 100);
    },
});

try {
    await downloader.download();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}

console.log("Download complete");
await $`npm run use ${model}`;
