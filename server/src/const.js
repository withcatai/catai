import path from 'path';
import {DOWNLOAD_LOCATION, jsonModelSettings} from './model-settings.js';

export const PRODUCTION = process.argv.includes('production');
export const SELECTED_UI = process.argv[3] || 'catai';
export const UI_DIRECTORY = path.join('www', SELECTED_UI);
export const MODEL_PATH = path.join(DOWNLOAD_LOCATION, jsonModelSettings.model || '');
export const ALPACA_CPP_EXEC = path.join(DOWNLOAD_LOCATION, jsonModelSettings.exec || '');