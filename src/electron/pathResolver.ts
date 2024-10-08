import path from "path";
import { app } from "electron";
import { isDev } from "./util.js";

export const getPreloadPath = (preloadFileName: string): string =>
	path.join(
		app.getAppPath(),
		isDev ? "." : "..",
		"/dist-electron",
		preloadFileName,
	);
