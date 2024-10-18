import { app, BrowserWindow, ipcMain, Menu, screen, Tray } from "electron";
import path from "path";
import { isDev, isMac } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { db } from "./connections/mongodb.js";
import { ObjectId } from "mongodb";

let forceClose = false;

app.on("ready", async () => {
	const WINDOW_WIDTH = 1000;
	const WINDOW_HEIGHT = 800;
	const mainWin = new BrowserWindow({
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		// frame: true, // Hide window frame
		// alwaysOnTop: false,
		// transparent: true,
		// resizable: true,
		webPreferences: {
			preload: getPreloadPath("/preload.cjs"),
		},
	});

	mainWin.webContents.send("receive", [{ id: 1 }, { id: 2 }]);

	ipcMain.handle("fetch", () => {
		return {
			id: 3,
		};
	});

	if (!db.isConnected) {
		await db.connect();
	}
	ipcMain.handle("calendar:read", () =>
		db.tasksCollection.findOne({
			account: new ObjectId("671283cef34eba01f0ec96eb"),
		}),
	);

	ipcMain.on("frame:grow", () => {
		const { width, height } = screen.getPrimaryDisplay().workAreaSize;
		mainWin.setSize(width, height, true);
		mainWin.setPosition(0, 0, true);
	});
	ipcMain.on("frame:shrink", () => {
		mainWin.setSize(WINDOW_WIDTH, WINDOW_HEIGHT, true);
	});

	// Warning: If those code bellow is declare before event listener, it can create some usual bug like: "No handler registered ..."
	if (isDev) {
		mainWin.webContents.openDevTools();
		await mainWin.loadURL("http://localhost:3000");
	} else {
		await mainWin.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
	}
	mainWin.on("close", (e) => {
		if (forceClose === false) {
			e.preventDefault();
			mainWin.hide();
		}
	});
	createTray(mainWin);
});
function createTray(mainWindow: BrowserWindow) {
	const tray = new Tray(path.join(app.getAppPath(), "/src/ui/media/favicon.ico"));

	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Open app",
			click: () => {
				mainWindow.show();
			},
		},
		{
			label: "Quit app",
			click: () => {
				forceClose = true;
				mainWindow.close();
				app.quit();
			},
		},
	]);

	tray.setToolTip("To do list");
	tray.setContextMenu(contextMenu);

	tray.on("double-click", () => {
		mainWindow.show();
	});
}

app.on("window-all-closed", () => {
	if (isMac) app.quit();
});
