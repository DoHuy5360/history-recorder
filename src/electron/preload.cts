const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	receive: (callback: Function) => {
		ipcRenderer.on("receive", (_, params) => {
			callback(params);
		});
	},
	fetch: () => ipcRenderer.invoke("fetch"),
} satisfies Window["electron"]);

contextBridge.exposeInMainWorld("calendar", {
	read: () => ipcRenderer.invoke("calendar:read"),
});

contextBridge.exposeInMainWorld("frame", {
	shrink: () => {
		ipcRenderer.send("frame:shrink");
	},
	grow: () => {
		ipcRenderer.send("frame:grow");
	},
});
