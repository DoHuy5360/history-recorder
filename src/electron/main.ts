import { app, BrowserWindow } from "electron";
import path from "path";

app.on("ready", () => {
	const mainWin = new BrowserWindow({});
	mainWin.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
});
