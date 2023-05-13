import 'zx/globals';
import { chalk } from 'zx';
import os from 'os';
import { DOWNLOAD_LOCATION } from '../../src/model-settings.js';
import ModelURL from './model-url.js';

const GB_IN_BYTES = 1024 * 1024 * 1024;
const COMPATIBILITY_MAP = {
    '7B': {
        'q4': {
            memory: 5,
            cpu: 2
        }
    },
    '13B': {
        'q4': {
            memory: 9,
            cpu: 4
        }
    },
    '30B': {
        'q4': {
            memory: 21,
            cpu: 8
        }
    }
}

const cpuCors = os.cpus().length;
const memoryInGB = os.totalmem() / GB_IN_BYTES;
const availableMemory = os.freemem() / GB_IN_BYTES;

/**
 * 
 * @param {string} model 
 * @returns {{compatibility: string, note: string}}
 */
export default function checkModelCompatibility(model, availableModels) {
    const modelName = Object.keys(COMPATIBILITY_MAP).find(modelName => model.includes(`-${modelName}`))
    const modelFound = COMPATIBILITY_MAP[modelName];

    if (!modelFound) {
        return {
            compatibility: '?',
            note: 'Model unknown'
        }
    }

    const modelLink = availableModels[model].toLowerCase();
    const compressions = Object.keys(modelFound);
    const compressionType = compressions.find(x => modelLink.includes(x));

    const { memory, cpu } = modelFound[compressionType];

    if (memoryInGB < memory) {
        return {
            compatibility: '❌',
            note: `requires at least ${chalk.cyan(`${memory}GB`)} of RAM`
        }
    } else if (cpuCors < cpu) {
        return {
            compatibility: '❌',
            note: `requires at least ${chalk.cyan(`${cpu}CPU`)} cores`
        }
    } else if (availableMemory < memory) {
        return {
            compatibility: '✅',
            note: `requires ${chalk.cyan(`${memory}GB`)} ${chalk.red(`free`)} RAM`
        }
    } else {
        return {
            compatibility: '✅',
            note: ''
        }
    }
}

export async function getInstalledModels() {
    const modelDir = path.join(DOWNLOAD_LOCATION, "models");
    await fs.ensureDir(modelDir);

    return await fs.readdir(modelDir, { withFileTypes: true });
}

export async function listAllModels() {
    const models = [];

    const availableModels = await ModelURL.fetchModels();
    const installedModels = await getInstalledModels();

    for (const model of Object.keys(availableModels)) {
        const modelInstalled = Boolean(installedModels.find(file => file.name === model));
        const { compatibility, note } = checkModelCompatibility(model, availableModels);

        models.push({
            model,
            modelInstalled,
            compatibility,
            note
        });
    }

    return models;
}