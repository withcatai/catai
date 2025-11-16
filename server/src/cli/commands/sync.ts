import {Command} from 'commander';
import ora from 'ora';
import {syncModels} from '../../manage-models/about-models/sync-models.js';

export const syncCommand = new Command('serve');

syncCommand.alias('sync')
    .description('Cleanup none exiting models from the local index')
    .action(async () => {
        const spinner = ora('Syncing models...').start();

        const deletedModels = await syncModels();

        spinner.stop();

        console.log(`${Object.keys(deletedModels).length} models deleted`);
    });
