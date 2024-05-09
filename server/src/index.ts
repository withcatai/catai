import RemoteCatAI from './server/remote/remote-catai.js';
import FetchModels from './manage-models/about-models/fetch-models.js';
import createChat, {getModelPath} from './manage-models/bind-class/bind-class.js';
import CatAIDB from './storage/app-db.js';
import ENV_CONFIG from './storage/config.js';

const downloadModel = FetchModels.simpleDownload;

export {
    RemoteCatAI,
    FetchModels,
    createChat,
    CatAIDB,
    getModelPath,
    downloadModel,
    ENV_CONFIG as CATAI_ENV_CONFIG,
};
