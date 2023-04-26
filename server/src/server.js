import getPort from "get-port";
import { PRODUCTION } from "./const.js";
import { OPEN_IN_BROWSER, PORT } from "./config.js";
import tryCatch from 'try-catch';
import openurl from 'openurl';

export default async function serverListen(server) {
    const listenPort = await getPort({ port: PORT });
    const browserURL = `http://127.0.0.1:${listenPort}`;

    server.listen(listenPort, () => console.log(`Listening on ${browserURL}`));

    if(PRODUCTION && OPEN_IN_BROWSER){
        tryCatch(() => openurl.open(browserURL));
    }
}