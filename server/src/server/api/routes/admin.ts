import {App} from '@tinyhttp/app';
import ENV_CONFIG from '../../../storage/config.js';
import {RESTART_EXIT_CODE} from '../../../storage/const.js';
import {getActiveModelSettings, updateActiveModelSettings} from '../../controllers/admin/models-settings.js';

export const adminRouter = new App();

adminRouter.use((req, res, next) => {
    if(!ENV_CONFIG.ADMIN_USE){
        res.status(401).send("Admin settings are disabled");
        return;
    }
    next();
});

// check is there access to admin API
adminRouter.get("/", (req, res) => {
    res.json({ok: true});
});

adminRouter.post("/restart", (req, res) => {
    res.json({ok: true});
    process.exit(RESTART_EXIT_CODE);
});

adminRouter.get("/settings", (req, res) => {
    res.json(getActiveModelSettings() || {});
});

adminRouter.post("/settings", async (req, res) => {
    await updateActiveModelSettings(req.body);

    res.json({ok: true});
});
