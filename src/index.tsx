import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import ViewManager from './ViewManager';
import * as serviceWorker from './serviceWorker';
import DataController from './controllers/DataController';

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
        },
    }
}

DataController.Init().then(() => {
    DataController.loadConfig().then(() => {
        DataController.loadPeers().then(() => {
            DataController.loadFiles().then(() => {
                DataController.RegisterSaveStates();
                window.remoteApps = {
                    SB:false
                };
                window.ReactEntryPoint = ReactDOM.render(<ViewManager />, document.getElementById('root'));
                serviceWorker.unregister();
            });
        });
    });
}).catch(() => {
    //error !? ??!  ?!! !??
});