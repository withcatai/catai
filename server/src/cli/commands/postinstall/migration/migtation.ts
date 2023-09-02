import {packageJSON} from '../../../../storage/config.js';
import semver from 'semver';

import v0313 from './versions/v0.3.13.js';
import v209 from './versions/v2.0.9.js';
import appDb from '../../../../storage/app-db.js';

const MIGRATIONS = [v0313, v209];

export async function runMigrations() {
    const fromVersion = appDb.db.installedCatAIVersion || '0.0.0';
    const toVersion = packageJSON.version;

    for (const migration of MIGRATIONS) {
        if (semver.lte(toVersion, migration.version)) continue;

        if (semver.gte(migration.version, fromVersion)) {
            console.log(`CatAI Migrated to v${migration.version}`);
            await migration.migration();
        }
    }
}
