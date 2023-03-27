import fs from 'fs-extra';
import {fileURLToPath} from 'url';
import path from 'path';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const modelSettings = path.join(__dirname, '..', 'models', 'settings.json');

await fs.ensureFile(modelSettings);
export const jsonModelSettings = JSON.parse((await fs.readFile(modelSettings, 'utf8')) || '{}');

export function saveModelSettings() {
    return fs.writeJSON(modelSettings, jsonModelSettings);
}