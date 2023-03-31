import path from 'path';
import {DOWNLOAD_LOCATION, jsonModelSettings} from './model-settings.js';

export const PRODUCTION = process.argv.includes('production');
export const MODEL_PATH = path.join(DOWNLOAD_LOCATION, jsonModelSettings.model || '');
export const ALPACA_CPP_EXEC = path.join(DOWNLOAD_LOCATION, jsonModelSettings.exec || '');