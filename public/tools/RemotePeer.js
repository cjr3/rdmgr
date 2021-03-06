/**
 * Class for managing a local/remote peer connection.
 * (There should only be one local connection!)
 */
class PeerItem {
    constructor(id, host, port, path) {
        this.ID = id;
        this.Host = host;
        this.Port = port;
        this.Path = path;
        this.Peers = {};
        this.onOpen = this.onOpen.bind(this);
        this.onCall = this.onCall.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.onConnection = this.onConnection.bind(this);
        this.onDisconnected = this.onDisconnected.bind(this);
        this.connect = this.connect.bind(this);
        this.connectToPeer = this.connectToPeer.bind(this);
        this.disconnectPeer = this.disconnectPeer.bind(this);
        this.closeConnections = this.closeConnections.bind(this);
        this.closeDataConnection = this.closeDataConnection.bind(this);
        this.closeMediaConnection = this.closeMediaConnection.bind(this);
        this.ping = this.ping.bind(this);
        this.onMediaClose = this.onMediaClose.bind(this);
        this.onMediaError = this.onMediaError.bind(this);
        this.onMediaStream = this.onMediaStream.bind(this);
        this.setStream = this.setStream.bind(this);
        this.LocalStream = null;
    }

    /**
     * Connects this peer to the local server.
     */
    connect() {
        this.PeerItem = new window.LocalServer.SPeer({
            initiator:true,
            config:{
                iceServers:[]
            }
        });

        //triggered when the peer encounters an error
        this.PeerItem.on('error', (err) => {
            
        });

        //triggered when the remote peer emits the on-signal event to this local peer
        this.PeerItem.on('signal', data => {
            //call peer 
        });

        //triggered when the peer connection and data channel are ready
        this.PeerItem.on('connect', () => {

        });

        //triggered when data is received from the peer
        this.PeerItem.on('data', data => {

        });

        //triggered when a peer streams to this local peer
        this.PeerItem.on('stream', stream => {

        });
    }

    /**
     * Adds a remote peer to later connect to.
     * @param {String} id 
     * @param {String} host 
     * @param {Number} port 
     */
    addPeer(id, host, port) {
        this.Peers[id] = {
            ID:id,
            Host:host,
            Port:port,
            PeerItem:null,
            MediaConnection:null,
            DataConnection:null,
            DataConnected:false,
            MediaConnected:false,
            Connecting:false
        };
    }

    /**
     * Establishes a data connection with the provided peer.
     * @param {String} id
     * @param {Boolean} local 
     */
    connectToPeer(id, local) {
        if(id === this.ID)
            return;

        if(this.PeerItem === null)
            this.connect();

        if(typeof(local) !== "boolean")
            local = false;

        let peer = this.Peers[id];
        if(peer === undefined || peer == null)
            return;

        if(peer.PeerItem === null && !local) {

            //Connect to peer, sending OUR ID to THEIR Host
            peer.PeerItem = new window.LocalServer.Peer(this.ID, {
                host:peer.Host,
                port:peer.Port,
                path:this.Path,
                config:{
                    iceServers:[]
                }
            });

            //Connected to server - data connection does not have to be open
            peer.PeerItem.on('open', (id) => {
            });

            //When the remote peer creates a data connection TO US
            peer.PeerItem.on('connection', (dcnx) => {
                peer.DataConnection = dcnx;
                peer.DataConnection.on('data', this.onDataReceived.bind(this, peer));
                peer.DataConnection.on('open', this.onDataOpen.bind(this, peer));
                peer.DataConnection.on('close', this.onDataClose.bind(this, peer));
                peer.DataConnection.on('error', this.onDataError.bind(this, peer));
                peer.DataConnected = true;
                window.LocalServer.UpdatePeerDataStatus(peer);
            });

            //When the peer calls US
            peer.PeerItem.on('call', (mcnx) => {
                peer.MediaConnection = mcnx;
                peer.MediaConnection.on('close', this.onMediaClose.bind(this, peer));
                peer.MediaConnection.on('stream', this.onMediaStream.bind(this, peer));
                peer.MediaConnection.on('error', this.onMediaError.bind(this, peer));
            });

            //when the remote peer closes THEIR connection to US
            peer.PeerItem.on('close', () => {
                peer.DataConnected = false;
                peer.MediaConnected = false;
                if(peer.DataConnection) {
                    peer.DataConnection.close();
                }

                if(peer.MediaConnection) {
                    peer.MediaConnection.close();
                }

                window.LocalServer.UpdatePeerDataStatus(peer);
                window.LocalServer.UpdatePeerMediaStatus(peer);
                peer.PeerItem = null;
            });

            //when the remote peer is disconnected from the server
            //no further connections can be made to the peer
            peer.PeerItem.on('disconnected', () => {
            });

            peer.PeerItem.on('error', (err) => {
                switch(err.type) {
                    case 'peer-unavailable' :
                        peer.PeerItem = null;
                    break;
                    default :
                    break;
                }
            });

            return;
        }

        if(peer.PeerItem)
            peer.DataConnection = peer.PeerItem.connect(peer.ID);
        else
            peer.DataConnection = this.PeerItem.connect(peer.ID);

        if(peer.DataConnection) {
            peer.DataConnection.on('data', this.onDataReceived.bind(this, peer));
            peer.DataConnection.on('open', this.onDataOpen.bind(this, peer));
            peer.DataConnection.on('close', this.onDataClose.bind(this, peer));
            peer.DataConnection.on('error', this.onDataError.bind(this, peer));
        }
    }

