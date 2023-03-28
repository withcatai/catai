import {spawn} from 'child_process';

const NO_RESPONSE_TIMEOUT = 1000 * .5;
const RESPONSE_END = '\n>';
class ChatThread {

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

    static #fixText(text) {
        return text
            .replaceAll('[1m[32m[0m', '')
            .replaceAll('[0m', '')
            .replaceAll('[33m', '')
            .replaceAll('', '');
    }

    run() {
        this.child = spawn(this.execFile,
            this.#createSettingsSettings(),
            {
                shell: true
            }
        );

        let dataCount = 0;
        let lastResponse;
        this.child.stdout.on('data', data => {
            if (dataCount === -1) return;

            const content = ChatThread.#fixText(data.toString());
            content.trim() && dataCount++;
            lastResponse = content;

            this.callback(content);
        });

        let errorMessage = '';
        this.child.stderr.on('data', data => {
            const content = ChatThread.#fixText(data.toString());

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

                    const responseClosed = this.killed || dataCount && lastDataCount === dataCount && lastResponse.trimEnd() === RESPONSE_END;
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
                return waitForResponse();
            },
            waitInit: waitForResponse
        }
    }

    kill() {
        this.killed = true;
        this.child.kill();
    }
}

const defaultSettings = () => ({
    model: '',
    ctx_size: 2048,
    temp: 0.1,
    top_p: 0.9,
    top_k: 40,
    repeat_penalty: 1.3,
    repeat_last_n: 64,
    batch_size: 20
});
export default class ChatThreads {
    constructor(execFile = '', settings = defaultSettings()) {
        this.execFile = execFile;
        this.settings = settings;
    }

    createThread(callback, onerror, onclose) {
        return new ChatThread(this.execFile, this.settings, callback, onerror, onclose);
    }
}