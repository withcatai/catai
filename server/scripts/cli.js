#!/usr/bin/env node
import {$, cd, within} from 'zx';
import {program} from 'commander';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('./', import.meta.url));

function runCommand(callback) {
    return within(async () => {
        cd(path.join(__dirname, '..'));
        try {
            await callback();
        } catch (err) {
            console.error(err.message);
        }
    });
}

program.command('install')
    .description('Install one of the alpaca models')
    .argument('<model>', 'The model to install')
    .option('-t --tag [tag]', 'The name of the model in local directory')
    .action((model, {tag}) => {
        process.argv[3] = model;
        process.argv[4] = tag;
        import('./install.js');
    });

program.command('use')
    .description('Set model to use')
    .argument('<model>', 'The model to use - 7B / 13B / 30B')
    .action((model) => {
        runCommand(() => $`npm run use ${model}`);
    });

program.command('remove')
    .description('Remove model')
    .argument('value', 'Remove downloaded model, or "all" for all downloaded data')
    .action((value) => {
        runCommand(() => $`npm run remove ${value}`);
    });

program.command('list')
    .description('List all models')
    .action(() => {
        runCommand(() => $`npm run list`);
    });

program.command('serve')
    .description('Open the chat website')
    .action(() => {
        runCommand(() => $`npm start production`);
    });

program.command('config')
    .description('Change the server & model configuration')
    .option('--edit [editor]', 'Open the config file with the specified editor')
    .action(async ({edit}) => {
        const configFile = path.join(__dirname, '..', 'src', 'config.js');

        if (edit) {
            await $`${edit} "${configFile}"`;
            return;
        }

        console.log(`
To edit the config, open this file:
${configFile}
After you saved restart the server.

To open with code editor run:
catai config --edit [editor]`);
    });

program.parse();