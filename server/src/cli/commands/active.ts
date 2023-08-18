import {Command} from 'commander';
import AppDb from '../../storage/app-db.js';

export const activeCommand = new Command('active');

activeCommand.description('Show active model')
    .action(() => {
        console.log('Active model:', AppDb.db.activeModel);
    });
