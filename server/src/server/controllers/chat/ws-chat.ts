import {WebSocket} from 'ws';
import createChat from '../../../manage-models/bind-class/bind-class.js';
import {ChatContext} from '../../../manage-models/bind-class/chat-context.js';

export default class WsChatController {
    private _loadChat?: ChatContext;
    public constructor(protected ws: WebSocket) {
    }

    public async init(){
        this._loadChat = await createChat();
        this._initEvents();
    }

    protected get _chat() {
        if (!this._loadChat)
            throw new Error('Chat not loaded');
        return this._loadChat;
    }

    private _initEvents() {
        this.ws.on('message', this._onWSMessage.bind(this));
        this.ws.on('close', this._chat.abort.bind(this));

        this._chat.on('modelResponseEnd', () => {
            this._sendEvent('end', null);
        });
        this._chat.on('error', (error) => {
            this._sendEvent('error', error);
        });
        this._chat.on('token', (text) => {
            process.stdout.write(text);
            this._sendEvent('token', text);
        });
    }

    private async _onWSMessage(message: string) {
        const {event, value} = JSON.parse(message);
        switch (event) {
            case 'prompt':
                await this._chat.prompt(value);
                break;
            case 'abort':
                await this._chat.abort();
                break;
        }
    }

    private _sendEvent(event: 'token' | 'error' | 'end', value: any) {
        this.ws.send(JSON.stringify({event, value}));
    }
}
