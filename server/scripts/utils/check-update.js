import {fs, chalk} from 'zx';
import wretch from 'wretch';

import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const {version, name} = await fs.readJSON(path.join(__dirname, '..', '..', 'package.json'));

async function checkForUpdate(){
    const npmPackage = await wretch(`https://registry.npmjs.com/${name}`).get().json();
    const latestVersion = npmPackage['dist-tags'].latest;

    if(version !== latestVersion){
        console.log(`\n${chalk.green('New version available!')}, some models may not work in older versions`);
        console.log(`Current version: ${chalk.yellowBright(version)}, latest: ${chalk.greenBright(latestVersion)}`);
        console.log(`Run "${chalk.cyan(`catai update`)}" to update`);
    }
}

export async function tryUpdate(){
    try {
        await checkForUpdate();
    } catch (err) {
        console.log(chalk.yellowBright('Failed to check for updates: ' + err.message));
    }
}
