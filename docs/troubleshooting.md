# Troubleshooting

Some common problems and solutions.


## I can't connect to the server

If the server is disconnected without any error, it's probably a problem with the llama.cpp binaries.

The solution is to recompile the binaries:
```bash
catai cpp
```

## How to change the download location?

You can configure the download location by changing the `CATAI_DIR` environment variable.

More environment variables configuration can be found in the [configuration](https://withcatai.github.io/catai/interfaces/_internal_.Config.html#CATAI_DIR)
