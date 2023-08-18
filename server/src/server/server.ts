import {App} from '@tinyhttp/app';
import {cors} from '@tinyhttp/cors';
import sirv from 'sirv';
import {apiRouter} from './api/api.js';
import bodyParser from 'body-parser';
import {getStaticClientDirectory} from './utils/static-client.js';
import openServer from './utils/open-server.js';
import {WebSocketServer} from 'ws';
import http from 'http';
import {connectWS} from './api/routes/chat.js';


const app = new App();
const server = http.createServer(app.handler.bind(app) as any);
const ws = new WebSocketServer({ server });


app.use(cors({origin: '*'}));
app.use(sirv(getStaticClientDirectory()));
app.use(bodyParser.json());
app.use('/api', apiRouter);
ws.on('connection', connectWS);

await openServer(server);
