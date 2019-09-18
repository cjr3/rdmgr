window.RDMGR = require('electron').remote.getGlobal("RDMGR");

function initControlServer(controller) {
    //const {P2PServer} = require('./LocalServer');
    window.LocalServer = new P2PServer(controller.getConfig().UR.Settings, false, controller.getPeers(true));
    window.LocalServer.Init(controller);
}

function initCaptureServer(controller) {
    window.LocalServer = new P2PServer(controller.getConfig().UR.Settings, true);
    window.LocalServer.Init();
}