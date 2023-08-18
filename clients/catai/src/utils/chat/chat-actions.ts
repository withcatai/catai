import type ChatSocket from './chat-socket.js';

export default class ChatActions {
    get lastMessage() {
        return this.controls.messages.at(-1);
    }

    constructor(protected controls: ChatSocket) {
        this.initEvents();
    }

    private initEvents() {
        const connectionError = this.connectionError.bind(this);
        this.controls.socket.addEventListener('error', connectionError);
        this.controls.socket.addEventListener('close', connectionError);
    }

    private connectionError(event) {
        console.error('WebSocket error observed:', event);

        this.lastMessage.hide = false;
        this.lastMessage.error += `The connection lost, check the server status and refresh the page.`;
    }

    // client requests
    sendQuestion(question: string) {
        this.controls.messages.push(
            {content: question, myMessage: true, active: true},
            {content: '', error: '', active: true}
        );
        this.controls.sendMessage('prompt', question);
        this.controls.updateUI();
    }

    sendAbort() {
        this.controls.sendMessage('abort');
    }

    // server responses
    serverToken(value: string) {
        this.lastMessage.content += value;
        this.controls.updateUI();
    }

    serverError(value: string) {
        this.lastMessage.error += value;
        this.controls.updateUI();
    }

    serverEnd() {
        this.lastMessage.active = false;
        if(!this.lastMessage.content) {
            this.lastMessage.error = 'Model response is empty.';
        }

        this.controls.updateUI();
    }

}
