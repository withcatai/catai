import {IAlpacaClient} from './IAlpacaClient.js';
import { BingChat } from 'bing-chat'
import objectAssignDeep from 'object-assign-deep';

const defaultSettings = {
    key: ' ',
    settingsBingChat: {
        variant: 'Creative'
    }
}
export default class BingChatClient extends IAlpacaClient {
    static name = 'bing-chat';

    #chat;
    #lastResponse;

    constructor(tokenCallback, errorCallback, closeCallback) {
        super(tokenCallback, errorCallback, closeCallback);

        this.#chat = new BingChat({
            cookie: this.constructor.modelSettings.key
        });
    }

    async question(text) {
        try {
            let lastLength = 0;
            this.#lastResponse = await this.#chat.sendMessage(text, {
                ...this.#lastResponse,
                ...this.constructor.modelSettings.settingsBingChat,
                onProgress: (progress) => {
                    if(progress.text) {
                        const newText = progress.text.slice(lastLength);
                        lastLength = progress.text.length;
                        this.tokenCallback(newText);
                        process.stdout.write(newText);
                    }
                }
            });
        } catch (err) {
            if (err.message === 'stop-sequence') {
                console.log('--stop sequence abort--');
            } else {
                this.errorCallback(err.message);
            }
        }

        this.closeCallback();
    }

    static onceSelected() {
       this.modelSettings = objectAssignDeep({}, defaultSettings, this.modelSettings);
    }
}