# CatAI Install API

You can install models on the fly using the `FetchModels` class.

```ts
import {FetchModels} from 'catai';

const allModels = await FetchModels.fetchModels();

const installModel = new FetchModels({
    download: "https://huggingface.co/QuantFactory/Meta-Llama-3-8B-Instruct-GGUF/resolve/main/Meta-Llama-3-8B-Instruct.Q2_K.gguf?download=true",
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

## Using with node-llama-cpp@beta

You can download the model and use it directly with node-llama-cpp@beta

```ts
import {getLlama, LlamaChatSession} from "node-llama-cpp";
import {getModelPath} from 'catai';
const modelPath = getModelPath("llama3");

const llama = await getLlama();
const model = await llama.loadModel({
    modelPath
});

const context = await model.createContext();
const session = new LlamaChatSession({
    contextSequence: context.getSequence()
});

const a1 = await session.prompt("Hi there, how are you?");
console.log("AI: " + a1);
```

For more information on how to use the model, please refer to the [node-llama-cpp beta pull request](https://github.com/withcatai/node-llama-cpp/pull/105)
