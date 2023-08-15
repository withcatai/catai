import getPORT from 'get-port';
import ENV_CONFIG from '../../storage/config.js';
import open from 'open';
import http from 'http';

export default async function openServer(server: http.Server) {
    const findPORT = await getPORT({port: ENV_CONFIG.PORT});
    const browserURL = `http://127.0.0.1:${findPORT}`;

    server.listen(findPORT, () => {
        console.log(`CatAI client on ${browserURL}`);
    });

    if(ENV_CONFIG.PRODUCTION && ENV_CONFIG.OPEN_IN_BROWSER){
        await open(browserURL);
    }
}
