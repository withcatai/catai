import ChatThreads from './chat-threads.js';
import {jsonModelSettings} from './model-settings.js';

const llama = new ChatThreads(jsonModelSettings.exec, {ctx_size: 2048 * 2, model: jsonModelSettings.model});

/**
 *
 * @param socket {Awaited<ResponseType<import('tinyws')TinyWSRequest['ws']>>}
 * @return {Promise<void>}
 */
export async function activateChat(socket) {
    const sendJSON = data => socket.send(JSON.stringify(data));

    const onToken = token => {
        sendJSON({
            type: 'token',
            value: token
        });
    };

    const onError = err => {
        sendJSON({
            type: 'error',
            value: err
        });
    };

    const sendClose = () => {
        sendJSON({
            type: 'end'
        });
    }

    const llamaThread = llama.createThread(onToken, onError);

    const ask = llamaThread.run();

    // init process
    await ask.waitForResponse();
    sendClose(); // close init message

    socket.on('message', async (message) => {
        const {question} = JSON.parse(message);
        await ask.prompt(question);
        sendClose();
    });

    socket.on('close', () => {
        llamaThread.kill();
    });
}