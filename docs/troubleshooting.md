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

## Cuda Support

In case you have a GPU that supports CUDA, but the server doesn't recognize it, you can try to install the CUDA toolkit,
and rebuild the binaries.

Rebuild the binaries with CUDA support:

```
catai cpp --cuda
```

In case of an error, check the cuda
troubleshooting [here](https://withcatai.github.io/node-llama-cpp/guide/CUDA#fix-the-failed-to-detect-a-default-cuda-architecture-build-error).

## Unsupported processor / Exit without error

In case you have an unsupported processor, you can try to rebuild the binaries.

```
catai cpp
```
