import 'zx/globals';
import path from 'path';
import prettyBytes from 'pretty-bytes';
import CLITable from 'cli-table3';
import { getInstalledModels } from './utils/model-compatibility.js';
import { DOWNLOAD_LOCATION } from '../src/model-settings.js';

const modelDir = path.join(DOWNLOAD_LOCATION, "models");
const files = await getInstalledModels();

const modelTable = new CLITable({
    head: ['Model', 'Download Date', 'Size']
});

let hasModels = false;
for (const file of files) {
    if (!file.isFile()) {
        continue;
    }

    hasModels = true;

    const {birthtime, size} = await fs.stat(path.join(modelDir, file.name));
    const birthtimeDate = new Date(birthtime).toLocaleDateString();

    if(size > 1048576 * 11){ // skip system files / partly downloaded files - 11mb
        modelTable.push(
            [file.name, birthtimeDate, prettyBytes(size)]
        );
    }
}

if (!hasModels) {
    console.log("No model downloaded");
} else {
    console.log(modelTable.toString());
}