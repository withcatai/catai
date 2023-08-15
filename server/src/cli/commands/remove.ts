import {Command} from 'commander';
import ENV_CONFIG from '../../storage/config.js';
import AppDb from '../../storage/app-db.js';

export const removeCommand = new Command('remove');

removeCommand.alias('rm')
    .description('Remove a model')
    .argument('[models...]', 'Models to delete')
    .option('-a --all', 'Remove all models')
    .action(async (models = [], {all}) => {
        if(all){
            await fs.remove(ENV_CONFIG.CATAI_DIR!);
            console.log('All models removed');
            return;
        }

        for(const model of models){
            for(const file of Object.values(AppDb.db.models[model].downloadedFiles)){
                await fs.remove(file);
            }
            delete AppDb.db.models[model];
            console.log(`Model ${model} removed`);
        }

        await AppDb.saveDB();
    });
