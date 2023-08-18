import {Command} from 'commander';
import {runMigrations} from './migration/migtation.js';

export const postinstallCommand = new Command('postinstall');

postinstallCommand.description('Migrate script')
    .action(async () => {
        await runMigrations();
    });
