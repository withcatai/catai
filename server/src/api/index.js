import {App} from "@tinyhttp/app";
import { adminRouter } from "./admin/index.js";

export const apiRouter = new App();

apiRouter.use("/admin", adminRouter);