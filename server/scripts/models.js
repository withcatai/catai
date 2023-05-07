import 'zx/globals';
import CLITable from 'cli-table';
import ModelURL from './utils/model-url.js';

const modelTable = new CLITable({
    head: ['Models']
});

const availableModels = await ModelURL.fetchModels();
modelTable.push(...Object.keys(availableModels).map(x => [x]));

console.log(modelTable.toString());