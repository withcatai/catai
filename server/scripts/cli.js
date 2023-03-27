#!/usr/bin/env node
import {$, cd, within} from 'zx';
import {program} from 'commander';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('./', import.meta.url));

function runCommand(callback) {
    return within(async () => {
        cd(path.join(__dirname, '..'));
        await callback();
    });
}

program.command('install')
    .description('Install one of the alpaca models')
    .argument('<model>', 'The model to install')
    .action(async (model) => {
        process.argv[3] = model;
        import('./install.js');
    });

program.command('use')
    .description('Set model to use')
    .argument('<model>', 'The model to use - 7B / 13B / 30B')
    .action(async (version) => {
        runCommand(() => $`npm run use ${version}`);
    });

program.command('serve')
    .description('Open the chat website')
    .action(async () => {
        runCommand(() => $`npm start`);
    });

program.parse();