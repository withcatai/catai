import ModelCompatibilityChecker, {ModelInfo} from './model-compatibility-checker.js';
import AppDb from '../../storage/app-db.js';

async function getInstalledModels(): Promise<ModelInfo[]> {
    return Object.entries(AppDb.db.models).map(([model, modelSettings]) => {
        const {note, compatibility} = ModelCompatibilityChecker.checkModelCompatibility(modelSettings);

        return {
            model,
            modelInstalled: true,
            version: modelSettings?.version?.toString?.() || "?",
            compatibility,
            note
        }
    });
}

export async function getAllAvailableModels(onlyRemote?: boolean, onlyLocal?: boolean) {
    const models = [...await ModelCompatibilityChecker.listAllModels()];
    const installedModels = await getInstalledModels();

    for(const installedModel of installedModels) {
        const model = models.find(x => x.model === installedModel.model);
        if (model) continue;

        models.push(installedModel);
    }

    if(onlyRemote) return models.filter(x => !x.modelInstalled);
    if(onlyLocal) return models.filter(x => x.modelInstalled);

    return models;
}
