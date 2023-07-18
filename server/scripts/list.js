import 'zx/globals';
import prettyBytes from 'pretty-bytes';
import CLITable from 'cli-table3';
import {jsonModelSettings} from '../src/model-settings.js';

const modelTable = new CLITable({
    head: ['Selected', 'Model', 'Download Date', 'Size']
});

let hasModels = false;
let index = 1;
for (const [model, content] of Object.entries(jsonModelSettings.metadata)) {
    hasModels = true;

    const { size, birthtime} = await getInfoAboutModel(content);
    const birthtimeDate = new Date(birthtime).toLocaleDateString();
    const selectedModel = jsonModelSettings.model === model ? '✅' : index;
    index++;

    modelTable.push(
        [selectedModel, model, birthtimeDate, prettyBytes(size)]
    );
}

if (!hasModels) {
    console.log("No model downloaded");
} else {
    console.log(modelTable.toString());
}

async function getInfoAboutModel({downloadedFiles, birthtime}) {
    if(!downloadedFiles) {
        return {
            size: 0,
            birthtime
        };
    }

    const files = await Promise.all(Object.values(downloadedFiles).map(file => fs.stat(file).catch(() => null)));

    const createDates = [];
    let totalSize = 0;

    for (const file of files) {
        if(!file) continue;

        totalSize += file.size;
        createDates.push(file.birthtime);
    }

    return {
        size: totalSize,
        birthtime: Math.min(...createDates)
    };
}