import {App} from "@tinyhttp/app";
import { getSelectedBinding } from "../../model-bind/binding.js";
import { jsonModelSettings, saveModelSettings } from "../../model-settings.js";

export const settingsRouter = new App();
const modelBinding = getSelectedBinding();

settingsRouter.get("", (req, res) => {
    res.json(modelBinding.modelSettings);
});

settingsRouter.post("", async (req, res) => {
    jsonModelSettings.metadata[jsonModelSettings.model] = modelBinding.modelSettings = req.body;
    await saveModelSettings();

    res.json({ok: true});
});