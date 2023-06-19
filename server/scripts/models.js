import CLITable from 'cli-table3';
import 'zx/globals';
import { listAllModels } from './utils/model-compatibility.js';

const modelTable = new CLITable({
    head: ['Models', 'Installed', 'Version', 'Compatibility', 'Note']
});

for(const {model, modelInstalled, compatibility, note, version} of await listAllModels()){
    modelTable.push([
        model,
        modelInstalled ? '✅' : '❌',
        version,
        compatibility,
        note
    ]);
}

console.log(modelTable.toString());
