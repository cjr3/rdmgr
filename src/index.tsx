import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import './css/1920x1080.scss';
import ViewManager from './ViewManager';
import * as serviceWorker from './serviceWorker';
import DataController from './controllers/DataController';
import PeersController from 'controllers/PeersController';

declare global {
    interface Window{
        ReactEntryPoint?:any;
        RDMGR?:any;
        LocalServer?:any;
        IPC?:any;
        initControlServer?:any;
        initCaptureServer?:any;
        onSelectFile?:Function|null;
        onSelectFolder?:Function|null;
        onPeerStream:Function|null;
        onPeerStreamClose:Function|null;
        onPeerStreamError:Function|null;
        onDialogClose:Function|undefined|null;
        onDialogAccept:Function|undefined|null;
        client?:any;
        remoteApps:{
            SB:boolean;
            ROS:boolean;
        },
    }
}

DataController.Init().then(() => {
    DataController.LoadConfig().then(() => {
        PeersController.Load().then(() => {
            DataController.Load().then(() => {
                DataController.RegisterSaveStates();
                window.remoteApps = {
                    SB:false,
                    ROS:false
                };
                window.ReactEntryPoint = ReactDOM.render(<ViewManager />, document.getElementById('root'));
                serviceWorker.unregister();
            }).catch((er) => {
                
            })
        }).catch((er) => {
            
        });
    }).catch((er) => {
        
    })
}).catch(() => {
    //error !? ??!  ?!! !??
});