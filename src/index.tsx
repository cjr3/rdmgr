import React from 'react';
import ReactDOM from 'react-dom';
import 'index.scss';
import ViewManager from './ViewManager';
import * as serviceWorker from './serviceWorker';
import DataController from './controllers/DataController';

declare global {
    interface Window{
        ReactEntryPoint:any,
        RDMGR:any
    }
}

DataController.Init();
DataController.loadConfig().then(() => {
    DataController.loadPeers().then(() => {
        DataController.loadFiles().then(() => {
            DataController.RegisterSaveStates();
            window.ReactEntryPoint = ReactDOM.render(<ViewManager />, document.getElementById('root'));
            serviceWorker.unregister();
        });
    });
});