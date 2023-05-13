import prompts from 'prompts';
import { listAllModels } from "./model-compatibility.js";

export default async function selectModelInstall() {
    const aboutModels = await listAllModels();

    const response = await prompts({
        type: 'select',
        name: 'model',
        message: 'Select a model to install',
        choices: aboutModels.sort((last, current) => last.modelInstalled - current.modelInstalled).map(({model, compatibility, note, modelInstalled}) => ({
            title: model, 
            description: `${compatibility ? '': 'Not Compatible | '}${note}`, 
            value: model,
            disabled: modelInstalled,
        })),
        warn: 'Already installed'
    })

    return response.model;
}  