import {Command} from 'commander';
import ENV_CONFIG from '../../storage/config.js';
import {fs, $} from 'zx';
export const uninstallCommand = new Command('update');

uninstallCommand.description('Uninstall server and delete all models')
    .action(async () => {
        await fs.remove(ENV_CONFIG.CATAI_DIR!);
        await $`npm uninstall -g catai`;

        console.log('CatAI uninstalled');
    });
