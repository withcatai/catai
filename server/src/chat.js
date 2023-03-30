import {jsonModelSettings} from './model-settings.js';
import {ChatManager} from './alpaca/chat-manager.js';

if(!jsonModelSettings.exec || !jsonModelSettings.model) {
    throw new Error('Model not found, try re-downloading the model');
}

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

    const chat =  new ChatManager(sendJSON('token'), sendJSON('error'));
    const sendMessageEnd = sendJSON('end');

    socket.on('message', async (message) => {
        const {question} = JSON.parse(message);
        await chat.question(question);
        sendMessageEnd();
    });
}