    /**
     * Calls the provided peer
     * @param {string} id 
     */
    callPeer(id) {
        let peer = this.Peers[id];
        if(peer === null || peer === undefined)
            return;
        
        peer.MediaConnection = this.PeerItem.call(id, this.LocalCanvasStream);
        peer.MediaConnection.on('close', this.onMediaClose.bind(this, peer));
        peer.MediaConnection.on('stream', this.onMediaStream.bind(this, peer));
        peer.MediaConnection.on('error', this.onMediaError.bind(this, peer));
    }

    /**
     * Disconnects the provided peer from the local server
     * @param {string} id 
     */
    disconnectPeer(id) {
        let peer = this.Peers[id];
        if(peer !== null && peer !== undefined) {
            //if(peer.DataConnection)
                //peer.DataConnection.close();
            //if(peer.MediaConnection)
                //peer.MediaConnection.close();
            //if(peer.PeerItem)
                //peer.PeerItem.destroy();
            peer.PeerItem = null;
        }
    }

    /**
     * Disconnects the local peer from the server
     */
    disconnect() {
        this.DataConnected = false;
        this.MediaCOnnected = false;
        this.Connecting = false;
        this.closeConnections();
        if(this.PeerItem) {
            this.PeerItem.destroy();
        }
        this.PeerItem = null;
    }

    /**
     * Closes the data and media connections.
     */
    closeConnections() {
        this.closeDataConnection();
        this.closeMediaConnection();
    }

    /**
     * Closes the data connection.
     */
    closeDataConnection() {
        for(var key in this.Peers) {
            if(this.Peers[key].DataConnection && this.Peers[key].DataConnection.open)
                this.Peers[key].DataConnection.close();
        }
    }

    /**
     * Closes the media connection.
     */
    closeMediaConnection() {
        for(var key in this.Peers) {
            if(this.Peers[key].MediaConnection && this.Peers[key].MediaConnection.open)
                this.Peers[key].MediaConnection.close();
        }
    }

    /**
     * Sets the canvas element that is streamed to listening peers.
     * @param {HTML5CanvasElement} canvas 
     */
    setStream(canvas) {
        this.LocalStream = canvas;
    }

    /**
     * Triggered when the animation worker posts a message.
     * @param {Mixed} response 
     */
    onLocalVideoWorkerMessage(response) {
        switch(response.data) {
            case 'render' :
                this.paint();
                break;
        }
    }

    /**
     * Pauses the media stream worker.
     */
    pause() {
        this.LocalVideoWorker.postMessage('pause');
    }

    /**
     * Plays the media stream worker.
     */
    play() {
        this.LocalVideoWorker.postMessage('play');
    }

    /**
     * Paints the local video element to the canvas,
     * which will update it on any listening peers.
     */
    paint() {
        
    }

    ready() {

    }

    /**
     * Updates peer info:
     * - Host
     * - Port
     * @param {Array} peers 
     */
    updatePeers(peers) {
        peers.forEach((record) => {
            if(this.peers[record.ID]) {
                let peer = this.peers[record.ID];
                peer.Host = record.Host;
                peer.Port = record.Port;
            }
        });
    }

    /**
     * Triggered when this peer connects to the local server.
     */
    onOpen() {
        this.connectToPeers();
    }

    /**
     * Triggered when this peer destroys itself.
     * A destroyed peer cannot accept new connections.
     */
    onClose() {
        
    }

    /**
     * Triggered when a peer connects to this peer.
     * - This should be the only place a data connection is established!
     * @param {Object} dcnx The data connection
     */
    onConnection(dcnx) {
        let peer = this.Peers[dcnx.peer];

        //ignore and close data connections from unknown peers
        if(peer === null || peer === undefined) {
            //dcnx.close();
            return;
        }

        peer.DataConnection = dcnx;
        peer.DataConnection.on('data', this.onDataReceived.bind(this, peer));
        peer.DataConnection.on('open', this.onDataOpen.bind(this, peer));
        peer.DataConnection.on('close', this.onDataClose.bind(this, peer));
        peer.DataConnection.on('error', this.onDataError.bind(this, peer));
    }

    /**
     * Triggered when a peer calls this peer.
     * - This should be the only place a media connection is answered.
     * @param {Object} media Peer.MediaConnection object
     */
    onCall(media) {
        let peer = this.Peers[media.peer];
        //ignore media calls from unknown peers
        if(peer === undefined || peer == null) {
            media.close();
            return;
        }

        peer.MediaConnection = media;
        peer.MediaConnection.on('stream', this.onMediaStream.bind(this, peer));
        peer.MediaConnection.on('close', this.onMediaClose.bind(this, peer));
        peer.MediaConnection.on('error', this.onMediaError.bind(this, peer));
        peer.MediaConnection.answer(this.LocalCanvasStream);
    }

