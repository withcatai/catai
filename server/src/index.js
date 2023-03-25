import { App, Request } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from 'tinyws'
import {PORT} from './const.js';

const app = new App();

app.use(tinyws())

app.use('/ws', async (req, res) => {
    if (req.ws) {
        const ws = await req.ws()

        return ws.send('hello there')
    } else {
        res.send('Hello from HTTP!')
    }
})

app.listen(PORT, () => console.log('Listening on port ' + PORT));