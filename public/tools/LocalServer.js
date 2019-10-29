/**
 * The local server and peer handler.
 * This exists outside of the document and windows, 
 * so all network processes happen in the background.
 * 
 * Commands can be listened to on the front-end.
 */

class P2PServer {
    constructor(peers, capture) {
        const express = window.require('express');
        const cors = require('cors');
        const {createStore} = require('redux');
        const bodyParser = require('body-parser');
        //this.Peer = require('peerjs').peerjs.Peer;
        this.Peer = Peer;
        this.Networker = require('net');
        const os = require('os');

        if(typeof(capture) !== "boolean")
            capture = false;

        this.PeerID = os.hostname();
        this.Port = 0;
        this.Path = "/p2p";
        this.IPAddress = "127.0.0.1";
        this.InitState = {
            Peers:{}
        }

        if(capture) {
            this.PeerID += "-CAP";
            this.Path = "/p2p-CAP";
        }

        this.LocalPeer = null;

        if(typeof(peers) === 'object' && peers instanceof Array) {
            peers.forEach((record) => {
                if(record.Host === this.IPAddress && this.LocalPeer === null) {
                    //local peer record
                    this.Port = record.Port;
                    if(capture)
                        this.Port = record.CapturePort;
                    this.PeerID = record.PeerID;
                    if(capture)
                        this.PeerID = record.PeerID + "-CAP";
                    this.LocalPeer = new LocalPeer(this.PeerID, "localhost", this.Port, this.Path);
                } else if(record.PeerID !== this.PeerID) {
                    //known peer record
                    let id = record.PeerID;
                    let port = record.Port;

                    if(capture) {
                        id += "-CAP";
                        if(id === this.PeerID)
                            return;
                        port = record.CapturePort;
                    }

                    if(this.LocalPeer !== null) {
                        //this.LocalPeer.addPeer(id, record.Host, port);
                    }

                    this.InitState.Peers[id] = {
                        ID:id,
                        Name:record.Name,
                        Host:record.Host,
                        Port:port,
                        Connected:false,
                        MediaConnected:false
                    };
                }
            })
        }
        if(this.LocalPeer === null) {
            this.LocalPeer = new LocalPeer(this.PeerID, "localhost", this.Port, this.Path);
        }

        for(let key in this.InitState.Peers) {
            let peer = this.InitState.Peers[key];
            this.LocalPeer.addPeer(peer.ID, peer.Host, peer.Port);
        }

        this.ExpressApp = express();
        this.ExpressApp.get('/', function(req, res) {
            res.send('Hi!');
            res.end();
        });
        
        this.LocalExpressServer = this.ExpressApp.listen(this.Port, () => {
            //change port if port was randomly assigned
            if(this.Port === 0) {
                this.Port = this.LocalExpressServer.address().port;
                if(this.LocalPeer !== null) {
                    this.LocalPeer.Port = this.Port;
                }
            }

            //get the network IP address
            let timer = setInterval(() => {
                var interfaces = os.networkInterfaces();
                for (var k in interfaces) {
                    for (var k2 in interfaces[k]) {
                        var address = interfaces[k][k2];
                        if (address.family === 'IPv4' && !address.internal) {
                            this.IPAddress = address.address;
                            clearInterval(timer);
                            return;
                        }
                    }
                }
            }, 500);
        });

        //enable parsing of JSON, URL encoded, cross-site, and static resources
        this.ExpressApp.use(bodyParser.json());
        this.ExpressApp.use(bodyParser.urlencoded({extended:true}));
        this.ExpressApp.use(express.static('public'));
        this.ExpressApp.use(cors({credentials:true, origin:true}));

        //this.ExpressApp = global.RDMGR.expressApp;

        //bindings
        this.Init = this.Init.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.updateData = this.updateData.bind(this);
        this.reducer = this.reducer.bind(this);
        this.LocalStore = createStore(this.reducer);
    }

