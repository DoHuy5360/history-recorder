import { app, BrowserWindow, ipcMain, screen } from "electron";
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
		await mainWin.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	}
	mainWin.webContents.send("receive", [{ id: 1 }, { id: 2 }]);

	ipcMain.handle("fetch", () => {
		return {
			id: 3,
		};
	});
	ipcMain.on("popup:open", () => {
		createPopupWindow();
	});
});
let popupWindow: BrowserWindow | null;
async function createPopupWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	const WINDOW_WIDTH = 600;
	const WINDOW_HEIGHT = 400;
	const WINDOW_MARGIN = 10;

	popupWindow = new BrowserWindow({
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		x: width - (WINDOW_WIDTH + WINDOW_MARGIN),
		y: height - (WINDOW_HEIGHT + WINDOW_MARGIN),
		frame: true, // Hide window frame
		alwaysOnTop: true,
		transparent: true,
		resizable: false,
		webPreferences: {
			// nodeIntegration: true, // allow to use node functions in browser directly
			contextIsolation: true, // opposite to nodeIntegration, required for using global api communicate ipc
			// preload: path.join(__dirname, "de.js"),
		},
	});
	if (isDev) {
		popupWindow.webContents.openDevTools();
		await popupWindow.loadURL("http://localhost:3000/de");
	} else {
		await popupWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	}
}
