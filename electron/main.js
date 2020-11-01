const { app, screen, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');   
const path = require('path');
 
let mainWindow;

function createWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width,
		height,
		titleBarStyle: "hiddenInset",
		resizable: false,
		// icon: path.join(__dirname, "assets/icons/icon_256x256.png")
    });

    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(startURL);
 
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createMenu() {
	const application = {
		label: "Application",
		submenu: [
			{
				label: "About Application",
				selector: "orderFrontStandardAboutPanel:"
			},
			{
				type: "separator"
			},
			{
				label: "Quit",
				accelerator: "Command+Q",
				click: () => {
					app.quit();
				}
			}
		]
	};

	const edit = {
		label: "Edit",
		submenu: [
			{
				label: "Undo",
				accelerator: "CmdOrCtrl+Z",
				selector: "undo:"
			},
			{
				label: "Redo",
				accelerator: "Shift+CmdOrCtrl+Z",
				selector: "redo:"
			},
			{
				type: "separator"
			},
			{
				label: "Cut",
				accelerator: "CmdOrCtrl+X",
				selector: "cut:"
			},
			{
				label: "Copy",
				accelerator: "CmdOrCtrl+C",
				selector: "copy:"
			},
			{
				label: "Paste",
				accelerator: "CmdOrCtrl+V",
				selector: "paste:"
			},
			{
				label: "Select All",
				accelerator: "CmdOrCtrl+A",
				selector: "selectAll:"
			}
		]
	};

	const template = [application, edit];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on("ready", () => {
	createWindow();
	createMenu();
});

app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
