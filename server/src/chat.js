import {jsonModelSettings} from './model-settings.js';
import {getSelectedBinding} from './model-bind/binding.js';

if(!jsonModelSettings.model) {
    throw new Error('Model not found, try re-downloading the model');
}
export const SELECTED_BINDING = getSelectedBinding();

/**
 *
 * @param socket {Awaited<ResponseType<import('tinyws')TinyWSRequest['ws']>>}
 * @return {Promise<void>}
 */
export async function activateChat(socket) {
    console.log("new connection");
    function sendJSON(type) {
        return (value = null) => socket.send(
            JSON.stringify({
                type,
                value
            })
        );
    }

    const chat =  new SELECTED_BINDING(sendJSON('token'), sendJSON('error'), sendJSON('end'));
    sendJSON('config-model')(SELECTED_BINDING.name);

    socket.on('message', async (message) => {
        const {question, abort} = JSON.parse(message);

        if(abort) {
            chat.abortSignal.abort();
        } else if(question){
            await chat.question(question);
        }
    });

    socket.on('close', () => {
        chat.close();
    });
}

export function requestAnswer(question, req) {
    return new Promise(async sendResponse => {

        let responseText = '';
        let responseError = '';

        let initEnded = false;
        const onEnd = () => {
            if(!initEnded) return;

            sendResponse({
                text: SELECTED_BINDING.trimMessageEnd(responseText),
                error: responseError
            });
        }
    
        const chat =  new SELECTED_BINDING(text => responseText += text, error => responseError += error, onEnd);
        await chat.waitInit;
        initEnded = true;

        responseText = '';
        responseError = '';

        req.connection.once('close', () => chat.close()); // abort signal
        await chat.question(question);
    });
}