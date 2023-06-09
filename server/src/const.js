import path from 'path';
import minimist from 'minimist';
import yn from 'yn';

export const RESTART_EXIT_CODE = 11;

export const ARGS = minimist(process.argv.slice(2));
export const PRODUCTION = yn(ARGS.production);
export const SELECTED_UI = ARGS.ui || 'catai';
export const UI_DIRECTORY = path.join('www', SELECTED_UI);
export const PORT = parseInt(process.env.CATAI_PORT) || 3000;
export const OPEN_IN_BROWSER = yn(process.env.CATAI_OPEN_IN_BROWSER) ?? true;
export const ADMIN_SETTINGS = yn(process.env.CATAI_ADMIN_SETTINGS) ?? true;