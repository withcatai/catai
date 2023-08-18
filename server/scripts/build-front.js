import 'zx/globals';

await fs.emptyDir('./www');

const CLIENTS = path.join(__dirname, '../../clients');

const allClients = await fs.readdir(CLIENTS, {withFileTypes: true});
for (const client of allClients) {
    if (!client.isDirectory()) continue;

    const clientPath = path.join(CLIENTS, client.name);
    await within(async () => {
        cd(clientPath);
        await $`npm install`;
        await $`npm run build`;
    });

    await fs.copy(`../clients/${client.name}/dist`, `./www/${client.name}`);
}
