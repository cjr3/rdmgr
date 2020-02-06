/**
 * Class for managing a local/remote peer connection.
 * (There should only be one local connection!)
 */
class PeerConnection {
    constructor(id, settings) {
        this.LocalID = id;
        this.Settings = settings;
        this.ID = settings.ID;
        this.Port = settings.Port;
        this.Host = settings.Host;
        this.Path = "/p2p";

        this.Connecting = false;
        this.DataConnected = false;
        this.DataConnection = null;

        this.MediaConnected = false;
        this.MediaConnection = null;

        this.RemoteStreamSource = null;

        //canvas supplied by camera / video elements
        
        //bindings

        //connection bindings
        this.onOpen = this.onOpen.bind(this);
        this.onCall = this.onCall.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.onConnection = this.onConnection.bind(this);
        this.onDisconnected = this.onDisconnected.bind(this);
        this.connect = this.connect.bind(this);
        this.connectToPeer = this.connectToPeer.bind(this);
        this.connectData = this.connectData.bind(this);
        this.closeConnections = this.closeConnections.bind(this);
        this.closeDataConnection = this.closeDataConnection.bind(this);
        this.closeMediaConnection = this.closeMediaConnection.bind(this);
        this.ping = this.ping.bind(this);

        //data bindings
        this.onDataClose = this.onDataClose.bind(this);
        this.onDataError = this.onDataError.bind(this);
        this.onDataOpen = this.onDataOpen.bind(this);
        this.onDataReceived = this.onDataReceived.bind(this);

        //media bindings
        this.onMediaClose = this.onMediaClose.bind(this);
        this.onMediaError = this.onMediaError.bind(this);
        this.onMediaStream = this.onMediaStream.bind(this);
        this.setStreamCanvas = this.setStreamCanvas.bind(this);
        this.paint = this.paint.bind(this);
        this.onLocalVideoWorkerMessage = this.onLocalVideoWorkerMessage.bind(this);
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        
        //streaming elements
        this.LocalVideoCanvas = null;
        this.LocalStreamCanvas = document.createElement('canvas');
        this.LocalStreamCanvas.setAttribute('width', 1280);
        this.LocalStreamCanvas.setAttribute('height', 720);
        this.LocalCanvasBrush = this.LocalStreamCanvas.getContext('2d');
        this.LocalCanvasStream = this.LocalStreamCanvas.captureStream(30);
        this.LocalVideoWorker = new Worker('tools/Animator.js');
        this.LocalVideoWorker.onmessage = this.onLocalVideoWorkerMessage;
    }

    /**
     * Connects to the peer.
     * Options can be provided to override the default settings.
     * 
     * For creating connections, the id should be provided, as that will
     * be the ID of the local peer on the remote server.
     * 
     * @param {Object} options 
     */
    connect(options) {
        if(this.DataConnected) {
            return;
        }

        if(this.LocalID !== this.ID && this.PeerItem) {
            //this.disconnect();
            //this.PeerItem = null;
            //this.connect(options);
            return;
        }

        var settings = Object.assign({}, this.Settings, options);

        this.PeerItem = new window.LocalServer.Peer(this.LocalID, {
            host:settings.Host,
            port:settings.Port,
            path:this.Path,
            config:{
                iceServers:[]
            }
        });

        this.PeerItem.on('open', this.onOpen);
        this.PeerItem.on('close', this.onClose);
        this.PeerItem.on('connection', this.onConnection);
        this.PeerItem.on('call', this.onCall);
        this.PeerItem.on('disconnected', this.onDisconnected);
        this.PeerItem.on('error', this.onError);

        if(this.LocalID !== this.ID) {
            window.LocalServer.LocalPeer.connectToPeer(this);
        }
    }

    /**
     * Establishes a data connection with the provided peer.
     * @param {Object} peer 
     */
    connectToPeer(peer) {
        //peer.closeDataConnection();
        peer.DataConnection = this.PeerItem.connect(peer.ID);
        if(peer.DataConnection) {
            peer.DataConnection.on('data', peer.onDataReceived);
            peer.DataConnection.on('open', peer.onDataOpen);
            peer.DataConnection.on('close', peer.onDataClose);
            peer.DataConnection.on('error', peer.onDataError);
        }
    }

