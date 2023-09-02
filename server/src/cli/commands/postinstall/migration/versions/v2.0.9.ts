import AppDB from '../../../../../storage/app-db.js';

async function migration() {
    for (const [, value] of Object.entries(AppDB.db.models)) {
        value.settings ??= {} as any;
        value.settings.bind ??= (value as any).bindClass;
        value.defaultSettings.bind ??= (value as any).bindClass;
    }
    await AppDB.saveDB();
}

export default {
    version: '2.0.9',
    migration
};
