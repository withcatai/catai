import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import objectAssignDeep from 'object-assign-deep';

export const DOWNLOAD_LOCATION = process.env.CATAI_DOWNLOAD_LOCATION || path.join(os.homedir(), 'catai');

const modelSettings = path.join(DOWNLOAD_LOCATION, 'settings.json');
await fs.ensureFile(modelSettings);
const jsonModelSettingsString = await fs.readFile(modelSettings, 'utf8');

/**
 * @typedef {{
 *   bind: string,
 *   key?: string,
 *   downloadedFiles?: {
 *       [key: string]: string
 *   },
 *   version: number
 * }} ModelSettings
 *
 * @typedef {{
 *  model?: string,
 *  metadata: {
 *    [key: string]: ModelSettings,
 *    default: ModelSettings
 *  }
 * }} CatAISettings
 */

/**
 * @type {CatAISettings}
 */
const defaultSettings = {
    metadata: {
    }
};
/**
 * @type {CatAISettings}
 */
export const jsonModelSettings = jsonModelSettingsString && JSON.parse(jsonModelSettingsString) || {};
objectAssignDeep(jsonModelSettings, defaultSettings);

export function saveModelSettings() {
    return fs.writeJSON(modelSettings, jsonModelSettings);
}