import 'zx/globals';
import ModelURL from '../utils/model-url.js';

const MODELS = ["Wizard-Vicuna-7B"] || Object.keys(await ModelURL.fetchModels());
const ARCHITECTURES = ["linux/amd64"];

let {stdout: version} = await $`npm show catai version`;
version = version.trim();

for (const ARCHITECTURE of ARCHITECTURES) {
    for (const MODEL_NAME of MODELS) {
        const tag = `${version}-${MODEL_NAME}`;
        await $`docker build ./scripts/package --platform ${ARCHITECTURE} --tag npmcatai/catai:${tag} --build-arg MODEL_NAME=${MODEL_NAME} --build-arg VERSION=${version}`;
        await $`docker push npmcatai/catai:${tag}`;
    }
}