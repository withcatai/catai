import wretch from "wretch";

const DOWNLOAD_TEMPLATE = "https://huggingface.co/Pi3141/alpaca-{{number}}B-ggml/resolve/main/ggml-model-q4_0.bin";
const SEARCH_MODEL = "https://raw.githubusercontent.com/ido-pluto/catai/main/models-links.json";

const defaultModel = process.argv[3];
const defaultTag = process.argv[4];

export default class ModelURL {
    static modelRepoHead = /\/(main|master)\//;

    constructor(model = defaultModel, tag = defaultTag) {
        this.model = model;
        this.tag = tag;
    }

    async #modelURLByName(){
        this.modelsDownloadLinks = await wretch(SEARCH_MODEL).get().json();

        const modelName = this.model.toLocaleLowerCase();
        const foundModel = Object.keys(this.modelsDownloadLinks).find(x => x.toLocaleLowerCase() === modelName);

        return this.modelsDownloadLinks[foundModel];
    }

    async updateLink(){
        // download from direct link
        if (this.model.startsWith('http')) {
            const [url, hash] = this.model.split('#');

            this.hash = hash;
            this.downloadLink = url;
            this.model = url.split('/').pop();
        } else {
            // download from repo models
            this.downloadLink = await this.#modelURLByName();
        }
        this.tag ??= this.model
    }

    get templateLink(){
        return DOWNLOAD_TEMPLATE.replace("{{number}}", this.model);
    }

    get alterativeLink() {
        if(this.hash){
            return this.downloadLink.replace(ModelURL.modelRepoHead, `/${this.hash}/`);
        }
        return this.templateLink;
    }
}
