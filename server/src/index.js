import {App} from '@tinyhttp/app';
import {tinyws} from 'tinyws';
import {PORT} from './const.js';
import {activateChat} from './chat.js';
import {cors} from '@tinyhttp/cors';
import sirv from 'sirv';
import getPort from 'get-port';
import openurl from 'openurl';

const app = new App();

app.use(tinyws());
app.use(cors({origin: '*'}));
app.use('/ws', async (req, res) => {
    if (req.ws) {
        const ws = await req.ws();
        activateChat(ws);
    } else {
        res.send('This is for web socket!');
    }
});

app.use(sirv('www'));

const listenPort = await getPort({port: PORT});

const browserURL = `http://127.0.0.1:${listenPort}`;
app.listen(listenPort, () => console.log(`Listening on ${browserURL}`));

openurl.open(browserURL);