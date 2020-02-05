import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
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
    //console.log('Initialized...')
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
                //console.log(er);
            })
        }).catch((er) => {
            //console.log('failed to load peers');
        });
    }).catch((er) => {
        //console.log(er);
    })
}).catch(() => {
    //error !? ??!  ?!! !??
    //console.log('Failed to initialize DataController');
});