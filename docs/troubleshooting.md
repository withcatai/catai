## Troubleshooting

### Installing Node.js in Linux/MacOS

You can install Node.js with [nvm](https://github.com/nvm-sh/nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 19
```

### Error loading model OR executable error
Try change the config:
```js
export const SELECTED_BINDING = 'alpaca-cpp';
```

It may be slower, but it has more chance to work with alpaca models.

### Windows installation error

Problem with the dependency `zx`, try to run inside `git-bash`.

### Not loading module "atk-bridge"

Problem with opening in default browser, try to change the environment variable:
```bash
export CATAI_OPEN_IN_BROWSER = false;
```