import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export const DOWNLOAD_LOCATION = path.join(os.homedir(), 'catai');

const modelSettings = path.join(DOWNLOAD_LOCATION, 'settings.json');
await fs.ensureFile(modelSettings);
export const jsonModelSettings = JSON.parse((await fs.readFile(modelSettings, 'utf8')) || '{}');

export function saveModelSettings() {
    return fs.writeJSON(modelSettings, jsonModelSettings);
}