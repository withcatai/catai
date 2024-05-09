import {Command, Option} from 'commander';
import {BuildLlamaCppCommand, DownloadLlamaCppCommand} from 'node-llama-cpp/commands.js';

export const nodeLlamaCpp = new Command('node-llama-cpp');

nodeLlamaCpp.description('Node llama.cpp CLI - recompile node-llama-cpp binaries')
    .alias('cpp')
    .option('--repo <repo>', 'The GitHub repository to download a release of llama.cpp from')
    .option('--release <release>', 'The tag of the llama.cpp release to download. Set to "latest" to download the latest release')
    .option('--arch <arch>', 'The architecture to compile llama.cpp for')
    .option('--nodeTarget <nodeTarget>', 'The Node.js version to compile llama.cpp for. Example: v18.0.0')
    .addOption(new Option('--gpu <gpu>', 'The GPU to compile llama.cpp with').choices(["metal", "cuda", "vulkan", "auto"]))
    .option('--no-download', 'Skip downloading llama.cpp and only build it')
    .action(async ({repo, release, arch, nodeTarget, gpu, noDownload = false}) => {
        if (noDownload) {
            return await BuildLlamaCppCommand({
                gpu,
                arch,
                nodeTarget
            });
        }

        await DownloadLlamaCppCommand({
            gpu,
            repo,
            release,
            arch,
            nodeTarget,
            skipBuild: false
        });
    });
