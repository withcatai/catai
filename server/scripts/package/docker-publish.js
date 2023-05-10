import 'zx/globals';
import ModelURL from '../utils/model-url.js';

const MODELS = Object.keys(await ModelURL.fetchModels());
const ARCHITECTURES = ["amd64", "arm64"];

let {stdout: version} = await $`npm show catai version`;
version = version.trim();

for(const MODEL_NAME of MODELS) {
    for (const ARCHITECTURE of ARCHITECTURES) {
        const tag = `${version}-${MODEL_NAME}`;
        await $`docker build ./scripts/package --tag npmcatai/catai:${tag} --build-arg MODEL_NAME=${MODEL_NAME} --build-arg ARCHITECTURE=${ARCHITECTURE} --build-arg VERSION=${version}`;
        await $`docker push npmcatai/catai:${tag}`
    }
}