import {spawn} from 'child_process';

class ChatThread {

    timeout = 1000 * 60;

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
            .replaceAll('/Users/idos./Documents/llama-ui/server/models/7B', '---hidden---')
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
        this.child.stdout.on('data', data => {
            console.log(data.toString());
            if (dataCount === -1) return;

            const content = ChatThread.#fixText(data.toString());
            content.trim() && dataCount++;

            this.callback(content);
        });

        let errorMessage = '';
        this.child.stderr.on('data', data => {
            const content = ChatThread.#fixText(data.toString());

            errorMessage += content;
            this.callback(content);
        });

        this.child.on('close', code => {
            code && this.onerror?.(errorMessage);
            this.onclose?.(code);
            this.onerror?.('Thread closed!');
        });

        return prompt => {
            this.child.stdin.write(prompt.replaceAll('\n', '\\') + '\r\n');

            let lastDataCount = dataCount = 0;
            const startTime = Date.now();
            return new Promise(res => {
                const interval = setInterval(() => {
                    if (dataCount && (lastDataCount === dataCount) || Date.now() - startTime > this.timeout) {
                        clearInterval(interval);
                        dataCount = -1;
                        res();
                    } else {
                        lastDataCount = dataCount;
                    }
                }, 1500);
            });
        };
    }

    kill() {
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