    /**
     * Triggered when the peer disconnects from the server, manully or through an error.
     * You can reconnect with peer.reconnect(), because the data connections
     * and media connections will be still live (because they're connected to peers).
     * 
     * A disconnected peer does not allow further connections to be made, because
     * the server can no longer find the peer.
     */
    onDisconnected() {
    }

    /**
     * Triggered when the peer encounters an error.
     * When this is called, we might as well destroy the peer.
     * 
     * This is not to be confused with the errors encountered on DataConnections
     * and MediaConnections, which can be recreated/destroyed more easily.
     * 
     * Error 'type':
     * - browser-incompatible
     * - disconnected (not fatal)
     * - invalid-id
     * - invalid-key
     * - network (not fatal)
     * - peer-unavailable
     * - ssl-unavailable
     * - server-error
     * - socket-error
     * - socket-closed
     * - unavailable-id (non-fatal)
     * - webrtc
     * 
     * @param {Error} err 
     */
    onError(err) {
        switch(err.type) {
            case 'peer-unavailable' :
                if(this.PeerItem) {
                    //this.PeerItem.disconnect();
                }
            break;
            case 'unavailable-id' :
                //this.disconnect();
            break;
            default :
            break;
        }
    }

    /**
     * Triggered when a peer sends data through the DataConnection
     * @param {Object} peer 
     * @param {Object} data 
     */
    onDataReceived(peer, data) {
        switch(data.type) {
            case 'request-call' :
                this.callPeer(peer.ID);
            break;
            default :
                window.LocalServer.onDataReceived(peer, data);
            break;
        }
    }

    /**
     * Triggered when the data connection opens.
     */
    onDataOpen(peer) {
        peer.DataConnected = true;
        window.LocalServer.UpdatePeerDataStatus(peer);
    }

    /**
     * Triggered when a peer closes their data connection
     */
    onDataClose(peer) {
        peer.DataConnected = false;
        window.LocalServer.UpdatePeerDataStatus(peer);
    }

    /**
     * Triggered when the peer's data connection encounters an error
     * @param {Object} error 
     */
    onDataError(peer, error) {
        if(peer.DataConnection && peer.DataConnection.open === false) {
            peer.DataConnected = false;
            window.LocalServer.UpdatePeerDataStatus(peer);
        }
    }

    /**
     * Triggered when the peer begins streaming their media
     * @param {MediaStream} stream 
     */
    onMediaStream(peer, stream) {
        peer.MediaConnected = true;
        window.LocalServer.UpdatePeerMediaStatus(peer);
    }

    /**
     * Triggered when a peer closes a media stream
     */
    onMediaClose(peer) {
        peer.MediaConnected = false;
        window.LocalServer.UpdatePeerMediaStatus(peer);
    }

    /**
     * Triggered when a peer encounters an error in their media stream
     * @param {Object} err 
     */
    onMediaError(peer, err) {
    }

    /**
     * Sends data to the given peer.
     * @param {Object} data 
     */
    send(id, data) {
        let peer = this.Peers[id];
        if(peer && peer.DataConnection && peer.DataConnection.open) {
            switch(data.type) {
                case 'state' :
                    data.state = Object.assign({}, window.LocalServer.PrepareObjectForSending( data.state ));
                break;
            }
            
            peer.DataConnection.send(data);
        }
    }

    /**
     * Sends a chat message to all connected peers
     * @param {Object} message 
     */
    async sendChatMessage(message) {
        for(var key in this.Peers) {
            this.send(key, {
                type:'chat-message',
                message:message
            });
        }
    }

    /**
     * Starts trying to connect to peers.
     */
    connectToPeers() {
        for(var key in this.Peers) {
            //this.ping(this.Peers[key].ID);
            this.pingPeer(this.Peers[key]);
        }
    }

    /**
     * Pings the given peer, and then attemps to connect through
     * WebRTC if the peer's machine is available.
     * @param {object} peer 
     */
    pingPeer(peer) {
        if(!peer.DataConnected && !peer.Connecting) {
            peer.Connecting = true;
            window.LocalServer.ping(peer.Host, peer.Port, () => {
                peer.Connecting = false;
                if(!peer.DataConnected)
                    this.connectToPeer(peer.ID);
            }, () => {
                peer.Connecting = false;
            });
        }
    }

    /**
     * Keeps the connection alive to this peer.
     * Check every 5 seconds. If the peer is not connected and not connecting,
     * then ping the host once.
     */
    ping(id) {
        let peer = this.Peers[id];

        //ignore unknown peers
        if(peer === null || peer === undefined) {
            return;
        }

        setTimeout(() => {
            if(!peer.DataConnected && !peer.Connecting) {
                peer.Connecting = true;
                window.LocalServer.ping(peer.Host, peer.Port, () => {
                    peer.Connecting = false;
                    if(!peer.DataConnected)
                        this.connectToPeer(id);
                    this.ping(id);
                }, () => {
                    peer.Connecting = false;
                    this.ping(id);
                }, 1, 0);
            } else {
                this.ping(id);
            }
        }, 5000);
    }
}