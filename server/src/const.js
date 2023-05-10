import path from 'path';
import minimist from 'minimist';
import yn from 'yn';
import {DOWNLOAD_LOCATION, jsonModelSettings} from './model-settings.js';

export const ARGS = minimist(process.argv.slice(2));
export const PRODUCTION = yn(ARGS.production);
export const SELECTED_UI = ARGS.ui || 'catai';
export const UI_DIRECTORY = path.join('www', SELECTED_UI);
export const MODEL_PATH = path.join(DOWNLOAD_LOCATION, jsonModelSettings.model || '');
export const ALPACA_CPP_EXEC = path.join(DOWNLOAD_LOCATION, jsonModelSettings.exec || '');