    async _setupPeerServer() {
        return new Promise((res, rej) => {
            const ExpressPeerServer = require('peer').ExpressPeerServer;
            //attach the peer server
            this.Server = ExpressPeerServer(this.LocalExpressServer, {
                debug:4
            });
    
            //connect peerjs to the express server path
            this.ExpressApp.use(this.LocalPeer.Path, this.Server);
            this.Server.on('connection', this.onConnect);
            this.Server.on('disconnect', this.onDisconnect);
            res(true);
        });
    }

    async _setupSocketServer() {
        return new Promise((res, rej) => {
            let webs = window.require('ws');
            this.Server = new webs.Server({
                server:this.LocalExpressServer
            });
            this.Server.on('connection', (ws) => {
                ws.on('pong', () => {
                    console.log(`ws pong!`);
                });

                ws.on('message', (msg) => {
                    let j;
                    try {
                        j = JSON.parse(msg);
                    } catch(er) {

                    } finally {
                        console.log(j);
                    }
                });

                ws.on('error', () => {
                    console.log('socketed error!');
                })
            });
            this.ExpressApp.use(this.LocalPeer.Path, this.Server);

            res(true);
        });
    }

    /**
     * Triggered when a peer connects to the local server
     * @param {String} id 
     */
    async onConnect(id) {
        console.log(`${id} connected to server`);
        this.LocalPeer.receivePeer(id, true);
    }

    /**
     * Triggered when a peer disconnects from the local server
     * @param {String} id 
     */
    async onDisconnect(id) {
        console.log(`${id} disconnected from server.`)
        //this.LocalPeer.disconnectPeer(id);
        //this.LocalPeer.receivePeer(id);
    }

    /**
     * Initializes the server, and connects the local peer.
     */
    Init(controller) {
        this.controller = controller;
        if(this.controller) {
            this.remoteController = this.controller.subscribe(this.updateData);
        }

        const ExpressPeerServer = require('peer').ExpressPeerServer;
        //attach the peer server
        this.PeerServer = ExpressPeerServer(this.LocalExpressServer, {
            debug:0
        });

        //connect peerjs to the express server path
        this.ExpressApp.use(this.LocalPeer.Path, this.PeerServer);
        this.PeerServer.on('connection', this.onConnect);
        this.PeerServer.on('disconnect', this.onDisconnect);
        this.LocalPeer.connect();
    }

    /**
     * Attempts to connect to peers
     */
    connectPeers() {
        if(this.LocalPeer && this.LocalPeer.Port > 0) {
            this.LocalPeer.connectToPeers();
        }
    }

    updateData() {
        if(this.LocalPeer) {
            
        }
    }

