import 'zx/globals';
import {jsonModelSettings, saveModelSettings} from '../src/model-settings.js';
import {BINDING} from '../src/model-bind/binding.js';
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


const bindMethod = argv.bind;
const bindModel = argv.model;
const bindKey = argv.key;

const bindFound = BINDING.find(x => x.name === bindMethod);

if(!bindFound){
    console.error(`Binding not found, use: "catai bind --list" to list all available bindings`);
    process.exit(1);
}

const modelMetadata = jsonModelSettings.metadata[bindModel];
if(!modelMetadata) {
    console.error(`Model not found, use: "catai models" to list all available models`);
    process.exit(1);
}

modelMetadata.bind = bindMethod;
modelMetadata.key = bindKey;

await saveModelSettings();
console.log(`Binding set to ${bindMethod}`);