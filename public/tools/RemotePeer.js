class RemotePeer {
    constructor(settings) {
        this.ID = settings.ID;
        this.Host = settings.Host;
        this.Port = settings.Port;
        this.CapturePort = settings.CapturePort;
        this.Path = settings.path;
        this.Name = settings.Name;

        this.RemotePeerItem = null;
        this.Remote = false;

        this.DataConnection = null;
        this.MediaConnection = null;
        this.Connecting = false;

        this.DataConnected = false;
        this.MediaConnected = false;
        this.DataConnectionTime = null;
        this.MediaConnectionTime = null;

        //bindings
        this.onDataReceived = this.onDataReceived.bind(this);
        this.onDataOpened = this.onDataOpened.bind(this);
        this.onDataClosed = this.onDataClosed.bind(this);
        this.onDataError = this.onDataError.bind(this);
        this.onMediaClosed = this.onMediaClosed.bind(this);
        this.onMediaError = this.onMediaError.bind(this);
        this.onMediaStream = this.onMediaStream.bind(this);

        //this.onSelfClose = this.onSelfClose.bind(this);
        //this.onSelfDisconnected = this.onSelfDisconnected.bind(this);
        //this.onSelfError = this.onSelfError.bind(this);
        //this.onSelfOpen = this.onSelfOpen.bind(this);
        //this.onSelfCall = this.onSelfCall.bind(this);

        //ControlledApps and RemoteApps should not have the same codes.

        //codes for apps this peer controls
        this.ControlledApps = [];

        //codes for apps we control for the peer
        this.RemoteApps = [];
    }

    /**
     * Creates a data connection to the peer, allowing the sending/receive
     * of data such as Scoreboard state.
     * 
     * This should be called when a peer connects to the local server.
     * 
     * @param {Object} peer LocalPeer
     */
    connect(peer) {
        this.Remote = false;
        if(this.RemotePeerItem) {
            this.RemotePeerItem.destroy();
            this.RemotePeerItem = null;
        }
        this.closeDataConnection();
        peer.connect(this);
    }

    /**
     * 
     */
    connectTo(peer) {
        if(this.RemotePeerItem) {
            if(this.RemotePeerItem.destroyed) {
                this.RemotePeerItem = null;
            } else if(this.RemotePeerItem.disconnected) {
                this.RemotePeerItem.reconnect();
                return;
            } else {
                if(this.DataConnection && !this.DataConnection.open) {
                    this.DataConnection = this.RemotePeerItem.connect(this.ID);
                    this.DataConnection.on('open', this.onDataOpened);
                    this.DataConnection.on('data', this.onDataReceived);
                    this.DataConnection.on('close', this.onDataClosed);
                    this.DataConnection.on('error', this.onDataError);
                    return;
                }
                
                return;
            }
        } else if(this.DataConnection && this.DataConnection.open) {
            return;
        }

        this.Remote = true;
        this.closeDataConnection();

        try {
            window.LocalServer.ping(this.Host, this.Port, () => {
                this.RemotePeerItem = new Peer(peer.PeerID, {
                    host:this.Host,
                    port:this.Port,
                    path:"/p2p",
                    config:{
                        iceServers:[]
                    }
                });
                
                this.DataConnection = this.RemotePeerItem.connect(this.ID);
                this.DataConnection.on('open', this.onDataOpened);
                this.DataConnection.on('data', this.onDataReceived);
                this.DataConnection.on('close', this.onDataClosed);
                this.DataConnection.on('error', this.onDataError);
        
                this.RemotePeerItem.on('close', () => {
                    console.log("Remote peer closed");
                    this.Connecting = false;
                    window.LocalServer.DisconnectPeer(this);
                    //this.RemotePeerItem.destroy();
                    this.RemotePeerItem = null;
                    //this.RemotePeerItem = null;
                    //this.Remote = false;
                });
        
                this.RemotePeerItem.on('disconnected', () => {
                    console.log("Remote peer disconnected");
                    this.Connecting = false;
                    window.LocalServer.DisconnectPeer(this);
                    if(this.RemotePeerItem)
                        this.RemotePeerItem.destroy();
                    //this.RemotePeerItem = null;
                    //this.Remote = false;
                });
        
                this.RemotePeerItem.on('error', (er) => {
                    console.log("Remote peer error!");
                    console.log(er.type);
                    switch(er.type) {
                        case 'invalid-id' :
                        case 'invalid-key' :
                        case 'server-error' :
                        case 'socket-error' :
                        case 'socket-closed' :
                        case 'network' :
                        case 'peer-unavailable' :
                            this.Connecting = false;
                            if(this.RemotePeerItem)
                                this.RemotePeerItem.destroy();
                            this.RemotePeerItem = null;
                        break;
                    }
                });
            })
        } catch(er) {

        }
    }

    /**
     * Calls the peer, sending the current peer's stream source.
     * The stream source is required, and can be any source that creates
     * a MediaStream object, such as an HTML5 Video, Canvas, or attached audio/video device.
     * 
     * @param {Object} peer a LocalPeer object
     */
    callPeer(peer) {
        this.closeMediaConnection();
        this.MediaConnection = peer.call(this.ID, peer.StreamSource);
        this.MediaConnection.on('stream', this.onMediaStream);
        this.MediaConnection.on('close', this.onMediaClosed);
        this.MediaConnection.on('error', this.onMediaError);
    }

    /**
     * Keeps the connection alive to this peer.
     * Check every 5 seconds. If the peer is not connected and not connecting,
     * then ping the host once.
     */
    ping() {
        setTimeout(() => {
            if(!this.DataConnected && !this.Connecting) {
                this.Connecting = true;
                window.LocalServer.ping(this.Host, this.Port, () => {
                    this.Connecting = false;
                    if(!this.DataConnected) {
                        window.LocalServer.ConnectToPeer(this.ID);
                    }
                    this.ping();
                }, () => {
                    this.Connecting = false;
                    this.ping();
                }, 1, 0);
            } else {
                this.ping();
            }
        }, 5000);
    }

    /**
     * Closes the peer's data connection.
     */
    closeDataConnection() {
        if(this.DataConnection !== null && this.DataConnection.open) {
            this.DataConnection.close();
        }
    }

    /**
     * Closes the peer's media connection.
     */
    closeMediaConnection() {
        if(this.MediaConnection !== null && this.MediaConnection.open) {
            this.MediaConnection.close();
        }
    }
    
    /**
     * Triggered when the peer sends data.
     * @param {Mixed} data 
     */
    onDataReceived(data) {
        if(window && window.LocalServer) {
            window.LocalServer.onDataReceived(this, data);
        }
    }

    /**
     * Triggered when the peer's data connection is open for send/receive.
     */
    onDataOpened() {
        console.log("onDataOpened");
        this.DataConnected = true;
        this.Connecting = false;
        if(window && window.LocalServer) {
            window.LocalServer.onDataOpened(this);
        }
    }

    /**
     * Triggered when the peer closes their data connection.
     */
    onDataClosed() {
        console.log("onDataClosed");
        this.DataConnected = false;
        if(window && window.LocalServer) {
            window.LocalServer.onDataClosed(this);
        }
    }

    /**
     * Triggered when there's an error in the peer's data connection
     * @param {Object} err 
     */
    onDataError(err) {
        console.log("onDataError");
        console.log(err);
    }

    /**
     * Triggered when the media connection is closed.
     */
    onMediaClosed() {
        console.log("onMediaClosed");
    }

    /**
     * Triggered when there's an error in the peer's media connection.
     * @param {Object} err 
     */
    onMediaError(err) {
        console.log("onMediaError");
    }

    /**
     * Triggered when the remote peer streams media (audio/video)
     * @param {MediaStream} source 
     */
    onMediaStream(source) {
        console.log("onMediaStream");
    }

    /**
     * Triggered when this peer connects to a server.
     * @param {String} id Peer's ID
     */
    onSelfOpen(id) {
        console.log("onSelfOpen");
    }

    /**
     * Triggered when this peer destroys itself.
     * A destroyed peer cannot accept new connections.
     * Create a new LocalPeer object.
     */
    onSelfClose() {
        console.log("onSelfClose");
    }

    /**
     * Triggered when the peer disconnects from the server, mnaully or through an error.
     * You can reconnect with peer.reconnect(), because the data connections
     * and media connections will be still live (because they're connected to peers).
     * 
     * A disconnected peer does not allow further connections to be made, because
     * the server can no longer find the peer.
     */
    onSelfDisconnected() {
        console.log("onSelfDisconnected");
        if(window && window.LocalServer) {
            window.LocalServer.DisconnectPeer(this.ID);
        }
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
    onSelfError(err) {
        console.log("onSelfError");
        //destroy ???
    }

    onPeerConnection() {
        console.log("onPeerConnection");
    }

    onPeerCall() {
        console.log("onPeerCall");
    }

    send(data) {
        if(this.DataConnection !== null) {
            this.DataConnection.send(data);
            console.log("Data...")
        }
    }
}