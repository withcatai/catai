import {Command} from 'commander';
import AppDb from '../../storage/app-db.js';
import prompts from 'prompts';

export const useCommand = new Command('use');

useCommand.description('Set model to use')
    .argument('[model]', 'Model name')
    .action(async (model) => {
        model ??= await selectModelToUse();

        if (!AppDb.db.models[model]) {
            console.error(`Model ${model} not found`);
            return;
        }

        AppDb.db.activeModel = model;
        console.log(`Model ${model} set to use`);
        await AppDb.saveDB();
    });

async function selectModelToUse() {
    const response = await prompts({
        type: 'select',
        name: 'model',
        message: 'Select a model to use',
        choices: Object.entries(AppDb.db.models).map(([model, {createDate, version}]) => ({
            title: model,
            description: `version: ${version} | created: ${new Date(createDate).toLocaleString()}`,
            value: model,
        })).filter(x => x.value != AppDb.db.activeModel),
    });

    return response.model;
}
