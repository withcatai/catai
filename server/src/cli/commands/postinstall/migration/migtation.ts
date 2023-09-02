import {$} from 'execa';
import {packageJSON} from '../../../../storage/config.js';
import semver from 'semver';

import v0313 from './versions/v0.3.13.js';
import v209 from './versions/v2.0.9.js';

const MIGRATIONS = [v0313, v209];

export async function runMigrations() {
    const {stdout: oldVersion} = await $`npm -g info catai version`;

    const fromVersion = oldVersion.trim();
    const toVersion = packageJSON.version.trim();

    if (!fromVersion) return;

    for (const migration of MIGRATIONS) {
        if (semver.lte(toVersion, migration.version)) continue;

        if (semver.gte(migration.version, fromVersion)) {
            console.log(`CatAI Migrated to v${migration.version}`);
            await migration.migration();
        }
    }
}
