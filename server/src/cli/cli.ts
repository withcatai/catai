import {Command} from 'commander';
import {installCommand} from './commands/install.js';
import {listModelsCommand} from './commands/models.js';
import {removeCommand} from './commands/remove.js';
import {useCommand} from './commands/use.js';
import {packageJSON} from '../storage/config.js';
import {updateHook} from './hooks/update.js';
import {updateCommand} from './commands/update.js';
import {uninstallCommand} from './commands/uninstall.js';
import {serveCommand} from './commands/serve.js';
import {activeCommand} from './commands/active.js';
import {postinstallCommand} from './commands/postinstall/postinstall.js';

const program = new Command();
program.version(packageJSON.version);

program.addCommand(installCommand);
program.addCommand(listModelsCommand);
program.addCommand(useCommand);
program.addCommand(serveCommand);
program.addCommand(updateCommand);
program.addCommand(activeCommand);
program.addCommand(removeCommand);
program.addCommand(uninstallCommand);

program.addCommand(postinstallCommand, {hidden: true});

program.hook(...updateHook);

program.parse();
