import {type ChatContext} from '../base-bind-class.js';
import {EventEmitter} from 'events';
import type NodeLlamaCpp from './node-llama-cpp.js';
import {LlamaChatSession, LlamaModel} from 'node-llama-cpp';
import createChatWrapper from './chat-wrapper/chat-wrapper.js';
import {ClassPull} from 'class-pull';

export default class NodeLlamaCppChat extends EventEmitter implements ChatContext {
    private _session: LlamaChatSession;
    private _model?: LlamaModel;

    constructor(protected _parent: NodeLlamaCpp, protected _pull: ClassPull<LlamaModel>) {
        super();
        this._session = new LlamaChatSession({
            model: this._proxyModel,
            promptWrapper: createChatWrapper(_parent.modelSettings.settings?.wrapper),
        });
    }

    private get _proxyModel(){
        return new Proxy({} as LlamaModel, {
            get: (target, prop) => {
                return Reflect.get(this._model!, prop);
            },
            set: (target, prop, value) => {
                return Reflect.set(this._model!, prop, value);
            }
        })
    }

    public async prompt(prompt: string): Promise<string | null> {
        this.emit('abort', 'Aborted by new prompt');
        const {unlock, instance} = await  this._pull.lockInstance();
        const abort = new AbortController();
        const closeCallback = () => {
            abort.abort();
            unlock();
            this.off('abort', closeCallback);
        };
        this.once('abort', closeCallback);

        let response = null;
        this._model = instance;

        try {
            response = await this._session.prompt(prompt, this.onToken.bind(this), {signal: abort.signal});
        } catch (error: any) {
            this.emit('error', error.message);
        }

        closeCallback();
        this.emit('modelResponseEnd', response);
        return response;
    }

    private onToken(token: number | number[]) {
        const text = this._model!.decode(Uint32Array.from([token].flat()));
        this.emit('token', text);
    }

    abort(reason = 'Aborted by user'): void {
        this.emit('abort', reason);
    }
}
