import RemoteCatAI from './server/remote/remote-catai.js';
import FetchModels from './manage-models/about-models/fetch-models.js';
import createChat, {getModelPath} from './manage-models/bind-class/bind-class.js';
import CatAIDB from './storage/app-db.js';
import ENV_CONFIG from './storage/config.js';
import {CatAIError} from './errors/CatAIError.js';
import {initCatAILlama} from './manage-models/bind-class/binds/node-llama-cpp/node-llama-cpp-v2/node-llama-cpp-v2.js';

export * from 'node-llama-cpp';

const downloadModel = FetchModels.simpleDownload;

export {
    CatAIError,
    RemoteCatAI,
    FetchModels,
    createChat,
    CatAIDB,
    getModelPath,
    downloadModel,
    initCatAILlama,
    ENV_CONFIG as CATAI_ENV_CONFIG,
};
