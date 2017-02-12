const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron')
const ipc = electron.ipcMain
const Menu = electron.Menu
const Tray = electron.Tray

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('close', function (event){
		if(!app.isQuitting) {
			event.preventDefault()
			win.hide();
		}
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    //win = null
		return false;
  })


  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


let appIcon = null

ipc.on('put-in-tray', function (event) {
	if (appIcon == null) {
		const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
		const iconPath = path.join(__dirname, iconName)
		appIcon = new Tray(iconPath)
		const contextMenu = Menu.buildFromTemplate([{
			label: 'quit',
			click: function () {
				app.isQuitting = true;
				app.quit();
			}
		}, 
		{ 
			label: 'Show App', 
			click: function() {
				win.show();
			}
		}

		])
		appIcon.setTitle("Hello");
		appIcon.setToolTip('Habit Pom')
		appIcon.setContextMenu(contextMenu)
	}
})

ipc.on('update-tray', function(event, string) {
		appIcon.setToolTip(string)
})

ipc.on('remove-tray', function () {
  appIcon.destroy();
	app.quit();
})

app.on('window-all-closed', function () {
  if (appIcon) appIcon.destroy()
})
