import 'zx/globals';
import {jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import {BINDING} from '../src/alpaca-client/binding.js';
import CLITable from 'cli-table3';
import yn from 'yn';

const listMethods = yn(argv.list);

if(listMethods){
    const bindMethodTable = new CLITable({
        head: ['Methods']
    });

    bindMethodTable.push(...BINDING.map(x => [x.name]));
    console.log(bindMethodTable.toString());
    process.exit(0);
}


const bindMethod = argv.methods;
const bindKey = argv.key;

const bindFound = BINDING.find(x => x.name === bindMethod);

if(!bindFound){
    console.error(`Binding not found, use: "catai bind --list" to list all available bindings`);
    process.exit(1);
}

jsonModelSettings.binding = bindFound.name;
jsonModelSettings.bindingKey = bindKey;

await saveModelSettings();
console.log(`Binding set to ${bindFound.name}`);