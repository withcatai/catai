import {LLamaClient} from 'llama-node';
import {MODEL_PATH} from './const.js';

const llama = new LLamaClient({path: MODEL_PATH, numCtxTokens: 128}, true);

function gptQuestion(callback) {
    const messages = [];

    let firstMessage = true;
    return async (question) => {
        messages.push({
            role: "user",
            content: question
        });

        let contentIncludeQuestion = false;
        let allContent = "";
        return await llama.createChatCompletion({
            messages,
            numPredict: BigInt(2048 * 1),
            temp: 0.5,
            topP: 0.8,
            topK: BigInt(40 * 20),
            repeatPenalty: 1,
            repeatLastN: BigInt(1),
        }, (res) => {
            if (firstMessage) {
                firstMessage = false;
                messages.push({
                    role: "assistant",
                    content: ""
                });
            }

            allContent += res.token;

            if(!contentIncludeQuestion && allContent.includes(question)) {
                contentIncludeQuestion = true;
            } else if(!contentIncludeQuestion) {
                return;
            }

            messages.at(-1).content += res.token;
            callback(res.token);
        });
    };
}

/**
 *
 * @param socket {Awaited<ResponseType<import('tinyws')TinyWSRequest['ws']>>}
 * @return {Promise<void>}
 */
export async function activateChat(socket) {

    const ask = gptQuestion(token => {
        socket.send(JSON.stringify({
            type: 'token',
            value: token
        }));
    });


    socket.on('message', async (message) => {
        const {question} = JSON.parse(message);

        try {
            await ask(question);
            socket.send(JSON.stringify({
                type: 'end'
            }));
        } catch (err) {
            socket.send(JSON.stringify({
                type: 'error',
                value: err.message
            }));
        }
    });
}