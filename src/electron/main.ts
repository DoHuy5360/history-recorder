import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", async () => {
	const mainWin = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath("/preload.cjs"),
		},
	});
	if (isDev) {
		mainWin.webContents.openDevTools();
		await mainWin.loadURL("http://localhost:3000");
	} else {
		await mainWin.loadFile(
			path.join(app.getAppPath(), "/dist-react/index.html"),
		);
	}
	mainWin.webContents.send("display:de", { de: 1 });
	// setInterval(() => {
	// }, 3000);
});
