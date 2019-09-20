import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import ViewManager from './ViewManager';
import * as serviceWorker from './serviceWorker';
import DataController from './controllers/DataController';

declare global {
    interface Window{
        ReactEntryPoint?:any,
        RDMGR?:any,
        LocalServer?:any,
        IPC?:any,
        initControlServer?:any,
        initCaptureServer?:any,
        onSelectFile?:Function|null,
        onSelectFolder?:Function|null,
        client?:any
    }
}

DataController.Init().then(() => {
    DataController.loadConfig().then(() => {
        DataController.loadPeers().then(() => {
            DataController.loadFiles().then(() => {
                DataController.RegisterSaveStates();
                window.ReactEntryPoint = ReactDOM.render(<ViewManager />, document.getElementById('root'));
                serviceWorker.unregister();
            });
        });
    });
}).catch(() => {
    //error !? ??!  ?!! !??
});