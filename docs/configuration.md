# Configuration

## Environment variables
You can change the configuration by setting the environment variables.
```bash
export CATAI_PORT=3000
export CATAI_OPEN_IN_BROWSER=true
export CATAI_MAX_ACTIVE_SESSIONS=5
export CATAI_DOWNLOAD_LOCATION=~/catai
```

** In Windows you need to use `set` instead of `export`.

## Additional via config file
You can change the configuration by edition the `config.js` file.
```bash
catai config --edit [editor]
```

After you change the configuration, you need to restart the server.

- 💡To increase the model understanding, try change the `context` size.
- 💡To increase the model output, try change the `numPredict` size.
