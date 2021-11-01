/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

const wfa = require('write-file-atomic');
import { existsSync, mkdirSync, readFile, statSync, readFileSync } from 'fs';

app.setName('RDMGR');
let FOLDER_MAIN = app.getPath('appData') + "/" + app.getName();
if(process.env.NODE_ENV === 'development') {
    FOLDER_MAIN = 'c:/ProgramData/RDMGRData';
}

const configFileName = path.join(FOLDER_MAIN, 'records', 'state.config.json');

let showCaptureWindow = true;
let captureWindowWidth = 1280;
let captureWindowHeight = 720;
let captureWindowX = 0;
let captureWindowY = 0;

try {
  const stat = statSync(configFileName);
  if(stat && stat.isFile && stat.isFile()) {
    const datab = readFileSync(configFileName);
    if(datab) {
      const json = JSON.parse(datab.toString());
      if(json.Misc && json.Misc.CaptureWindow) {
        const settings = json.Misc.CaptureWindow;
        if(typeof(settings.display) === 'boolean')
          showCaptureWindow = settings.display;

        if(showCaptureWindow && typeof(settings.width) === 'number' && typeof(settings.height) === 'number') {
          captureWindowWidth = settings.width;
          captureWindowHeight = settings.height;
          if(typeof(settings.x) === 'number' && typeof(settings.y) === 'number') {
            captureWindowX = settings.x;
            captureWindowY = settings.y;
          }
        }
      }
    }
  }
} catch(er) {
  // throw er;
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let captureWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  //control
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    icon: getAssetPath('icon.png'),
    frame:false,
    //resizable:false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity:false,
      allowRunningInsecureContent:true,
      enableRemoteModule:true,
      backgroundThrottling:false
    },
  });

  //capture
  if(showCaptureWindow) {
    captureWindow = new BrowserWindow({
      show: false,
      width: captureWindowWidth,
      height: captureWindowHeight,
      x:captureWindowX,
      y:captureWindowY,
      icon: getAssetPath('icon.png'),
      frame:false,
      //resizable:false,
      webPreferences: {
        nodeIntegration: true,
        webSecurity:false,
        allowRunningInsecureContent:true,
        enableRemoteModule:true,
        //this must be set to false so the capture window
        //can be captured by streaming software
        //otherwise, rendering will be paused if minimized
        //or placed into the background by a full-screen/maximized window
        backgroundThrottling:false
      },
    });
  }

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // captureWindow.loadURL(`file://${__dirname}/capture.html`)
  if(captureWindow)
    captureWindow.loadURL(`file://${__dirname}/index.html?capture=true`)

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  if(captureWindow) {
    captureWindow.webContents.on('did-finish-load', () => {
      if (!captureWindow) {
        throw new Error('"captureWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        captureWindow.minimize();
      } else {
        captureWindow.show();
        // captureWindow.focus();
      }
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if(captureWindow) {
    captureWindow.on('closed', () => {
      captureWindow = null;
    });
  }

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Don't open ANY urls on the capture window
  if(captureWindow) {
    captureWindow.webContents.on('new-window', (ev) => {
      ev.preventDefault();
    });
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('exit-app', async () => {
  if(captureWindow)
    captureWindow.close();
  if(mainWindow)
    mainWindow.close();
  return false;
})

//write to a file and call the callback when done/error
ipcMain.handle('save-file', async (ev, filename:string, data:string|Buffer, options:any) => {
  try {
    if(filename && filename.length) {
      await wfa(filename, data, {
        ...options
      });
      return true;
    }
  } catch(er) {
  }
  return false;
});

//config capture window
ipcMain.handle('capture-config', (ev, values) => {
  try {
    if(typeof(values) === 'object' && values) {
      if(typeof(values.width) === 'number' && typeof(values.height) === 'number') {
        if(captureWindow && captureWindow.setBounds) {
          captureWindow.setBounds({
            width:values.width,
            height:values.height,
            x:typeof(values.x) === 'number' ? values.x : 0,
            y:typeof(values.y) === 'number' ? values.y : 0
          });
        }
      }
    }
  } catch(er) {

  }

  return true;
});

//get info about the capture window
ipcMain.handle('capture-info', (ev, values) => {
  let width = 0;
  let height = 0;
  let x = 0;
  let y = 0;
  let monitorId = 0;
  try {
    if(captureWindow && captureWindow.getBounds) {
      const bounds = captureWindow.getBounds();
      width = bounds.width;
      height = bounds.height;
      x = bounds.x;
      y = bounds.x;
    }
  } catch(er) {

  }

  return {
    width:width,
    height:height,
    x:x,
    y:y,
    monitorId:monitorId
  }
});

//check and create a directory if it doesn't exist
ipcMain.on('check-directory', (ev, name) => {
  try {
    if(existsSync(name)) {
      ev.returnValue = true;
    }
    else {
      mkdirSync(name);
      ev.returnValue = existsSync(name);
    }
  } catch(er) {
    // console.error(er);
  }

  ev.returnValue = false;
});

//check that a file exists and create it if it doesn't
ipcMain.on('check-file', async (ev, filename:string, data:string|Buffer, options:any) => {
  try {
    if(filename && filename.length) {
      if(existsSync(filename)) {
        ev.returnValue = true;
      } else {
        await wfa(filename, data || '', {...options});
        if(existsSync(filename))
          ev.returnValue = true;
      }
    }
  } catch(er) {

  }
  ev.returnValue = false;
});

//read a file, and return as the indicated type
ipcMain.on('read-file', (ev, filename:string) => {
  try {
    if(filename && filename.length) {
      const stat = statSync(filename);
      if(stat && stat.isFile && stat.isFile()) {
        readFile(filename, (err:any, data:Buffer) => {
          if(err)
            ev.returnValue = err;
          else
            ev.returnValue = data.toString();
        });
      } else {
        throw new Error('Failed to read file: File not found or is a directory.')
      }
    } else {
      ev.returnValue = '';
    }
  } catch(er) {
    ev.returnValue = er;
  }
});

//send data from control window to capture window
ipcMain.handle('control-capture', (ev, data) => {
  //ev.sender.send('control-capture-reply', true);
  if(captureWindow && captureWindow.webContents && captureWindow.webContents.send) {
    captureWindow.webContents.send('control-capture-receive', data);
  }
  return true;
});

//send data from capture window to control window
ipcMain.handle('capture-control', (ev, data) => {
  // ev.sender.send('capture-control-reply', true);
  if(mainWindow && mainWindow.webContents && mainWindow.webContents.send) {
    mainWindow.webContents.send('capture-control-receive', data);
  }
  return true;
});