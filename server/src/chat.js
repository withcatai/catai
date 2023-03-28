import ChatThreads from './chat-threads.js';
import {jsonModelSettings} from './model-settings.js';

const llama = new ChatThreads(jsonModelSettings.exec, {ctx_size: 2048 * 2, model: jsonModelSettings.model});

/**
 *
 * @param socket {Awaited<ResponseType<import('tinyws')TinyWSRequest['ws']>>}
 * @return {Promise<void>}
 */
export async function activateChat(socket) {
    function sendJSON(type) {
        return (value = null) => socket.send(
            JSON.stringify({
                type,
                value
            })
        );
    }
    const sendMessageEnd = sendJSON('end');

    const llamaThread = llama.createThread(sendJSON('token'), sendJSON('error'));
    const ask = llamaThread.run();

    await ask.waitInit();
    sendMessageEnd(); // close init message

    socket.on('message', async (message) => {
        const {question} = JSON.parse(message);
        await ask.prompt(question);
        sendMessageEnd();
    });

    socket.on('close', () => {
        llamaThread.kill();
    });
}