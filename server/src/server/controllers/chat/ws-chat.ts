import {WebSocket} from 'ws';
import createChat from '../../../manage-models/bind-class/bind-class.js';
import {ChatContext} from '../../../manage-models/bind-class/binds/base-bind-class.js';

export default class WsChatController {
    private _loadChat?: ChatContext;
    public constructor(protected ws: WebSocket) {
    }

    public async init(){
        this._loadChat = await createChat();
        this.initEvents();
    }

    protected get chat() {
        if (!this._loadChat)
            throw new Error('Chat not loaded');
        return this._loadChat;
    }

    private initEvents(){
        this.ws.on('message', this.onWSMessage.bind(this));
        this.chat.on('modelResponseEnd', () => {
            this.sendEvent('end', null);
        });
        this.chat.on('error', (error) => {
            this.sendEvent('error', error);
        });
        this.chat.on('token', (text) => {
            this.sendEvent('token', text);
        });
    }

    private async onWSMessage(message: string){
        const {type, value} = JSON.parse(message);
        switch (type) {
            case 'prompt':
                await this.chat.prompt(value);
                break;
            case 'abort':
                await this.chat.abort();
                break;
        }
    }

    private sendEvent(event: 'token' | 'error' | 'end', value: any){
        this.ws.send(JSON.stringify({event, value}));
    }
}
