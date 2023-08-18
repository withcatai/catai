import {App} from "@tinyhttp/app";
import WsChatController from "../../controllers/chat/ws-chat.js";
import createChat from "../../../manage-models/bind-class/bind-class.js";
import {WebSocket} from "ws";

export const chatRouter = new App();

export async function connectWS(ws: WebSocket){
    console.log("New connection");
    const controller = new WsChatController(ws);
    await controller.init();
}

chatRouter.post('/prompt', async (req, res) => {
    res.type('text/plain');
    const {prompt} = req.body;

    const chat = await createChat();
    chat.on('token', (token) => {
        res.write(token);
    });

    req.once('close', () => {
        chat.abort();
    });

    await chat.prompt(prompt);
    res.end();
});
