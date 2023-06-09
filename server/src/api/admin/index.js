import { App } from "@tinyhttp/app";
import { ADMIN_SETTINGS, RESTART_EXIT_CODE } from "../../const.js";
import { settingsRouter } from "./settings.js";

export const adminRouter = new App();

adminRouter.use((req, res, next) => {
    if(!ADMIN_SETTINGS){
        res.status(401).send("Admin settings are disabled");
        return;
    }
    next();
});

// check is there access to admin API
adminRouter.get("", (req, res) => {
    res.json({ok: true});
});

adminRouter.post("/restart", (req, res) => {
    res.json({ok: true});
    process.exit(RESTART_EXIT_CODE);
});

adminRouter.use("/settings", settingsRouter);