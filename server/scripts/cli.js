#!/usr/bin/env node
import { $, cd, within, fs } from 'zx';
import { program } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { tryUpdate } from './utils/check-update.js';
import selectModelInstall from './utils/select-install.js';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const { version } = await fs.readJSON(path.join(__dirname, '..', 'package.json'));
program.version(version);

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

program.command('models')
    .description('List all available models')
    .action(async () => {
        await import('./models.js');
        await tryUpdate();
    });

program.command('install')
    .description('Install any ggml llama model')
    .argument('[model]', 'The model to install')
    .option('-t --tag [tag]', 'The name of the model in local directory')
    .action(async (model, { tag }) => {
        model ??= await selectModelInstall();

        process.argv[3] = model;
        process.argv[4] = tag;

        await runCommand(() => import('./install.js'));
        await tryUpdate();
    });

program.command('use')
    .description('Set model to use')
    .argument('<model>', 'The model to use - 7B / 13B / 30B')
    .action((model) => {
        runCommand(() => $`npm run use ${model}`);
    });

program.command('bind')
    .description('Set chat bind method to models')
    .argument('[bind]', 'The bind method to use - node-llama / bing-chat')
    .option('-l --list', 'List all available bind methods')
    .option('-k --key [key]', 'Key/Cookie that the binding requires')

    .action((bind, {list, key}) => {
        runCommand(() => $`npm run bind -- --list ${Boolean(list)} --bind ${bind} --key ${key}`);
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
    .option('--ui [ui]', 'The ui to use')
    .action(({ ui }) => {
        runCommand(() => $`npm start -- --production true --ui ${ui || 'catai'}`);
    });

program.command('config')
    .description('Change the server & model configuration')
    .option('--edit [editor]', 'Open the config file with the specified editor')
    .action(async ({ edit }) => {
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


program.command('update')
    .description('Update catai to the latest version')
    .action(async () => {
        await spinner('Updating CatAI', () => $`npm i -g catai@latest`);
        await $`catai --version`;
    });

program.command('uninstall')
    .description('Uninstall catai and all models')
    .action(async () => {
        await spinner('Uninstalling CatAI', async () => {
            await runCommand(() => $`npm run remove all`);
            await $`npm r -g catai`;
        });
    });

program.parse();