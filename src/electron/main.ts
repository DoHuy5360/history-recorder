import { app, BrowserWindow, ipcMain, Menu, screen, Tray } from "electron";
import path from "path";
import { isDev, isMac } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { db } from "./connections/mongodb.js";
import { ObjectId } from "mongodb";

let forceClose = false;

app.on("ready", async () => {
	const mainWin = new BrowserWindow({
		center: true,
		title: "History Recorder",
		// alwaysOnTop: true,
		// frame: true, // Hide window frame
		// alwaysOnTop: false,
		// transparent: true,
		// resizable: true,
		webPreferences: {
			preload: getPreloadPath("/preload.cjs"),
		},
	});
	mainWin.maximize();

	mainWin.webContents.send("receive", [{ id: 1 }, { id: 2 }]);

	ipcMain.handle("fetch", () => {
		return {
			id: 3,
		};
	});

	if (!db.isConnected) {
		await db.connect();
	}
	ipcMain.handle("calendar:read", async (e, data) => {
		const calendar: DataTask<ObjectId | string> | null = await db.tasksCollection.findOne({
			account: new ObjectId("671283cef34eba01f0ec96eb"),
		});
		calendar?.months[data.month - 1].days.forEach((day: any) => {
			if (day.tasks.length > 0) {
				day.tasks.forEach((task: any) => {
					task._id = task._id.toString();
				});
			}
			if (day.events.length > 0) {
				day.events.forEach((event: any) => {
					event._id = event._id.toString();
				});
			}
		});
		return {
			data: calendar?.months[data.month - 1],
		};
	});
	ipcMain.handle("calendar:add", async (e, data) => {
		console.log(data);
		const monthIndex = data.month - 1;
		const _id = new ObjectId();
		const { acknowledged } = await db.tasksCollection.updateOne(
			{ _id: ObjectId.createFromHexString("671284279179b6b8e871a5ea"), [`months.${monthIndex}.days.day`]: data.day },
			{
				$push: {
					[`months.${monthIndex}.days.$.tasks`]: { _id, ...data.record },
				},
			},
		);
		return {
			acknowledged,
			record: {
				_id: _id.toString(),
				...data.record,
			},
		};
	});
	ipcMain.handle("calendarEvent:create", async (e, data) => {
		const monthIndex = data.month - 1;
		const _id = new ObjectId();
		const { acknowledged } = await db.tasksCollection.updateOne(
			{ _id: ObjectId.createFromHexString("671284279179b6b8e871a5ea"), [`months.${monthIndex}.days.day`]: data.day },
			{
				$push: {
					[`months.${monthIndex}.days.$.events`]: { _id, ...data.record },
				},
			},
		);
		return {
			acknowledged,
			record: {
				_id: _id.toString(),
				...data.record,
			},
		};
	});

	ipcMain.handle("calendar:update", async (e, data: { _id: string; record: any }) => {
		console.log("Request update task by id: ", data._id);
		const taskIndex = data;
		const { acknowledged, modifiedCount, matchedCount, upsertedCount, upsertedId } = await db.tasksCollection.updateOne(
			{ "months.days.tasks._id": ObjectId.createFromHexString(data._id) },
			{
				$set: {
					// [`months.$[].days.$[].tasks.$[].project`]: "<New Project Name>",
					[`months.$[].days.$[].tasks.$[task].name`]: data.record.name,
					// [`months.$[].days.$[].tasks.$[].status`]: "<New Status>",
					// [`months.$[].days.$[].tasks.$[].createdAt`]: "<New Time>",
				},
			},
			{
				arrayFilters: [{ "task._id": ObjectId.createFromHexString(data._id) }],
			},
		);
		console.log(acknowledged, modifiedCount, matchedCount, upsertedCount, upsertedId);
		return { acknowledged };
	});

	ipcMain.handle("calendar:delete", async (e, data: { _id: string }) => {
		console.log("Request delete task by id: ", data._id);
		const { acknowledged, modifiedCount, matchedCount, upsertedCount, upsertedId } = await db.tasksCollection.updateOne(
			{ "months.days.tasks._id": ObjectId.createFromHexString(data._id) },
			{
				$pull: {
					"months.$[].days.$[].tasks": {
						_id: ObjectId.createFromHexString(data._id),
					},
				},
			},
		);
		console.log(acknowledged, modifiedCount, matchedCount, upsertedCount, upsertedId);
		return { acknowledged };
	});

	ipcMain.on("frame:grow", () => {
		const { width, height } = screen.getPrimaryDisplay().workAreaSize;
		mainWin.setSize(width, height, true);
		mainWin.setPosition(0, 0, true);
	});
	ipcMain.on("frame:shrink", () => {
		mainWin.setSize(600, 400, true);
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
