import {App} from "@tinyhttp/app";
import { adminRouter } from "./admin/index.js";
import {chatRouter} from './chat/index.js';

export const apiRouter = new App();

apiRouter.use("/admin", adminRouter);
apiRouter.use("/chat", chatRouter);