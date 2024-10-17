const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	receive: (callback: Function) => {
		ipcRenderer.on("receive", (_, params) => {
			callback(params);
		});
	},
	fetch: () => ipcRenderer.invoke("fetch"),
} satisfies Window["electron"]);

contextBridge.exposeInMainWorld("popup", {
	open: () => {
		ipcRenderer.send("popup:open");
	},
});
