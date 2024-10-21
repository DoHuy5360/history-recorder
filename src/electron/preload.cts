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
	update: (data: any) => ipcRenderer.invoke("calendar:update", data),
	delete: (data: any) => ipcRenderer.invoke("calendar:delete", data),
});

contextBridge.exposeInMainWorld("calendarEvent", {
	read: (data: any) => ipcRenderer.invoke("calendarEvent:read", data),
	create: (data: any) => ipcRenderer.invoke("calendarEvent:create", data),
	update: (data: any) => ipcRenderer.invoke("calendarEvent:update", data),
	delete: (data: any) => ipcRenderer.invoke("calendarEvent:delete", data),
});

contextBridge.exposeInMainWorld("frame", {
	shrink: () => {
		ipcRenderer.send("frame:shrink");
	},
	grow: () => {
		ipcRenderer.send("frame:grow");
	},
});
