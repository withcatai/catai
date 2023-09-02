import AppDB from '../../../../../storage/app-db.js';

export default async function migration() {
    for(const [,value] of Object.entries(AppDB.db.models)){
        value.settings ??= {} as any;
        value.settings.bind ??= (value as any).bindClass;
        value.defaultSettings.bind ??= (value as any).bindClass;
    }
    await AppDB.saveDB();
}
