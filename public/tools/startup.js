class RDMGRElectronStartup
{
    constructor()
    {
        this.Electron = window.require('electron');
        this.PATH = require('path');
        this.App = this.Electron.app;
        this.BW = this.Electron.BrowserWindow;
        this.Dev = process.defaultApp;

        this.MainWindow = null;
        this.CaptureWindow = null;

        this.App.on('ready', () => {
            this.createWindows();
        });

        this.App.on('window-all-closed', () => {
            if(process.platform !== 'darwin') {
                this.App.quit();
            }
        });

        this.App.on('activate', () => {
            if(this.MainWindow === null)
            {
                this.createMainWindow();
            }

            if(this.CaptureWindow === null)
            {
                this.createCaptureWindow();
            }
        });
    }

    createWindows()
    {
        this.createMainWindow();
        //this.createCaptureWindow();
    }

    createMainWindow()
    {
        this.MainWindow = new this.BW({
            width:1280,
            height:720,
            title:"RDMGR : Control",
            webPreferences:{
                webSecurity:false
            }
        });
        this.MainWindow.on('closed', () => {
            this.MainWindow = null;
        });

        let url = "http://localhost:3001/index.html?control";
        if(!this.Dev) {
            url = this.PATH.join(__dirname, "index.html?control");
        }
        this.MainWindow.loadURL(url);
    }

    createCaptureWindow()
    {
        this.CaptureWindow = new this.BW({
            width:1280,
            height:720,
            title:"RDMGR : Capture",
            webPreferences:{
                webSecurity:false
            }
        });

        this.CaptureWindow.on('closed', () => {
            this.CaptureWindow = null;
        });

        let url = "http://localhost:3001/index.html?capture";
        if(!this.Dev) {
            url = this.PATH.join(__dirname, "index.html?capture");
        }
        this.CaptureWindow.loadURL(url);
    }
}

module.exports = RDMGRElectronStartup;