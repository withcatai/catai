<div align="center">
    <img alt="CatAI Logo" src="./demo/logo.png" width="360px"/>
    <h1>CatAI</h1>
</div>

<div align="center">

[![npm version](https://badge.fury.io/js/catai.svg)](https://badge.fury.io/js/catai)
[![npm downloads](https://img.shields.io/npm/dt/catai.svg)](https://www.npmjs.com/package/catai)
[![GitHub license](https://img.shields.io/github/license/ido-pluto/catai)](./LICENSE)

</div>
<br />

Run Alpaca model on your computer with a chat ui.

> Your own AI assistant run locally on your computer.

Inspired by [Dalai](https://github.com/cocktailpeanut/dalai), [Node-Llama](https://github.com/Atome-FE/llama-node), [Alpaca.cpp](https://github.com/antimatter15/alpaca.cpp)

## Installation & Use

Make sure you have [Node.js](https://nodejs.org/en/) installed.
```bash
npm install -g catai

catai install Vicuna-7B
catai serve
```

![catai](https://github.com/ido-pluto/catai/blob/main/demo/chat.gif)

## Features
- Auto detect programming language 🧑‍💻
- Click on user icon to show original message 💬
- Real time text streaming ⏱️
- Fast model downloads 🚀

## Intro

You can use any Alpaca model as long as your computer can handle it.
```bash
catai install Vicuna-13B
```

To see all the available models to install you can use this command.
```bash
catai models
```

You can also download a custom model like this:

```bash
catai install https://example.com/model.tar.bin
```

If you want to switch between models you can use `catai use` command.
```bash
catai use Vicuna-7B
```

#### Check out more commands [here](./docs/commands.md)

### Cross-platform
You can use it on Windows, Linux and Mac.

This package from version 1.6.0 could depend on [llama-node](https://github.com/hlhr202/llama-node)
which supports:

- darwin-x64
- darwin-arm64
- linux-x64-gnu
- win32-x64-msvc

### Memory usage
Runs on most modern computers. Unless your computer is very very old, it should work.

According to [a llama.cpp discussion thread](https://github.com/ggerganov/llama.cpp/issues/13), here are the memory requirements:

- 7B => ~4 GB
- 13B => ~8 GB
- 30B => ~16 GB

### Good to know
- All download data will be downloaded at `~/catai` folder by default.
- The download is multi-threaded, so it may use a lot of bandwidth, but it will download faster!

## API
There is also a simple API that you can use to ask the model questions.
```js
const response = await fetch("http://127.0.0.1:3000/question", {
    headers: {
        'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        question: "What is the meaning of life?"
    })
});

const {text, error} = await response.json();
```

## Into details
- ### [Configuration](./docs/configuration.md)

- ### [Troubleshooting](./docs/troubleshooting.md)

- ### [Development](./docs/development.md)

- ### [Contributing](./CONTRIBUTING.md)

## Docker
Right now it is in early stages, but you can use it like this:
```bash
docker run -p 3000:3000 npmcatai/catai:latest
```

## License

This project use [Llama.cpp](https://github.com/ggerganov/llama.cpp) to run Alpaca models on your computer.
So any license applied to Llama.cpp is also applied to this project.

## Credits
The GPT frontend is built on top of the chatGPT [Frontend mimic](https://github.com/nisabmohd/ChatGPT)


<br />

<div align="center" width="360">
    <img alt="Star please" src="./demo/star.please.png" style="border-radius: 12px" width="360px" margin="auto" />
    <br/>
    <p align="right">
        <i>If you like this repo, star it ✨</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </p>
</div>