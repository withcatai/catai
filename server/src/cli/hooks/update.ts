import {Command} from 'commander';
import {tryCheckForUpdate} from '../../utils/check-for-update.js';

const POST_ACTION_UPDATE = ['install', 'models'];
export const updateHook: Parameters<Command['hook']> = [
    'postAction',
    async (thisCommand, actionCommand) => {
        if (POST_ACTION_UPDATE.includes(actionCommand.name()))
            await tryCheckForUpdate();
    }
];
