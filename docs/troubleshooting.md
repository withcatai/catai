## Troubleshooting

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