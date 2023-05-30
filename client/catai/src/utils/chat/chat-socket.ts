import ChatActions from './chat-actions.js';

const secure = location.protocol.startsWith('https') ? 's' : '';
export type ChatMessage = {
    content: string,
    error?: string,
    active: boolean,
    hide?: boolean
    myMessage?: boolean,

};

export default class ChatSocket {
    socket = new WebSocket(`ws${secure}://${location.host}/ws`);
    actions: ChatActions;

    constructor(public messages: ChatMessage[], public updateUI: () => void) {
        this.actions = new ChatActions(this);
        this.initEvents();
    }

    private initEvents() {
        this.socket.addEventListener('message', this.switchAction.bind(this));
    }

    sendMessage(json: any) {
        this.socket.send(JSON.stringify(json));
    }

    protected switchAction(event: MessageEvent) {
        const {type, value} = JSON.parse(event.data);

        switch (type) {
            case 'token':
                this.actions.serverToken(value);
                break;
            case 'error':
                this.actions.serverError(value);
                break;
            case 'end':
                this.actions.serverEnd();
                break;
        }
    }
}