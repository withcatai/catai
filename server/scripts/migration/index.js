import {$} from 'execa';
import {fileURLToPath} from 'url';
import {fs} from 'zx';
import path from 'path';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const { version: newVersion } = await fs.readJSON(path.join(__dirname, '..', '..', 'package.json'));

const {stdout: version} = await $`npm -g info catai version`;
const fromVersion = Number(version.trim()[0]);
const toVersion = Number(newVersion.trim()[0]);

async function runMigrations(fromVersion, toVersion){
    for(let i = fromVersion; i < toVersion; i++){
        const migration = await import(`./versions/v${i}.js`);
        await migration.default();
    }
}

async function main() {
    await runMigrations(fromVersion, toVersion);
} main();