    /**
     * Reducer for the redux store for this server.
     * @param {Object} state 
     * @param {Object} action 
     */
    reducer(state, action) {
        console.log(`Updating server store`);
        if(typeof(state) !== "object")
            return Object.assign({}, this.InitState);

        switch(action.type) {
            //updates the status of the data connection for a given peer
            case P2PServer.UPDATE_DATA_STATUS :
                if(state.Peers[action.id]) {
                    return Object.assign({}, state, {
                        Peers:Object.assign({}, state.Peers, {
                            [action.id]:Object.assign({}, state.Peers[action.id], {
                                Connected:action.status
                            })
                        })
                    });
                }

                return state;

            //updates the status of the media connection for a given peer
            case P2PServer.UPDATE_MEDIA_STATUS :
                if(state.Peers[action.id]) {
                    return Object.assign({}, state, {
                        Peers:Object.assign({}, state.Peers, {
                            [action.id]:Object.assign({}, state.Peers[action.id], {
                                MediaConnected:action.status
                            })
                        })
                    });
                }
                return state;

            //Adds an app to be controlled by the remote peer
            case P2PServer.PEER_ADD_CONTROL_APP :
                if(state.Peers[action.id] && state.Peers[action.id].ControlledApps.indexOf(action.code) < 0) {
                    var peer = Object.assign({}, state.Peers[action.id]);
                    peer.ControlledApps.push(action.code);
                    var peers = Object.assign({}, state.Peers, {
                        [action.id]:Object.assign({}, peer)
                    });
                    return Object.assign({}, state, {Peers:peers});
                }
                return state;

            //Removes a controlled app from the peer
            case P2PServer.PEER_REMOVE_CONTROL_APP :
                if(state.Peers[action.id] && state.Peers[action.id].ControlledApps.indexOf(action.code) >= 0) {
                    var peer = Object.assign({}, state.Peers[action.id]);
                    peer.ControlledApps.splice(peer.ControlledApps.indexOf(action.code), 1);
                    var peers = Object.assign({}, state.Peers, {
                        [action.id]:Object.assign({}, peer)
                    });
                    return Object.assign({}, state, {Peers:peers});
                }
                return state;

            //add app for peer to receive data for
            case P2PServer.PEER_ADD_REMOTE_APP :
                if(state.Peers[action.id] && state.Peers[action.id].RemoteApps.indexOf(action.code) < 0) {
                    var peer = Object.assign({}, state.Peers[action.id]);
                    peer.RemoteApps.push(action.code);
                    var peers = Object.assign({}, state.Peers, {
                        [action.id]:Object.assign({}, peer)
                    });
                    return Object.assign({}, state, {Peers:peers});
                }
                return state;

            //remove app to send peer data to
            case P2PServer.PEER_REMOVE_REMOTE_APP :
                if(state.Peers[action.id] && state.Peers[action.id].RemoteApps.indexOf(action.code) >= 0) {
                    var peer = Object.assign({}, state.Peers[action.id]);
                    peer.RemoteApps.splice(peer.RemoteApps.indexOf(action.code), 1);
                    var peers = Object.assign({}, state.Peers, {
                        [action.id]:Object.assign({}, peer)
                    });
                    return Object.assign({}, state, {Peers:peers});
                }
                return state;

            default :
                return state;
        }
    }

    /**
     * Creates a connection from the local peer to the remove peer
     * @param {String} id Peer's ID
     */
    ConnectToPeer(id) {
        this.LocalPeer.connectToPeer(id);
    }

    /**
     * Disconnects from the peer.
     * @param {Object} peer
     */
    DisconnectPeer(peer) {
        
    }

    /**
     * Sends data to the given peer. If PeerID is null, then data
     * will be sent to all peers.
     * @param {String} id
     * @param {Object} data 
     */
    SendData(id, data) {
        this.LocalPeer.send(id, data);
    }

    /**
     * Sends the given state to listening peers.
     * @param {String} app 
     * @param {Object} state 
     */
    SendState(app, state) {
        if(this.controller) {
            let peers = this.controller.getPeers(true);
            peers.forEach((peer) => {
                if(peer.ReceiveApps && peer.ReceiveApps.indexOf(app) >= 0) {
                    this.LocalPeer.send(peer.PeerID, {
                        type:'state',
                        app:app,
                        state:(this.controller) ? this.controller.PrepareStateForSending(app, state) : state
                    });
                }
            });
        }
    }

    /**
     * Calls the provided peer, asking for a media stream connection.
     * - If the peer exists
     * - If a media connection already exists, then close the current one
     * @param {String} id Peer's ID
     * @param {MediaStream} mediaStream 
     */
    SendCall(id, mediaStream) {

    }

    /**
     * Sends a data request to the peer to send a mediastream in return.
     * Allows for the user to 'watch' the available mediastream without
     * having to send one themselves.
     * @param {String} id Peer's ID
     */
    RequestCall(id) {
        this.SendData(id, {type:'request-call'});
    }

    /**
     * Grants the peer permission to send state updates for the provided app.
     * @param {string} id
     * @param {String} code The app's code
     */
    AddPeerControlledApp(id, code) {
        return;
        this.getStore().dispatch({
            type:P2PServer.PEER_ADD_CONTROL_APP,
            id:id,
            code:code
        });
    }

    /**
     * Revokes the peer's permission to send state updates for the provided app.
     * @param {String} id
     * @param {String} code 
     */
    RemovePeerControlledApp(id, code) {
        return;
        this.getStore().dispatch({
            type:P2PServer.PEER_REMOVE_CONTROL_APP,
            id:id,
            code:code
        });
    }

