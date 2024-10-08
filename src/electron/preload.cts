const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	de: (callback: Function) => {
		ipcRenderer.on("display:de", (_, data) => {
			console.log(data);
			callback(data);
		});
	},
});
