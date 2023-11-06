import {Command} from 'commander';
import {DownloadLlamaCppCommand, BuildLlamaCppCommand} from 'node-llama-cpp/commands.js';
import {createRequire} from "module";
import fs from 'fs-extra';
import path from 'path';

const NODE_LLAMA_CPP_LOCATION = createRequire(import.meta.url).resolve('node-llama-cpp');
const BINARIES_GITHUB_RELEASE_JSON = path.resolve(`${NODE_LLAMA_CPP_LOCATION}/../../llama/binariesGithubRelease.json`);
const {release: DEFAULT_RELEASE} = await fs.readJson(BINARIES_GITHUB_RELEASE_JSON);

const METAL_ENABLED_BY_DEFAULT = process.platform === 'darwin';
const LLAMA_CPP_REPO = 'ggerganov/llama.cpp';
export const nodeLlamaCpp = new Command('node-llama-cpp');

nodeLlamaCpp.description('Node llama.cpp CLI - recompile node-llama-cpp binaries')
    .alias('cpp')
    .option('--repo <repo>', 'The GitHub repository to download a release of llama.cpp from')
    .option('--release <release>', 'The tag of the llama.cpp release to download. Set to "latest" to download the latest release')
    .option('--arch <arch>', 'The architecture to compile llama.cpp for')
    .option('--nodeTarget <nodeTarget>', 'The Node.js version to compile llama.cpp for. Example: v18.0.0')
    .option('--metal', 'Compile llama.cpp with Metal support. Enabled by default on macOS')
    .option('--cuda', 'Compile llama.cpp with CUDA support')
    .option('--no-download', 'Skip downloading llama.cpp and only build it');
nodeLlamaCpp.action(async ({repo = LLAMA_CPP_REPO, release = DEFAULT_RELEASE, arch, nodeTarget, cuda, metal = METAL_ENABLED_BY_DEFAULT, noDownload = false}) => {
    if (noDownload) {
        return await BuildLlamaCppCommand({
            cuda,
            metal,
            arch,
            nodeTarget
        });
    }

    await DownloadLlamaCppCommand({
        cuda,
        metal,
        repo,
        release,
        arch,
        nodeTarget,
        skipBuild: false
    });
});
