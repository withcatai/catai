# Troubleshooting

## Installation

### Installing Node.js in Linux/MacOS

You can install Node.js with [nvm](https://github.com/nvm-sh/nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 19
```

### Windows installation/use error

Problem with the dependency `zx`, try to run inside `git-bash`.

### Not loading module "atk-bridge"

Problem with opening in default browser, try to change the environment variable:
```bash
export CATAI_OPEN_IN_BROWSER = false;
```

## Running model

### Model not supported
CatAI use llama.cpp, so only model that supported by llama.cpp can be used.
https://github.com/ggerganov/llama.cpp#description

### Model context size
Small context can make the model for sudden stop, try to increase the context size.
```bash
catai config --edit [editor]
```

```js
export const SETTINGS_NODE_LLAMA = {
    nCtx: 4096,
...
```