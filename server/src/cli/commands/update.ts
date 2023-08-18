import {Command} from 'commander';
import {$} from 'execa';
import ora from 'ora';

export const updateCommand = new Command('update');

updateCommand.description('Update server to the latest version')
    .action(async () => {
        const spinner = ora('Updating CatAI');
        spinner.start();

        await $`npm i -g catai@latest`;

        const newVersion = (await $`catai --version`).stdout.trim();
        spinner.succeed('CatAI updated: ' + newVersion);
    });
