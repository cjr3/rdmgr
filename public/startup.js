/**
 * Main Startup script for application.
 */

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

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
        this.initServer = this.initServer.bind(this);

        /*
        //create express server
        this.ExpressApp = express();
        this.ExpressApp.get('/', function(req, res) {
            res.send('Hi!');
            res.end();
        });
        this.ExpressApp.use(bodyParser.json());
        this.ExpressApp.use(bodyParser.urlencoded({extended:true}));
        this.ExpressApp.use(express.static('public'));
        this.ExpressApp.use(cors({credentials:true, origin:true}));
        */

        let path = 'c:/ProgramData/RDMGR/files/rdmgr.config.json';
        if(fs.existsSync(path)) {
            let data = fs.readFileSync(path);
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
        }

        //start
        app.on('ready', () => {

            this.createWindows();

            //set globals
            global.RDMGR = {
                mainWindow:this.MainWindow,
                captureWindow:this.CaptureWindow,
                initServer:this.initServer
                //expressApp:this.ExpressApp
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

    async initServer(port, path) {
        return new Promise((res, rej) => {
            this.LocalExpressServer = this.ExpressApp.listen(port, () => {
                //get the network IP address
                // let timer = setInterval(() => {
                //     var interfaces = os.networkInterfaces();
                //     for (var k in interfaces) {
                //         for (var k2 in interfaces[k]) {
                //             var address = interfaces[k][k2];
                //             if (address.family === 'IPv4' && !address.internal) {
                //                 this.IPAddress = address.address;
                //                 clearInterval(timer);
                //                 return;
                //             }
                //         }
                //     }
                // }, 500);

                const ExpressPeerServer = require('peer').ExpressPeerServer;
                //attach the peer server
                this.PeerServer = ExpressPeerServer(this.LocalExpressServer, {
                    debug:4
                });
        
                //connect peerjs to the express server path
                this.ExpressApp.use(path, this.PeerServer);
                //this.Server.on('connection', this.onConnect);
                //this.Server.on('disconnect', this.onDisconnect);

                res([true, this.PeerServer]);
            });
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