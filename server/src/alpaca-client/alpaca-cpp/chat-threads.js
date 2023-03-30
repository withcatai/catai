import {spawn} from 'child_process';
import MessageBuilder from './message-builder.js';


const NO_RESPONSE_TIMEOUT = 1000 * .5;
const RESPONSE_END = '> ';
export default class ChatThread {

    timeout = 1000 * 60;
    killed = false;

    constructor(execFile, settings, callback, onerror, onclose) {
        this.execFile = execFile;
        this.settings = settings;
        this.callback = callback;
        this.onerror = onerror;
        this.onclose = onclose;
    }

    #createSettingsSettings() {
        return Object.entries(this.settings).map(([key, value]) => [`--${key}`, `"${value.toString().replace(/"/g, '\\"')}"`]).flat();
    }



    run() {
        this.child = spawn(this.execFile,
            this.#createSettingsSettings(),
            {
                shell: true
            }
        );

        let buildMessage = new MessageBuilder();

        let dataCount = 0;
        let lastResponse;
        this.child.stdout.on('data', data => {
            if (dataCount === -1) return;

            const content = buildMessage.extractMessage(data);

            content.trim() && dataCount++;
            lastResponse = content;

            content && this.callback(content);
        });

        let errorMessage = '';
        this.child.stderr.on('data', data => {
            const content = buildMessage.extractMessage(data);

            errorMessage += content;
            this.callback(content);
        });

        this.child.on('close', code => {
            if(code || !this.killed){
                this.onerror?.(errorMessage += '\nThread unexpected closed!');
            }
            this.onclose?.(code);
        });

        const waitForResponse = () => {
            let lastDataCount = dataCount = 0;
            const startTime = Date.now();

            return new Promise(res => {
                const interval = setInterval(() => {

                    const responseClosed = this.killed || dataCount && lastDataCount === dataCount && lastResponse.endsWith(RESPONSE_END);
                    if (responseClosed || Date.now() - startTime > this.timeout) {
                        clearInterval(interval);
                        dataCount = -1;
                        res();
                    } else {
                        lastDataCount = dataCount;
                    }
                }, NO_RESPONSE_TIMEOUT);
            });
        }

        return {
            prompt: question => {
                const promptToProcessText = question.replaceAll('\n', '\\') + '\r\n';
                this.child.stdin.write(promptToProcessText);

                buildMessage = new MessageBuilder();
                return waitForResponse();
            },
            waitInit: waitForResponse
        }
    }

    kill() {
        this.killed = true;
        this.child.kill('SIGINT');
        this.child.kill('SIGINT');
    }
}