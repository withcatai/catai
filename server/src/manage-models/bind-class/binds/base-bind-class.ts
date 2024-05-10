import {ModelSettings} from '../../../storage/app-db.js';
import {ChatContext} from '../chat-context.js';
import {NodeLlamaCppOptions} from "./node-llama-cpp/node-llama-cpp-v2/node-llama-cpp-v2.js";

export type CreateChatOptions = NodeLlamaCppOptions & {
    model: string
}

export default abstract class BaseBindClass<T> {
    public static shortName?: string;
    public static description?: string;

    public constructor(public modelSettings: ModelSettings<T>) {
    }

    public abstract initialize(): Promise<void> | void;

    public abstract createChat(overrideSettings?: CreateChatOptions): Promise<ChatContext>
}
