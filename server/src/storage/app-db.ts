import fs from 'fs-extra';
import path from 'path';
import ENV_CONFIG from './config.js';

export type ModelSettings<T> = {
    bindClass: string;
    apiKey?: string;
    downloadedFiles: {
        [fileId: string]: string
    },
    version?: number;
    compatibleCatAIVersionRange?: [string, string?],
    hardwareCompatibility?: {
        "ramGB": number,
        "cpuCors": number,
        "compressions": number
    }
    settings?: T;
    defaultSettings: T,
    createDate: number
};

export type DBStore = {
    activeModel?: string;
    models: {
        [modelName: string]: ModelSettings<{
            [settingName: string]: any;
        }>
    }
}


export class CatAIJsonDB {
    private readonly DB_PATH = path.join(ENV_CONFIG.CATAI_DIR!, 'app-db.json');
    public db: DBStore;

    constructor() {
        this.db = {
            models: {}
        };
    }

    public async loadDB() {
        try {
            this.db = await fs.readJSON(this.DB_PATH);
        } catch {}
    }

    public async saveDB() {
        await fs.writeJSON(this.DB_PATH, this.db);
    }
}

const appDB = new CatAIJsonDB();
await appDB.loadDB();

export default appDB;
