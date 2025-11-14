import {getLlama, Llama, LLamaChatPromptOptions, LlamaChatSession, LlamaChatSessionOptions, LlamaContextOptions, LlamaModel, LlamaModelOptions, LlamaOptions} from 'node-llama-cpp';
import NodeLlamaCppChat from './node-llama-cpp-chat.js';
import BaseBindClass from '../../base-bind-class.js';
import objectAssignDeep from 'object-assign-deep';
import fsExtra from 'fs-extra';
import {ModelNotInstalledError} from '../../../errors/ModelNotInstalledError.js';
import {ChatSessionModelFunction} from 'node-llama-cpp';
import ddg from 'duck-duck-scrape';

type ChatFlags = {
    builtInAPICall?: {
        webSearch: boolean;
        date: boolean;
        weather: boolean;
        currency: boolean;
    } | true
}

export type NodeLlamaCppOptions =
    Omit<LlamaContextOptions, 'model'> &
    Omit<LlamaModelOptions, 'modelPath'> &
    Omit<LlamaChatSessionOptions, 'contextSequence'> &
    LLamaChatPromptOptions & ChatFlags;


let cachedLlama: Llama | null = null;

export async function initCatAILlama(options?: LlamaOptions) {
    return cachedLlama = await getLlama(options);
}

export default class NodeLlamaCppV2 extends BaseBindClass<NodeLlamaCppOptions> {
    public static override shortName = 'node-llama-cpp-v2';
    public static override description = 'node-llama-cpp v2, that support GGUF model, and advanced feature such as output format, max tokens and much more';
    private _model?: LlamaModel;

    async createChat(overrideSettings?: NodeLlamaCppOptions) {
        if (!this._model)
            throw new Error('Model not initialized');

        const settings = objectAssignDeep({}, this.modelSettings.settings, overrideSettings);
        const context = await this._model.createContext({
            ...settings
        });

        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
            ...settings
        });

        this._flagsToSettings(settings);
        return new NodeLlamaCppChat(settings, session);
    }

    async initialize(): Promise<void> {
        if (!await fsExtra.pathExists(this.modelSettings.downloadedFiles.model)) {
            throw new ModelNotInstalledError(`Model ${this.modelSettings.downloadedFiles.model} does not exist locally - run "sync" to cleanup none exiting models`);
        }

        const llama = cachedLlama ?? await initCatAILlama();
        this._model = await llama.loadModel({
            modelPath: this.modelSettings.downloadedFiles.model,
            ...this.modelSettings.settings
        });
    }

    private _flagsToSettings(settings: NodeLlamaCppOptions) {
        const {webSearch = false, currency = false, date = false, weather = false} = settings.builtInAPICall === true ? {
            webSearch: true,
            date: true,
            weather: true,
            currency: true,
        } : {};

        const functions: Record<string, ChatSessionModelFunction> = settings.functions ??= {};

        if (webSearch) {
            functions.webSearch = {
                description: 'Search the web for the given query',
                params: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'string'
                        }
                    }
                },
                async handler(params: any) {
                    const results = await ddg.search(params.query);
                    return results.results;
                }
            } satisfies ChatSessionModelFunction;
        }

        if(currency) {
            functions.currencyConversion = {
                description: 'Convert the given amount from one currency to another. For example \'usd\' to \'eur\'.',
                params: {
                    type: 'object',
                    properties: {
                        from: {
                            type: 'string'
                        },
                        to: {
                            type: 'string'
                        },
                        amount: {
                            type: 'number'
                        }
                    }
                },
                async handler(params: any) {
                    const results = await ddg.currency(params.from, params.to, params.amount);
                    return results.conversion['converted-amount'];
                }
            } satisfies ChatSessionModelFunction;
        }

        if(weather){
            functions.getWeather = {
                description: 'Get the current weather for the given location',
                params: {
                    type: 'object',
                    properties: {
                        location: {
                            type: 'string'
                        },
                        locale: {
                            type: 'string',
                            description: 'The locale to give the summaries in - default to \'en\''
                        }
                    }
                },
                async handler(params: any) {
                    return await ddg.forecast(params.location, params.locale);
                }
            } satisfies ChatSessionModelFunction;
        }

        if(date){
            functions.getDate = {
                description: 'Get the current date',
                handler() {
                    return new Date().toISOString();
                },
            } satisfies ChatSessionModelFunction;
        }
    }
}
