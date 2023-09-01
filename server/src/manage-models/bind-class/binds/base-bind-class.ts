import {ModelSettings} from '../../../storage/app-db.js';
import {ChatContext} from '../chat-context.js';

export default abstract class BaseBindClass<T> {
    public static shortName?: string;
    public static description?: string;

    public constructor(public modelSettings: ModelSettings<T>) {
    }

    public abstract initialize(): Promise<void> | void;

    public abstract createChat(): ChatContext;
}
