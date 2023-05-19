export class IAlpacaClient {
    static name = 'IAlpacaClient';
    static key = null;
    
    waitInit = null;
    abortSignal = new AbortController();

    constructor(callback, onerror, onclose) {
    }

    async question(text) {

    }

    close() {

    }

    static trimMessageEnd(message, trimText = '') {
        message = message.trimEnd();

        if (message.endsWith(trimText)) {
            message = message.slice(0, -trimText.length).trimEnd();
        }

        return message;
    }

    static onceSelected() {
        // once this binding is selected, this function will be called
    }
}