    /**
     * Establishes a data connection to the remote peer.
     */
    connectData() {
        this.closeDataConnection();
        this.DataConnection = this.PeerItem.connect(this.ID);
        this.DataConnection.on('data', this.onDataReceived);
        this.DataConnection.on('open', this.onDataOpen);
        this.DataConnection.on('close', this.onDataClose);
        this.DataConnection.on('error', this.onDataError);
    }

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
        if(this.DataConnection && this.DataConnection.open) {
            this.DataConnection.close();
        }
    }

    /**
     * Closes the media connection.
     */
    closeMediaConnection() {
        if(this.MediaConnection && this.MediaConnection.open) {
            this.MediaConnection.close();
        }
    }

    /**
     * Sets the canvas element that is streamed to listening peers.
     * @param {HTML5CanvasElement} canvas 
     */
    setStreamCanvas(canvas) {
        this.LocalVideoCanvas = canvas;
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
        if(this.LocalVideoCanvas !== null) {
            this.LocalCanvasBrush.drawImage(
                this.LocalVideoCanvas,
                0, 0, this.LocalStreamCanvas.getAttribute('width'), this.LocalStreamCanvas.getAttribute('height')
            );
        }
    }

    ready() {

    }

    /**
     * Triggered when this peer connects to the local server.
     */
    onOpen(id) {
        if(id !== this.LocalID) {
            if(window.LocalServer.Peers[id])
                this.connectToPeer(window.LocalServer.Peers[id]);
        } else {
            this.DataConnected = true;
            this.MediaCOnnected = true;
        }
    }

    /**
     * Triggered when this peer destroys itself.
     * A destroyed peer cannot accept new connections.
     * Create a new LocalPeer object.
     */
    onClose() {
        if(this.ID !== this.LocalID) {
            //this.disconnect();
        }
    }

    /**
     * Triggered when a peer connects to this peer.
     * - This should be the only place a data connection is established!
     * @param {Object} dcnx The data connection
     */
    onConnection(dcnx) {
        //this.connectData(id);
        if(window.LocalServer.Peers[dcnx.peer]) {
            let peer = window.LocalServer.Peers[dcnx.peer];
            peer.DataConnected = true;
            peer.DataConnection = dcnx;
            peer.DataConnection.on('data', peer.onDataReceived);
            peer.DataConnection.on('open', peer.onDataOpen);
            peer.DataConnection.on('close', peer.onDataClose);
            peer.DataConnection.on('error', peer.onDataError);
        }
    }

    /**
     * Triggered when a peer calls this peer.
     * - This should be the only place a media connection is answered.
     * @param {Object} media Peer.MediaConnection object
     */
    onCall(media) {
        this.MediaCOnnected = true;
        this.MediaConnection = media;
        this.MediaConnection.on('stream', this.onMediaStream);
        this.MediaConnection.on('close', this.onMediaClose);
        this.MediaConnection.on('error', this.onMediaError);
        this.MediaConnection.answer();
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
                    this.PeerItem.disconnect();
                }
            break;
            case 'unavailable-id' :
                this.disconnect();
            break;
            default :
            break;
        }
    }

    /**
     * Triggered when a peer sends data through the DataConnection
     * @param {Object} data 
     */
    onDataReceived(data) {
        window.LocalServer.onDataReceived(this, data);
    }

    /**
     * Triggered when the data connection opens.
     */
    onDataOpen() {
        this.DataConnected = true;
        window.LocalServer.UpdatePeerDataStatus(this);
    }

    /**
     * Triggered when a peer closes their data connection
     */
    onDataClose() {
        this.DataConnected = false;
        window.LocalServer.UpdatePeerDataStatus(this);
    }

    /**
     * Triggered when the peer's data connection encounters an error
     * @param {Object} error 
     */
    onDataError(error) {
    }

    /**
     * Triggered when the peer begins streaming their media
     * @param {MediaStream} stream 
     */
    onMediaStream(stream) {
        this.MediaConnected = true;
        window.LocalServer.UpdatePeerMediaStatus(this);
    }

    /**
     * Triggered when a peer closes a media stream
     */
    onMediaClose() {
        this.MediaConnected = false;
        window.LocalServer.UpdatePeerMediaStatus(this);
    }

    /**
     * Triggered when a peer encounters an error in their media stream
     * @param {Object} err 
     */
    onMediaError(err) {
        
    }

    /**
     * Sends data to the given peer.
     * @param {Object} data 
     */
    send(data) {
        if(this.DataConnection !== null)
            this.DataConnection.send(data);
    }

    /**
     * Keeps the connection alive to this peer.
     * Check every 5 seconds. If the peer is not connected and not connecting,
     * then ping the host once.
     */
    ping() {

        //no pinging to thyne own self.
        if(this.LocalID == this.ID || this.Host === "localhost") {
            return;
        }

        setTimeout(() => {
            if(!this.DataConnected && !this.Connecting) {
                this.Connecting = true;
                window.LocalServer.ping(this.Host, this.Port, () => {
                    this.Connecting = false;
                    if(!this.DataConnected)
                        this.connect();
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
}