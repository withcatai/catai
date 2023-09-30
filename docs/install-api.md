# CatAI Install API

You can install models on the fly using the `FetchModels` class.

```ts
import {FetchModels} from 'catai';

const allModels = await FetchModels.fetchModels();
const firstModel = Object.keys(allModels)[0];

const installModel = new FetchModels({
    download: firstModel,
    latest: true,
    model: {
        settings: {
            // extra model settings
        }
    }
});

await installModel.startDownload();
```

After the download is finished, this model will be the active model.

## Configuration

You can change the active model by changing the `CatAIDB`

```ts
import {CatAIDB} from 'catai';

CatAIDB.db.activeModel = Object.keys(CatAIDB.db.models)[0];

await CatAIDB.saveDB();
```

You also can change the model settings by changing the `CatAIDB`

```ts
import {CatAIDB} from 'catai';

const selectedModel = CatAIDB.db.models[CatAIDB.db.activeModel];
selectedModel.settings.context = 4096;

await CatAIDB.saveDB();
```

For extra information about the configuration, please read the [configuration guide](./configuration.md)
