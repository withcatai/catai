import chalk from 'chalk';
import * as os from 'os';
import FetchModels, {DEFAULT_VERSION} from './fetch-models.js';
import AppDb, {ModelSettings} from '../../storage/app-db.js';
import {packageJSON} from '../../storage/config.js';
import semver from 'semver';

const GB_IN_BYTES = 1024 * 1024 * 1024;

interface Compatibility {
    compatibility: string;
    catAIVersionCompatibility: boolean;
    note: string;
}

export interface ModelInfo {
    model: string;
    modelInstalled: boolean;
    compatibility: string;
    catAIVersionCompatibility: boolean;
    note: string;
    version: string;
}
export interface AvailableModels {
    [key: string]: ModelSettings<any>
}

class ModelCompatibilityChecker {
    private static readonly availableCpuCors: number = os.cpus().length;
    private static readonly totalMemoryInGB: number = os.totalmem() / GB_IN_BYTES;
    private static readonly availableMemory: number = os.freemem() / GB_IN_BYTES;

    public static checkModelCompatibility({hardwareCompatibility, compatibleCatAIVersionRange}: Pick<ModelSettings, 'hardwareCompatibility' | 'compatibleCatAIVersionRange'>): Compatibility {
        if (!compatibleCatAIVersionRange?.[0]) {
            return {
                compatibility: '?',
                note: 'Model unknown',
                catAIVersionCompatibility: true
            };
        }


        if (semver.gt(compatibleCatAIVersionRange[0], packageJSON.version)) {
            return {
                compatibility: '❌',
                note: `requires at least CatAI version ${chalk.cyan(compatibleCatAIVersionRange[0])}`,
                catAIVersionCompatibility: false
            };
        }

        if (compatibleCatAIVersionRange[1] && semver.lt(compatibleCatAIVersionRange[1], packageJSON.version)) {
            return {
                compatibility: '❌',
                note: `requires CatAI version ${chalk.cyan(compatibleCatAIVersionRange[1])} or lower`,
                catAIVersionCompatibility: false
            };
        }

        if(!hardwareCompatibility) {
            return {
                compatibility: '?',
                note: 'Model unknown',
                catAIVersionCompatibility: true
            };
        }

        const { ramGB: memory, cpuCors: cpu } = hardwareCompatibility;

        if (this.totalMemoryInGB < memory) {
            return {
                compatibility: '❌',
                note: `requires at least ${chalk.cyan(`${memory}GB`)} of RAM`,
                catAIVersionCompatibility: true
            };
        } else if (this.availableCpuCors < cpu) {
            return {
                compatibility: '❌',
                note: `requires at least ${chalk.cyan(`${cpu}CPU`)} cores`,
                catAIVersionCompatibility: true
            };
        } else if (this.availableMemory < memory) {
            return {
                compatibility: '✅',
                note: `requires ${chalk.cyan(`${memory}GB`)} ${chalk.red(`free`)} RAM`,
                catAIVersionCompatibility: true
            };
        } else {
            return {
                compatibility: '✅',
                catAIVersionCompatibility: true,
                note: ''
            };
        }
    }

    public static modelVersion(model: string, models: AvailableModels): string {
        const installedVersion = AppDb.db.models[model]?.version || DEFAULT_VERSION;
        const remoteVersion = models[model]?.version || DEFAULT_VERSION;

        if (!models[model] || installedVersion === remoteVersion) {
            return chalk.green(`v${installedVersion} = v${remoteVersion}`);
        }

        if (installedVersion < remoteVersion) {
            return `${chalk.yellow('v' + installedVersion)} < ${chalk.green('v' + remoteVersion)}`;
        }

        return `${chalk.cyan('v' + installedVersion)} > ${chalk.green('v' + remoteVersion)}`;
    }

    public static async listAllModels(): Promise<ModelInfo[]> {
        const models: ModelInfo[] = [];
        const availableModels = await FetchModels.fetchModels();

        for (const model in availableModels) {
            if (availableModels[model].hide) continue;

            const modelInstalled = Boolean(AppDb.db.models[model]);
            const {compatibility, catAIVersionCompatibility, note} = this.checkModelCompatibility(availableModels[model]);
            const version = this.modelVersion(model, availableModels);

            models.push({
                model,
                modelInstalled,
                compatibility,
                catAIVersionCompatibility,
                note,
                version
            });
        }

        return models;
    }
}

export default ModelCompatibilityChecker;
