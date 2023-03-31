import 'zx/globals';
import path from 'path';
import prettyBytes from 'pretty-bytes';
import {DOWNLOAD_LOCATION} from '../src/model-settings.js';

const modelDir = path.join(DOWNLOAD_LOCATION, "models");
await fs.ensureDir(modelDir);

const files = await fs.readdir(modelDir, {withFileTypes: true});

let hasModels = false;
for (const file of files) {
    if (!file.isFile()) {
        continue;
    }

    hasModels = true;

    const {birthtime, size} = await fs.stat(path.join(modelDir, file.name));
    const birthtimeDate = new Date(birthtime).toLocaleDateString();

    if(size > 10_000){ // skip system files
        console.log(`Model: ${file.name}, download date: ${birthtimeDate}, size: ${prettyBytes(size)}`);
    }
}

if (!hasModels) {
    console.log("No model downloaded");
}