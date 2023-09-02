import wretch from 'wretch';
import {packageJSON} from '../storage/config.js';
import chalk from 'chalk';
import semver from 'semver';

async function checkForUpdate() {
    const npmPackage: any = await wretch(`https://registry.npmjs.com/${packageJSON.name}`).get().json();
    const latestVersion = npmPackage['dist-tags'].latest;

    if (semver.gte(packageJSON.version, latestVersion))
        return;

    console.log(`\n${chalk.green('New version available!')}, some models may not work in older versions`);
    console.log(`Current version: ${chalk.yellowBright(packageJSON.version)}, latest: ${chalk.greenBright(latestVersion)}`);
    console.log(`Run "${chalk.cyan(`catai update`)}" to update`);
}

export async function tryCheckForUpdate() {
    try {
        await checkForUpdate();
    } catch (err: any) {
        console.log(chalk.yellowBright('Failed to check for updates: ' + err.message));
    }
}
