/**
 * Main Startup script for application.
 */

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

/**
 * Class for starting up electron.
 */
class ElectronStartup {
    constructor() {
        this.Width = 1280;
        this.Height = 720;
        this.BackgroundColor = "#000000";
        this.createWindows = this.createWindows.bind(this);
        this.CaptureWindow = null;
        this.MainWindow = null;
        this.DevMode = (typeof(process.defaultApp) == "boolean") ? process.defaultApp : false;
        this.ShowCaptureWindow = false;
        this.FullScreen = false;

        if(!fs.existsSync('c:/rdmgrdata/files2/rdmgr.config.json')) {
            app.exit();
        }
        
        let data = fs.readFileSync('c:/rdmgrdata/files2/rdmgr.config.json');
        if(data) {
            try {
                this.Config = JSON.parse(data);
                if(this.Config && this.Config.UR) {
                    this.ShowCaptureWindow = this.Config.UR.Capture;
                    this.FullScreen = this.Config.UR.FullScreen;
                }
            } catch(er) {

            }
        }

        //start
        app.on('ready', () => {

            this.createWindows();

            //set globals
            global.RDMGR = {
                mainWindow:this.MainWindow,
                captureWindow:this.CaptureWindow
            }

        });
        
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (this.MainWindow === null) {
                this.createControlWindow();
            }

            if(this.CaptureWindow === null) {
                this.createCaptureWindow();
            }
        });

        process.on('uncaughtException', function(er) {
            switch(er.code) {
                //server creation failed...
                case "EADDRINUSE" :
                    if(er.address === "::" || er.address === "127.0.0.1") {

                    }
                    break;

                default :
                    console.log(er)
                    break;
            }
        });
    }

    /**
     * Creates the needed windows
     */
    createWindows() {
        if(this.ShowCaptureWindow)
            this.createCaptureWindow();
        this.createControlWindow();
    }

    /**
     * Creates the control window, the user interface.
     */
    createControlWindow() {
        this.MainWindow = new BrowserWindow({
            width: this.Width, 
            height: this.Height,
            backgroundColor: this.BackgroundColor,
            autoHideMenuBar:true,
            title:"RDMGR : Control Window",
            fullscreen:this.FullScreen,
            frame:false,
            resizable:true,
            webPreferences:{
                webSecurity:false,
                nodeIntegration:true
            }
        });

        this.MainWindow.on('closed', () => {
            this.MainWindow = null;
            if(this.CaptureWindow !== null) {
                try {
                    this.CaptureWindow.close();
                } catch(er) {

                }
            }
            app.quit();
        });

        if(this.DevMode) {
            this.MainWindow.loadURL(`http://localhost:3001?control`);
        } else {
            this.MainWindow.loadURL(url.format({
                pathname:path.join(__dirname, '/index.html'),
                protocol:"file:",
                slashes:true
            }) + "?control");
        }
    }

    /**
     * Creates the capture window, which is used to display
     * the result of the control window to viewers.
     */
    createCaptureWindow() {
        this.CaptureWindow = new BrowserWindow({
            width:this.Width,
            height:this.Height,
            backgroundColor: this.BackgroundColor,
            autoHideMenuBar:true,
            frame:false,
            title:"RDMGR : Capture Window",
            webPreferences:{
                webSecurity:false,
                nodeIntegration:true
            }
        });
        this.CaptureWindow.on('closed', () => {
            this.CaptureWindow = null;
        });

        this.CaptureWindow.on('show', () => {
            let displays = app.screen.getAllDisplays();
            if(displays.length > 1) {
                let bounds = displays[1].bounds;
                this.CaptureWindow.setBounds({
                    x:bounds.x,
                    y:bounds.y,
                    width:this.Width,
                    height:this.Height
                });
            }
        });
        
        if(this.DevMode) {
            this.CaptureWindow.loadURL(`http://localhost:3001?capture`);
        } else {
            this.CaptureWindow.loadURL(url.format({
                pathname:path.join(__dirname, 'index.html'),
                protocol:"file:",
                slashes:true
            }) + "?capture");
        }
    }
}

module.exports = ElectronStartup;