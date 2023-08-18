import * as path from "path";
import * as os from "os";
import yn from "yn";
import fs from "fs-extra";
import {fileURLToPath} from "url";

const __dirname = fileURLToPath(new URL('./', import.meta.url));
export const packageJSON = await fs.readJSON(path.join(__dirname, '..', '..', 'package.json'));

/**
 * CatAI config, that can be set by env variables
 * @property {string} CATAI_DIR - The directory to store models and other data.
 *
 * env: CATAI_DIR
 * @property {boolean} PRODUCTION - Whether to run in production mode
 *
 * env: CATAI_PRODUCTION
 * @property {string} SELECTED_UI - The web ui to use
 *
 * env: CATAI_SELECTED_UI
 * @property {number} PORT - The port to use for the server
 *
 * env: CATAI_PORT
 * @property {boolean} OPEN_IN_BROWSER - Whether to open the website in the browser
 *
 * env: CATAI_OPEN_IN_BROWSER
 * @property {boolean} ADMIN_USE - Whether to use admin features
 *
 * env: CATAI_ADMIN_USE
 * @property {string} MODEL_INDEX - The url to the model index, currently fetch from CatAI repo
 *
 * env: CATAI_MODEL_INDEX
 * @property {string} MODEL_DIR - The directory to store models
 *
 * env: CATAI_DIR
 * @property {boolean} DEBUG_MODE - Whether to run in debug mode
 *
 * env: CATAI_DEBUG
 * @property {number} SIMULTANEOUSLY_EXECUTING - The number of models that can be executed simultaneously
 *
 * env: CATAI_SIMULTANEOUSLY_EXECUTING
 * @interface
 */
export type Config = {
    CATAI_DIR: string;
    PRODUCTION: boolean;
    SELECTED_UI: string;
    PORT: number;
    OPEN_IN_BROWSER: boolean;
    ADMIN_USE: boolean;
    MODEL_INDEX: string;
    MODEL_DIR?: string;
    DEBUG_MODE?: boolean;
    SIMULTANEOUSLY_EXECUTING?: number;
}

const DEFAULT_CONFIG: Config = {
    CATAI_DIR: path.join(os.homedir(), "catai"),
    PRODUCTION: false,
    SELECTED_UI: "catai",
    PORT: 3000,
    OPEN_IN_BROWSER: true,
    ADMIN_USE: true,
    MODEL_INDEX: "https://raw.githubusercontent.com/withcatai/catai/main/models.json",
    DEBUG_MODE: false,
    SIMULTANEOUSLY_EXECUTING: 4
};

const ENV_CONFIG: Partial<Config> = {
    CATAI_DIR: process.env.CATAI_DIR,
    PRODUCTION: yn(process.env.CATAI_PRODUCTION),
    SELECTED_UI: process.env.CATAI_SELECTED_UI,
    PORT: Number(process.env.CATAI_PORT),
    OPEN_IN_BROWSER: yn(process.env.CATAI_OPEN_IN_BROWSER),
    ADMIN_USE: yn(process.env.CATAI_ADMIN_USE),
    MODEL_INDEX: process.env.CATAI_MODEL_INDEX,
    DEBUG_MODE: yn(process.env.CATAI_DEBUG),
    SIMULTANEOUSLY_EXECUTING: Number(process.env.CATAI_SIMULTANEOUSLY_EXECUTING),
    get MODEL_DIR() {
        return path.join(ENV_CONFIG.CATAI_DIR!, 'models');
    }
};
export default ENV_CONFIG;

function mergeConfig() {
    // if env config is not set, use default config
    for (const key in DEFAULT_CONFIG) {
        if (!(ENV_CONFIG as any)[key]) {
            (ENV_CONFIG as any)[key] = (DEFAULT_CONFIG as any)[key];
        }
    }
}

async function main() {
    mergeConfig();
    await fs.ensureDir(ENV_CONFIG.CATAI_DIR!);
}

await main();
