import {App} from '@tinyhttp/app';
import {tinyws} from 'tinyws';
import {PORT} from './const.js';
import {activateChat} from './chat.js';
import {cors} from '@tinyhttp/cors';
import sirv from 'sirv';
import getPort from 'get-port';

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
app.listen(listenPort, () => console.log('Listening on port ' + listenPort));