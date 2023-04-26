import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import http from 'http';
import sirv from 'sirv';
import { WebSocketServer } from 'ws';
import { activateChat, requestAnswer } from './chat.js';
import { UI_DIRECTORY } from './const.js';
import serverListen from './server.js';
import bodyParser from 'body-parser';


const app = new App();
const server = http.createServer(app.handler.bind(app));
const ws = new WebSocketServer({ server });

app.use(cors({ origin: '*' }));
app.use(sirv(UI_DIRECTORY));
app.use(bodyParser.json());

ws.on('connection', activateChat);

app.post('/question', async ({body}, res) => {
    const { question } = body;
    if (!question) {
        res.status(400).send('Missing question');
        return;
    }
    res.json(await requestAnswer(question));
});

serverListen(server);