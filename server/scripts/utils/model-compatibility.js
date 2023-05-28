import 'zx/globals';
import {chalk} from 'zx';
import os from 'os';
import {jsonModelSettings} from '../../src/model-settings.js';
import ModelURL from './model-url.js';

const GB_IN_BYTES = 1024 * 1024 * 1024;

const availableCpuCors = os.cpus().length;
const totalMemoryInGB = os.totalmem() / GB_IN_BYTES;
const availableMemory = os.freemem() / GB_IN_BYTES;

/**
 * 
 * @param {string} model
 * @param {Object} availableModels
 * @returns {{compatibility: string, note: string}}
 */
export default function checkModelCompatibility(model, availableModels) {
    const compatability = availableModels[model]?.compatability
    if (!compatability) {
        return {
            compatibility: '?',
            note: 'Model unknown'
        }
    }

    const { ramGB: memory, cpuCors: cpu } = compatability;

    if (totalMemoryInGB < memory) {
        return {
            compatibility: '❌',
            note: `requires at least ${chalk.cyan(`${memory}GB`)} of RAM`
        }
    } else if (availableCpuCors < cpu) {
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

export async function listAllModels() {
    const models = [];
    const availableModels = await ModelURL.fetchModels();

    for (const model in availableModels) {
        const modelInstalled = Boolean(jsonModelSettings.metadata[model]);
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