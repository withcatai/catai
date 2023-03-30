# CatAI

[![npm version](https://badge.fury.io/js/catai.svg)](https://badge.fury.io/js/catai)
[![npm downloads](https://img.shields.io/npm/dt/catai.svg)](https://www.npmjs.com/package/catai)
[![GitHub license](https://img.shields.io/github/license/ido-pluto/catai)](./LICENSE)

Run Alpaca model on your computer with a chat ui.

> Your own AI assistant run locally on your computer.

Inspired by [Dalai](https://github.com/cocktailpeanut/dalai) and [Alpaca.cpp](https://github.com/antimatter15/alpaca.cpp)

## Installation & Use

```bash
npm install -g catai

catai install 7B
catai serve
```

![catai](https://github.com/ido-pluto/catai/blob/main/demo/chat.gif)

## Features
- Auto detect programming language 🧑‍💻
- Auto detect code block 📃
- Click on user icon to show original message 💬
- Real time text streaming ⏱️

## Intro

You can use any Alpaca model as long as your computer can handle it.
```bash
catai install 13B
```

If you want to switch between models you can use `catai use` command.
```bash
catai use 7B
```

### Cross-platform
You can use it on Windows, Linux and Mac.

This package from version 1.6.0. demands on [llama-node](https://github.com/hlhr202/llama-node)
Witch supports:

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

### Configuration
You can change the configuration by edition the `config.js` file.
```bash
catai config --editor [editor]
```

After you change the configuration, you need to restart the server.

- 💡To increase the model understanding, try change the `context` size.
- 💡To increase the model output, try change the `numPredict` size.

## Development

If you want to run the source code locally, you can follow the steps below.

To run the client.
```bash
cd client
npm install
npm run dev
```

To run the server.
```bash
cd server
npm install
npm run install-model 7B
npm start
```

## Troubleshooting

### Error loading model OR executable error
Try change the config:
```js
export const SELECTED_BINDING = 'node-llama';
```

It may be slower, but it has more chance to work.

### Windows Subsystem for Linux has no installed distributions

Problem with the dependency `zx`, try to run inside `git-bash`.

## License

This project use [Alpaca.cpp](https://github.com/antimatter15/alpaca.cpp) to run Alpaca models on your computer.
So any license applied to Alpaca.cpp is also applied to this project.
