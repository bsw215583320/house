const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: '../../build/icons/house.png',
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences:{
      nodeIntegration: true
    }

  })



  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready',
function(){
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu)
  createWindow()
}
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
let template = [
  {
    label: 'Edit ( 操作 )',
    submenu: [{
      label: 'Copy ( 复制 )',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste ( 粘贴 )',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Reload ( 重新加载 )',
      accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          // on reload, start fresh and close any old
          // open secondary windows
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
              if (win.id > 1) {
                win.close()
              }
            })
          }
          focusedWindow.reload()
        }
      }
    }]
  },
  {
    label: 'Window ( 窗口 )',
    role: 'window',
    submenu: [{
      label: 'Minimize ( 最小化 )',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Close ( 关闭 )',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      label: '切换开发者工具',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    },{
      type: 'separator'
    }]
  },
  {
    label: 'Help ( 帮助 ) ',
    role: 'help',
    submenu: [{
      label: 'FeedBack ( 意见反馈 )',
      click: function () {
        electron.shell.openExternal('https://github.com/bsw215583320/house/issues')
      }
    }]
  }
]

