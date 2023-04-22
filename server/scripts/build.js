import 'zx/globals';

await fs.emptyDir('./www');

const CLIENTS = path.join(__dirname, '../../client');
const MAIN_CLIENT = 'catai';

const allClients = await fs.readdir(CLIENTS, {withFileTypes: true});
for (const client of allClients) {
    if (!client.isDirectory()) continue;

    const clientPath = path.join(CLIENTS, client.name);
    await within(async () => {
        cd(clientPath);
        await $`npm run build`;
    });

    const isMainClient = client.name === MAIN_CLIENT;
    await fs.copy(`../client/${client.name}/dist`, `./www/${isMainClient ? '' : client.name}`);
}