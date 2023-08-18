import {$} from 'execa';
import {packageJSON} from '../../../../storage/config.js';


export async function runMigrations() {
    const {stdout: oldVersion} = await $`npm -g info catai version`;
    const fromVersion = Number(oldVersion.trim()[0] || '-');
    const toVersion = Number(packageJSON.version.trim()[0]);

    for (let i = fromVersion; i < toVersion; i++) {
        try {
            const migration = await import(`./versions/v${i}.js`);
            await migration.default();
        } catch {}
    }
}
