import getPort from "get-port";
import {OPEN_IN_BROWSER, PORT, PRODUCTION} from "./const.js";
import open from 'open';

export const activeServer = {server: null};
export default async function serverListen(server) {
    const listenPort = await getPort({ port: PORT });
    const browserURL = `http://127.0.0.1:${listenPort}`;

    activeServer.server = server.listen(listenPort, () => console.log(`Listening on ${browserURL}`));

    if(PRODUCTION && OPEN_IN_BROWSER){
        await open(browserURL);
    }
}