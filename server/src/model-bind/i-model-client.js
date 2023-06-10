export class IModelClient {
    static name = 'ImodelClient';
    static modelSettings = {};
    
    waitInit = null;
    abortSignal = new AbortController();
    tokenCallback;
    errorCallback;
    closeCallback

    constructor(tokenCallback = null, errorCallback = null, closeCallback = null) {
        this.tokenCallback = tokenCallback;
        this.errorCallback = errorCallback;
        this.closeCallback = closeCallback;
    }

    async question(text) {
        throw new Error('Not implemented!');
    }

    close() {
        this.closeCallback();
    }

    static trimMessageEnd(message, trimText = '') {
        message = message.trimEnd();

        if (trimText && message.endsWith(trimText)) {
            message = message.slice(0, -trimText.length).trimEnd();
        }

        return message;
    }

    static onceSelected() {
        // once this binding is selected, this function will be called
    }
}