import appDB from '../../../storage/app-db.js';
import {packageJSON} from '../../../storage/config.js';

export default async function updateCatAIVersionInSettings() {
    appDB.db.installedCatAIVersion = packageJSON.version;
    await appDB.saveDB();
}
