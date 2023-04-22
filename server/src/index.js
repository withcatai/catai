import {App} from '@tinyhttp/app';
import {OPEN_IN_BROWSER, PORT} from './config.js';
import {activateChat} from './chat.js';
import {cors} from '@tinyhttp/cors';
import sirv from 'sirv';
import getPort from 'get-port';
import openurl from 'openurl';
import {WebSocketServer} from 'ws';
import http from 'http';
import tryCatch from 'try-catch';
import {PRODUCTION, UI_DIRECTORY} from './const.js';


const app = new App();
const server = http.createServer(app.handler.bind(app));
const ws = new WebSocketServer({server});

app.use(cors({origin: '*'}));
app.use(sirv(UI_DIRECTORY));

ws.on('connection', activateChat);

const listenPort = await getPort({port: PORT});
const browserURL = `http://127.0.0.1:${listenPort}`;
server.listen(listenPort, () => console.log(`Listening on ${browserURL}`));
(PRODUCTION && OPEN_IN_BROWSER) && tryCatch(() => openurl.open(browserURL));