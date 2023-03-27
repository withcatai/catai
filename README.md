# UseAI

Run Alpaca model on your computer with a chat ui.

Inspired by [Dalai](https://github.com/cocktailpeanut/dalai) and [Alpaca.cpp](https://github.com/antimatter15/alpaca.cpp)

## Installation & Use

```bash
npm install -g useai

useai install 7B
useai serve
```

![useai](https://github.com/ido-pluto/useai/blob/main/demo/chat.gif)

## Intro

You can use any Alpaca model as long as your computer can handle it.
```bash
useai install 13B
```

If you want to switch between models you can use `useai use` command.
```bash
useai use 7B
```

### Cross-platform
You can use it on Windows, Linux and Mac.

### Memory usage
Runs on most modern computers. Unless your computer is very very old, it should work.

According to [a llama.cpp discussion thread](https://github.com/ggerganov/llama.cpp/issues/13), here are the memory requirements:

- 7B => ~4 GB
- 13B => ~8 GB
- 30B => ~16 GB

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

## License

This project use [Alpaca.cpp](https://github.com/antimatter15/alpaca.cpp) to run Alpaca models on your computer.
So any license applied to Alpaca.cpp is also applied to this project.
