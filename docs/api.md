# CatAI API

CatAI provides multiple APIs to interact with the model.

## Local API

The local API is only available in Node.js.

Enable you to chat with the model locally on your computer.

```ts
import {createChat} from 'catai';

const chat = await createChat();

const response = await catai.prompt('Write me 100 words story', token => {
    progress.stdout.write(token);
});

console.log(`Total text length: ${response.length}`);
```

If you want to install the model on the fly, please read the [install-api guide](./install-api.md)

## Remote API

Allowing you to run the model on a remote server.

### Simple API

Node.js & Browser compatible API:

```js
const response = await fetch('http://127.0.0.1:3000/api/chat/prompt', {
    method: 'POST',
    body: JSON.stringify({
        prompt: 'Write me 100 words story'
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});

const data = await response.text();
```

<details>
  <summary>You can also stream the response</summary>

```js
const response = await fetch('http://127.0.0.1:3000/api/chat/prompt', {
    method: 'POST',
    body: JSON.stringify({
        prompt: 'Write me 100 words story'
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});

const reader = response.body.pipeThrough(new TextDecoderStream())
    .getReader();

while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    console.log('Received', value);
}
```

</details>

### Advanced API

This API is only available only in Node.js.
[demo](../examples/remotecall.js)

```js
import { RemoteCatAI } from "catai";

const catai = new RemoteCatAI("ws://localhost:3000");

catai.on("open", async () => {
  console.log("Connected");
  const response = await catai.prompt("Write me 100 words story", (token) => {
    process.stdout.write(token);
  });

  console.log(`Total text length: ${response.length}`);
  catai.close();
});

```
