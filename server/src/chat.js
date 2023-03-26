import ChatThreads from './chat-threads.js';

const llama = new ChatThreads('./chat_mac', {ctx_size: 2048 * 3});
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
    }

    const llamaThread = llama.createThread(onToken, onError);

    const ask = llamaThread.run();

    socket.on('message', async (message) => {
        const {question} = JSON.parse(message);
        await ask(question);
        sendJSON({
            type: 'end'
        });
    });

    socket.on('close', () => {
        llamaThread.kill();
    });
}