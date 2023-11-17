import {Command} from 'commander';
import {DownloadLlamaCppCommand, BuildLlamaCppCommand} from 'node-llama-cpp/commands.js';

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
nodeLlamaCpp.action(async ({repo, release, arch, nodeTarget, cuda, metal, noDownload = false}) => {
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