    /**
     * Grants permission to the peer to receive state updates from the app.
     * @param {String} id
     * @param {String} code 
     */
    AddPeerRemoteApp(id, code) {
        return;
        this.getStore().dispatch({
            type:P2PServer.PEER_ADD_REMOTE_APP,
            id:id,
            code:code
        });
    }

    /**
     * Revokes permission to the peer to receive state updates from the app.
     * @param {String} id
     * @param {String} code 
     */
    RemovePeerRemoteApp(id, code) {
        return;
        this.getStore().dispatch({
            type:P2PServer.PEER_REMOVE_REMOTE_APP,
            id:id,
            code:code
        });
    }

    /**
     * Gets the server instance.
     * @return {Object} 
     */
    getServer() {
        return this.ExpressApp;
    }

    /**
     * Gets a peer with the specified ID
     * @param {String} id 
     */
    getPeer(id) {
        if(this.Peers[id])
            return this.Peers[id];
        return null;
    }

    /**
     * 
     * @param {Object} peer 
     */
    UpdatePeerDataStatus(peer) {
        this.getStore().dispatch({
            type:P2PServer.UPDATE_DATA_STATUS,
            id:peer.ID,
            status:peer.DataConnected
        });
    }

    /**
     * Updates the media status of the provided peer
     * @param {Object} peer 
     */
    UpdatePeerMediaStatus(peer) {
        this.getStore().dispatch({
            type:P2PServer.UPDATE_MEDIA_STATUS,
            id:peer.ID,
            status:peer.MediaConnected
        });
    }

    /**
     * Prepares the given record for sending to a peer.
     * @param {Object} record 
     */
    PrepareObjectForSending(record) {
        if(typeof(record) !== 'object' || record == null)
            return record;
        
        for(let key in record) {
            switch(key) {
                case 'Thumbnail' :
                case 'Photo' :
                case 'ScoreboardThumbnail' :
                case 'Background' :
                case "Filename" :
                case "FileName" :
                    if(record[key] && record[key].indexOf('http://' + this.IPAddress) !== 0) {
                        if(record && record.RecordType && record.RecordType === 'VID') {
                            record[key] = "http://" + this.IPAddress + ":" + this.Port + "/api/video/" + record[key];
                        } else {
                            record[key] = "http://" + this.IPAddress + ":" + this.Port + "/api/image/" + record[key];
                        }
                    }
                break;

                default :
                    if(typeof(record[key]) === 'object' && record[key] !== null) {
                        if(record[key] instanceof Array) {
                            record[key] = record[key].slice();
                            for(var akey in record[key]) {
                                if(typeof(record[key][akey]) === 'object' && record[key][akey] !== null) {
                                    record[key][akey] = this.PrepareObjectForSending(Object.assign({}, record[key][akey]));
                                }
                            }
                        } else {
                            record[key] = this.PrepareObjectForSending(Object.assign({}, record[key]));
                        }
                    }
                break;
            }
        }

        return record;
    }

    /**
     * Returns a URL of the given image file, pointing to the local server API.
     * @param {String} src 
     * @param {Boolean} remove 
     */
    getImageURL(src, remove) {
        if(!src || src === '')
            return '';
        var prefix = "http://" + this.IPAddress + ":" + this.Port + "/api/image/";
        if(remove) {
            if(src.indexOf(prefix) === 0) {
                return src.substring(src.indexOf(prefix));
            }
            return src;
        }

        return "http://" + this.IPAddress + ":" + this.Port + "/api/image/" + this.controller.mpath(src, true);
    }

    /**
     * Returns a URL of the given media video file, to the local server API.
     * @param {String} src 
     * @param {Boolean} remove 
     */
    getVideoURL(src, remove) {
        if(!src || src === '' || !src.indexOf)
            return '';
        var prefix = "http://" + this.IPAddress + ":" + this.Port + "/api/video/";
        if(remove) {
            if(src.indexOf(prefix) === 0) {
                return src.substring(src.indexOf(prefix));
            }
            return src;
        }
        return prefix + this.controller.PATH.basename(src);
    }

