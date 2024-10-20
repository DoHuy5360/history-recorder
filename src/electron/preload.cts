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
	read: (data: any) => ipcRenderer.invoke("calendar:read", data),
	add: (data: any) => ipcRenderer.invoke("calendar:add", data),
	delete: (data: any) => ipcRenderer.invoke("calendar:delete", data),
});

contextBridge.exposeInMainWorld("frame", {
	shrink: () => {
		ipcRenderer.send("frame:shrink");
	},
	grow: () => {
		ipcRenderer.send("frame:grow");
	},
});
