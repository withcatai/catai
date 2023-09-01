import {Command} from 'commander';
import ModelCompatibilityChecker from '../../manage-models/about-models/model-compatibility-checker.js';
import prompts from 'prompts';
import AppDb from '../../storage/app-db.js';
import FetchModels from '../../manage-models/about-models/fetch-models/fetch-models.js';

export const installCommand = new Command('install');

installCommand.description('Install any GGML/GGUF model')
    .alias('i')
    .argument('[models...]', 'Model name/url/path')
    .option('-t --tag [tag]', 'The name of the model in local directory')
    .option('-l --latest', 'Install the latest version of a model (may be unstable)')
    .option('-b --bind [bind]', 'The model binding method')
    .option('-bk --bind-key [key]', 'key/cookie that the binding requires')
    .action(async (models = [], {latest, bind, key, tag}) => {
        if(!models.length) {
            models.push(await selectModelInstall());
        }

        let installer: FetchModels;
        for(const model of models) {
            installer = new FetchModels({
                download: model,
                tag,
                latest,
                settings: {
                    bindClass: bind,
                    apiKey: key,
                }
            });
            await installer.startDownload();
        }

        AppDb.db.activeModel = installer!.options.tag;
        await AppDb.saveDB();

        console.log();
        console.log(`Model ${AppDb.db.activeModel} set to use`);
        console.log('Run `catai up` to start the server');
        process.exit(0);
    });


async function selectModelInstall() {
    const aboutModels = await ModelCompatibilityChecker.listAllModels();

    const response = await prompts({
        type: 'select',
        name: 'model',
        message: 'Select a model to install',
        choices: aboutModels.sort((last, current) => Number(last.modelInstalled) - Number(current.modelInstalled)).map(({model, compatibility, note, modelInstalled}) => ({
            title: model,
            description: `${compatibility ? '': 'Not Compatible | '}${note}`,
            value: model,
            disabled: modelInstalled,
        })),
        warn: 'Already installed'
    });

    return response.model;
}