    /**
     * Attaches a RESTful API to the given express server.
     */
    buildAPI() {
        //server peer ID
        this.ExpressApp.get('/api/peer/id', (req, res) => {
            res.send(this.LocalPeer.ID);
        });
    }

    /**
     * Starts the pinging process for remote peers so connections
     * can be made automatically.
     */
    StartPeerListener() {
        for(var key in this.Peers) {
            this.Peers[key].ping();
        }
    }

    /**
     * 
     * @param {String} host 
     * @param {Number} port 
     * @param {Function} success 
     * @param {Function} failed 
     * @param {Number} max 
     * @param {Number} attempts 
     */
    ping(host, port, success, failed, max, attempts) {
        attempts = Math.min(0, (attempts || 0));
        max = Math.min(1, (max || 10));
        let delay = 10000;
        let sock = this.Networker.Socket();
        let con = false;
        sock.setTimeout(delay);
        sock.on('connect', () => {
            if(success)
                success();
            con = true;
            try {sock.end();}catch(er){}
            try {sock.destroy();}catch(er){}
        }).on('error', (er) => {
            try {sock.end();}catch(er){}
            try {sock.destroy();}catch(er){}

            if(er && er.code) {
                switch(er.code) {
                    case 'ENOTFOUND' :
                        if( failed )
                            failed(er);
                    break;
                    case 'ECONNREFUSED' :
                        attempts++;
                        if( attempts < max ) {
                            setTimeout(() => {
                                this.ping(host, port, success, failed, max, attempts);
                            }, delay);
                        }
                    break;

                    default :
                        if( failed )
                            failed(er);
                    break;
                }
            }
            
        }).on('timeout', () => {
            try {sock.end();} catch( er ) {}
            try {sock.destroy();} catch( er ) {}
            if( !con ) {
                attempts++;
                if( attempts < max ) {
                    setTimeout(() => {
                        this.ping(host, port, success, failed, max, attempts);
                    }, delay);
                } else {
                    if( failed )
                        failed();
                }
            }
        });

        sock.connect(port, host);
    }

    onExit() {
        //this.LocalPeer.disconnect();
        this.LocalExpressServer.close();
    }

    /**
     * Gets the current state.
     */
    getState() {
        return this.LocalStore.getState();
    }

    /**
     * Gets the store associated with the server
     * @return {Object}
     */
    getStore() {
        return this.LocalStore;
    }

    /**
     * Subscribes to state changes
     * @param {Function} f 
     * @return a function to unsubscribe from the state changes
     */
    subscribe(f) {
        return this.LocalStore.subscribe(f);
    }
}

P2PServer.INIT_SERVER = 'INIT_PEER';
P2PServer.ADD_PEER = 'ADD_PEER';
P2PServer.CONNECT_PEER = 'CONNECT_PEER';
P2PServer.CONNECT_TO_PEER = 'CONNECT_TO_PEER';

P2PServer.UPDATE_DATA_STATUS = 'UPDATE_DATA_STATUS';
P2PServer.UPDATE_MEDIA_STATUS = 'UPDATE_MEDIA_STATUS';

P2PServer.PEER_CLOSED = 'PEER_CLOSED';
P2PServer.PEER_DATA_OPEN = 'PEER_DATA_OPEN';
P2PServer.PEER_DATA_CLOSE = 'PEER_DATA_CLOSE';
P2PServer.PEER_ADD_CONTROL_APP = 'PEER_ADD_CONTROL_APP';
P2PServer.PEER_REMOVE_CONTROL_APP = 'PEER_REMOVE_CONTROL_APP';
P2PServer.PEER_ADD_REMOTE_APP = 'PEER_ADD_REMOTE_APP';
P2PServer.PEER_REMOVE_REMOTE_APP = 'PEER_REMOVE_REMOTE_APP';

P2PServer.PEER_MEDIA_STREAM = 'PEER_MEDIA_STREAM';
P2PServer.PEER_MEDIA_CLOSE = 'PEER_MEDIA_CLOSE';

P2PServer.PORT = 24012;

module.exports = P2PServer;