import {$} from 'execa';
import {packageJSON} from '../../../../storage/config.js';
import {calculateVersion} from '../../../../utils/check-for-update.js';


export async function runMigrations() {
    const {stdout: oldVersion} = await $`npm -g info catai version`;
    const fromVersion = calculateVersion(oldVersion.trim() || '-');
    const toVersion = calculateVersion(packageJSON.version.trim());

    for (let i = fromVersion; i < toVersion; i++) {
        try {
            const migration = await import(`./versions/v${i}.js`);
            await migration.default();
            console.log(`CatAI Migrated to v${i}`);
        } catch {}
    }
}
