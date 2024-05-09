import {findLocalModel, getCacheBindClass} from '../../../manage-models/bind-class/bind-class.js';
import AppDb from '../../../storage/app-db.js';

export function getActiveModelSettings(){
    return getCacheBindClass()?.modelSettings.settings || AppDb.db.models[AppDb.db.activeModel!]?.settings;
}

export async function updateActiveModelSettings(update: any){
    const modelSettings = getCacheBindClass()?.modelSettings;
    const dbModel = AppDb.db.models[AppDb.db.activeModel!];

    if(!dbModel){
        throw new Error("Settings not found");
    }

    if(modelSettings){
        modelSettings.settings = update;
    }

    dbModel.settings = update;
    await AppDb.saveDB();
}
