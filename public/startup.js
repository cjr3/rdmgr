/**
 * Main Startup script for application.
 */

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
        this.ShowCaptureWindow = true;
        this.FullScreen = false;
        
        this.App = require('electron').app;
        this.BW = require('electron').BrowserWindow;

        //start
        this.App.on('ready', () => {

            this.createWindows();

            //set globals
            global.RDMGR = {
                mainWindow:this.MainWindow,
                captureWindow:this.CaptureWindow
            }

        });
        
        this.App.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        this.App.on('activate', () => {
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
                    //console.log(er)
                    break;
            }
        });
    }

    /**
     * Creates the needed windows
     */
    createWindows() {
        this.createControlWindow();
        if(this.ShowCaptureWindow)
            this.createCaptureWindow();
    }

    /**
     * Creates the control window, the user interface.
     */
    createControlWindow() {
        this.MainWindow = new this.BW({
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
            this.App.quit();
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
        this.CaptureWindow = new this.BW({
            width:this.Width,
            height:this.Height,
            backgroundColor: this.BackgroundColor,
            autoHideMenuBar:true,
            frame:false,
            resizable:false,
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