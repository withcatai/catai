import CLITable from 'cli-table3';
import 'zx/globals';
import { listAllModels } from './utils/model-compatibility.js';

const modelTable = new CLITable({
    head: ['Models', 'Installed', 'Compatibility', 'Note']
});

for(const {model, modelInstalled, compatibility, note} of await listAllModels()){
    modelTable.push([
        model,
        modelInstalled ? '✅' : '❌',
        compatibility,
        note
    ]);
}

console.log(modelTable.toString());
