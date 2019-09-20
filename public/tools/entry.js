window.RDMGR = require('electron').remote.getGlobal("RDMGR");

/**
 * Initializes the control window
 * @param {DataController} controller 
 */
function initControlServer(controller) {
    window.LocalServer = new P2PServer(controller.getPeers(true), false);
    window.LocalServer.Init(controller);
}

/**
 * Initializes the server for the capture window
 * @param {DataController} controller 
 */
function initCaptureServer(controller) {
    window.LocalServer = new P2PServer(controller.getPeers(true), true);
    window.LocalServer.Init();
}