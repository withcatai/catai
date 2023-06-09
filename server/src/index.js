import {App} from '@tinyhttp/app';
import {cors} from '@tinyhttp/cors';
import http from 'http';
import sirv from 'sirv';
import {WebSocketServer} from 'ws';
import {activateChat} from './api/chat/chat.js';
import {UI_DIRECTORY} from './const.js';
import serverListen from './server.js';
import bodyParser from 'body-parser';
import {apiRouter} from './api/index.js';


const app = new App();
const server = http.createServer(app.handler.bind(app));
const ws = new WebSocketServer({ server });

app.use(cors({ origin: '*' }));
app.use(sirv(UI_DIRECTORY));
app.use(bodyParser.json());

app.use('/api', apiRouter);
ws.on('connection', activateChat);


serverListen(server);