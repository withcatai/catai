# Adding a model
If you want to add a model, you can follow the steps below.

- Check the model does not exist in the `models-links.json` file.
- Add the model to the `models-links.json` file
- In the end of the URL, and the commit-hash (if it from [Hugging Face](https://huggingface.co) or any other git control).

When you add an hash to the URL, you ensure that the model will have a backup URL.

# Adding a frontend
To add a new frontend, you need to follow the server protocol.
For an example see the following file: [chat.ts](https://github.com/ido-pluto/catai/blob/main/client/catai/src/utils/chat.ts)

The `config-model` is binding type.

If the binding type is `alpaca-cpp`, then where will a start message for the loading output of the model.