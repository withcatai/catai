import path from 'path';
import {jsonModelSettings} from './model-settings.js';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('./', import.meta.url));
const projectDir = path.join(__dirname, '..');
export const MODEL_PATH = path.join(projectDir, jsonModelSettings.model);
export const ALPACA_CPP_EXEC = path.join(projectDir, jsonModelSettings.exec);