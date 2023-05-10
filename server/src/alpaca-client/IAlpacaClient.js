export class IAlpacaClient {
    waitInit;
    abortSignal = new AbortController();

    constructor(callback, onerror, onclose) {
    }

    async question(text) {

    }

    close() {

    }

    static trimMessageEnd(message, trimText) {
        message = message.trimEnd();

        if (message.endsWith(trimText)) {
            message = message.slice(0, -trimText.length).trimEnd();
        }

        return message;
    }
}