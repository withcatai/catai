import {Command} from 'commander';
import {getAllAvailableModels} from '../../manage-models/about-models/avaliable-models.js';
import CLITable from 'cli-table3';

export const listModelsCommand = new Command('models');

listModelsCommand.description('List all available models')
    .alias('ls')
    .option('-r --remote', 'Show only remote models')
    .option('-l --local', 'Show only local models')
    .action(async ({remote, local}) => {
        const modelTable = new CLITable({
            head: ['Models', 'Installed', 'Version', 'Compatibility', 'Note']
        });

        const models = await getAllAvailableModels(remote, local);
        modelTable.push(...models.map(model =>
            [model.model, model.modelInstalled ? 'Yes' : 'No', model.version, model.compatibility, model.note]
        ));

        console.log(modelTable.toString());
    });

