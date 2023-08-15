import {Command} from 'commander';
import {$, spinner} from 'zx';

export const updateCommand = new Command('update');

updateCommand.description('Update server to the latest version')
    .action(async () => {
        await spinner('Updating CatAI', () => $`npm i -g catai@latest`);
        await $`catai --version`;
    });
