import { CallOption, DataConnection, MediaConnection, Peer, PeerConnectOption } from "peerjs";
import { Unsubscribe } from "redux";
import { MainController } from "./MainController";
import { Peer as PeerRecord } from './vars';

//1 : Create local peer
//2 : For each peer we want to connect to (manually) create a Peer object
//    using the local id as the name (peer we're connecting as)
//3 : For each peer that connects to us, create a Peer object using the local id
//    to connect to the remote peer's server.
//    
// When a peer has an error, destroy the local peer object and attempt to re-connect.
// For each event, other than data, update the peer update time for the main controller.

/**
 * Manager for P2P connections
 */
class Manager  {

    /**
     * Local peer record for reference.
     */
    protected LocalPeerRecord:PeerRecord|undefined = undefined;

    /**
     * Peer objects for locally connected peers.
     */
    readonly LocalPeers:{[key:string]:Peer|undefined} = {};

    /**
     * Data connection objects for locally connected peers.
     */
    readonly LocalDataConnections:{[key:string]:DataConnection|undefined} = {};

    /**
     * Media connection objects for locally connected peers.
     */
    readonly LocalMediaConnections:{[key:string]:MediaConnection|undefined} = {};

    /**
     * Collection of peer objects, where the key is the remote peer's id.
     * These are peer objects pointing to the remote machine.
     */
    readonly RemotePeers:{[key:string]:Peer|undefined} = {};

    /**
     * Data connections, where the key is the remote peer's id.
     * These are data connection objects for remote machines.
     */
    readonly RemoteDataConnections:{[key:string]:DataConnection|undefined} = {};

    /**
     * Media connections, where the key is the remote peer's id.
     * These are media connection objects for remote machines.
     */
    readonly RemoteMediaConnections:{[key:string]:MediaConnection|undefined} = {};

    constructor() {

    }

    /**
     * Create a peer by connecting to the remote machine.
     * @param id 
     */
    protected createPeer = (id:string) : Peer|undefined => {
        let current = this.getPeer(id);

        //destroy disconnected peer
        if(current && (current.disconnected || !current.open)) {
            this.destroyPeer(id);
            current = undefined;
        }

        if(!current && this.LocalPeerRecord && this.LocalPeerRecord.Name && id && this.LocalPeerRecord.Name !== id) {
            const record = Object.values(MainController.GetState().Peers).find(r => r.Name === id);
            if(record && record.Host && record.Port) {
                const peer = new Peer(this.LocalPeerRecord.Name, {
                    host:record.Host,
                    port:record.Port,
                    path:'peerjs',
                    secure:false
                });

                peer.on('call', (mc:MediaConnection) => {
                    console.log(id + ':call');
                    this.setMediaConnection(id, mc);
                });

                peer.on('close', () => {
                    console.log(id + ':close');
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('connection', (dc:DataConnection) => {
                    console.log(id + ':connection');
                    this.setDataConnection(id, dc);
                });

                peer.on('disconnected', () => {
                    console.log(id + ':disconnected');
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('error', (err:any) => {
                    console.log(id + ':error');
                    console.error(err);
                    console.error(err.type);
                    console.error(err.message);
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('open', () => {
                    console.log(id + ':open');
                    this.openDataConnection(id);
                });

                this.RemotePeers[id] = peer;
                console.log('peer ' + id + ' created');
                this.update();
                return peer;
            }
        }

        return undefined;
    }

    /**
     * Closes all connections including local.
     */
    closeAll = () => {
        console.log('closeAll');
        const local = this.getMyLocalPeer();
        if(local) {
            local.disconnect();
            local.destroy();
        }

        //disconnect and destroy remote peers
        for(let id in this.RemotePeers) {
            const peer = this.RemotePeers[id];
            if(id && peer) {
                peer.disconnect();
                this.destroyPeer(id);
            }
        }

        //disconnect and destroy local peers
        for(let id in this.LocalPeers) {
            const peer = this.LocalPeers[id];
            if(id && peer) {
                peer.disconnect();
                this.destroyPeer(id);
            }
        }

        //clear objects
        let ids = Object.keys(this.LocalPeers);
        ids.forEach(id => { this.LocalPeers[id] = undefined; });
        ids = Object.keys(this.LocalDataConnections);
        ids.forEach(id => { this.LocalDataConnections[id] = undefined; });
        ids = Object.keys(this.LocalMediaConnections);
        ids.forEach(id => { delete this.LocalMediaConnections[id]});

        ids = Object.keys(this.RemotePeers);
        ids.forEach(id => { delete this.RemotePeers[id]; });
        ids = Object.keys(this.RemoteDataConnections);
        ids.forEach(id => { delete this.RemoteDataConnections[id]});
        ids = Object.keys(this.RemoteMediaConnections);
        ids.forEach(id => { delete this.RemoteMediaConnections[id]});

        this.LocalPeerRecord = undefined;
        this.update();
    }

    /**
     * Connects the local peer to the local server instance, so other peers
     * can connect to this computer.
     */
    connectToLocal = () => {
        if(!this.LocalPeerRecord) {
            this.LocalPeerRecord = Object.values(MainController.GetState().Peers).find(r => r.Host === '127.0.0.1');
        }

        if(this.LocalPeerRecord 
            && this.LocalPeerRecord.Name
            && this.LocalPeerRecord.Host 
            && this.LocalPeerRecord.Port) {
            const current = this.getMyLocalPeer();
            if(current && !current.disconnected){
                return;
            }
            
            const id = this.LocalPeerRecord.Name;
            //this.destroyPeer(id);

            console.log(`start local:${this.LocalPeerRecord.Host}:${this.LocalPeerRecord.Port}:${id}`)
            const peer = new Peer(id, {
                host:this.LocalPeerRecord.Host,
                port:this.LocalPeerRecord.Port,
                path:'peerjs',
                secure:false
            });

            peer.on('call', this.onRemoteCall);
            peer.on('close', this.onLocalClose);
            peer.on('connection', this.onRemoteConnection);
            peer.on('disconnected', this.onLocalDisconnected);
            peer.on('error', this.onLocalError);
            peer.on('open', this.onLocalOpen);

            this.LocalPeers[id] = peer;

            this.update();
        }
    }

    /**
     * Connect to a peer.
     * @param id
     */
    connectToPeer = (id:string) => {
        console.log('connectToPeer: ' + id);
        try {
            let peer = this.getPeer(id);

            //destroy disconnected peer
            if(peer && peer.disconnected) {
                this.destroyPeer(id);
            }

            this.createPeer(id);
        } catch(er) {

        }
    }

    /**
     * Destroy the given peer, closing all its open data/media connections, and removing it from
     * the collection of peers.
     * @param id 
     */
    destroyPeer = (id:string) => {
        console.log('destroyPeer: ' + id);
        try {
            let peer = this.LocalPeers[id];
            if(peer && !peer.destroyed) {
                peer.destroy();
            }

            peer = this.RemotePeers[id];
            if(peer && !peer.destroyed) {
                peer.destroy();
            }

        } catch(er) {

        } finally {
            this.LocalPeers[id] = undefined;
            this.LocalDataConnections[id] = undefined;
            this.LocalMediaConnections[id] = undefined;
            this.RemotePeers[id] = undefined;
            this.RemoteDataConnections[id] = undefined;
            this.RemoteMediaConnections[id] = undefined;
        }
        
        this.update();
    }

    /**
     * Returns true if there is a data connection to a locally connected peer.
     * @param id 
     * @returns 
     */
    isLocalData = (id:string) => this.LocalDataConnections[id] ? true : false;

    /**
     * Returns true if there is a media connection to a locally connected peer.
     * @param id 
     * @returns 
     */
    isLocalMedia = (id:string) => this.LocalMediaConnections[id] ? true : false;

    /**
     * Returns true if there is a peer on the local server.
     * @param id 
     * @returns 
     */
    isLocalPeer = (id:string) => this.LocalPeers[id] ? true : false;

    /**
     * Returns true if there is a remote peer for the given id
     * @param id 
     * @returns 
     */
    isRemoteData = (id:string) => this.RemoteDataConnections[id] ? true : false;

    /**
     * Returns true if there is a media connection to a remote peer.
     * @param id 
     * @returns 
     */
    isRemoteMedia = (id:string) => this.RemoteMediaConnections[id] ? true : false;

    /**
     * Returns true if there is a remote connection to a peer's machine.
     * @param id 
     * @returns 
     */
    isRemotePeer = (id:string) => this.RemotePeers[id] ? true : false;

    /**
     * Get the data connection for the given peer id
     * @param id 
     * @returns 
     */
    getDataConnection = (id:string) :DataConnection|undefined => {
        return this.LocalDataConnections[id] || this.RemoteDataConnections[id];
    }

    /**
     * Get local Peer object
     * @returns 
     */
    getMyLocalPeer = () : Peer|undefined => {
        return this.getPeer(this.LocalPeerRecord?.Name || '')
    }

    /**
     * Get the media connection for the given id.
     * @param id 
     * @returns 
     */
    getMediaConnection = (id:string) : MediaConnection|undefined => {
        return this.LocalMediaConnections[id] || this.RemoteMediaConnections[id];
    }
 
    /**
     * Get a peer object
     * @param id 
     * @returns 
     */
    getPeer = (id:string) : Peer|undefined => {
        return this.LocalPeers[id] || this.RemotePeers[id];
    }

    /**
     * Called when the local peer is destroyed
     */
    protected onLocalClose = () => {
        console.log('onLocalClose');
        const peer = this.getMyLocalPeer();
        if(peer && peer.id) {
            this.destroyPeer(peer.id);
        }
    }

    /**
     * Called when the local peer has disconnected from its own server
     */
    protected onLocalDisconnected = () => {
        console.log('onLocalDisconnected');
        const peer = this.getMyLocalPeer();
        if(peer && peer.id) {
            this.destroyPeer(peer.id);
            this.LocalPeerRecord = undefined;
        }
        this.update();
    }

    /**
     * Called when the local peer instance encounters an error
     * @param err 
     */
    protected onLocalError = (err:any) => {
        console.log('onLocalError');
        console.error(err);
        const peer = this.getMyLocalPeer();
        if(peer && peer.id) {
            this.destroyPeer(peer.id);
            this.update();
        }
    }

    /**
     * Called when the local peer connects to its local server.
     */
    protected onLocalOpen = () => {
        console.log('onLocalOpen');
        this.update();
    }

    /**
     * Called when a remote peer issues a media connection request
     * @param mc 
     */
    private onRemoteCall = (mc:MediaConnection) => {
        console.log('onRemoteCall: ' + mc.peer);
        if(mc && mc.peer) {
            this.setMediaConnection(mc.peer, mc);
        }
    }

    /**
     * Called when a remote peer issues a data connection request.
     * @param dc 
     */
    protected onRemoteConnection = (dc:DataConnection) => {
        console.log('onRemoteConnection: ' + dc.peer);
        if(dc && dc.peer) {
            this.setDataConnection(dc.peer, dc);
        }
    }

    /**
     * Establish a data connection to the given peer.
     * @param id 
     * @param options
     * @returns 
     */
    openDataConnection = (id:string, options?:PeerConnectOption) : boolean => {
        let peer = this.getPeer(id);
        console.log('openDataConnection: ' + id);
        if(!peer)
            peer = this.createPeer(id);

        if(peer) {
            try {
                this.setDataConnection(id, peer.connect(id, options));
                return true;
            } catch(er) {

            }
        }

        return false;
    }

    /**
     * Call the peer to begin a media stream.
     * @param id 
     * @param stream
     * @param options
     * @returns 
     */
    openMediaConnection = (id:string, stream?:MediaStream, options?:CallOption) : boolean => {
        console.log('openMediaConnection: ' + id);
        let peer = this.getPeer(id);
        if(!stream)
            return false;

        if(!peer)
            peer = this.createPeer(id);

        if(peer) {
            try {
                this.setMediaConnection(id, peer.call(id, stream, options));
                return true;
            } catch(er) {

            }
        }

        return false;
    }

    /**
     * Set the data connection for the given peer.
     * @param id 
     * @param dc 
     */
    setDataConnection = (id:string, dc:DataConnection) => {
        console.log('setDataConnection: ' + id);
        const current = this.getDataConnection(id);
        if(current && current.open)
            return;
        this.createPeer(id);
        if(this.isRemotePeer(id))
            this.RemoteDataConnections[id] = dc;
        else
            this.LocalDataConnections[id] = dc;

        dc.on('close', () => {
            console.log('dc:close:' + id);
            this.destroyPeer(id);
            this.update();
        });

        dc.on('data', (data:any) => {
            console.log('dc:data:' + id);
            console.log(data);
        });

        dc.on('error', (err:any) => {
            console.error('dc:error:' + id);
            console.error(err);
            this.update();
        });

        dc.on('iceStateChanged', () => {
            console.log('dc:iceStateChanged:' + id);
            this.update();
        })

        dc.on('open', () => {
            console.log('dc:open:' + id);
            this.update();
        })

        this.update();
    }

    /**
     * Set the local peer record for reference.
     * @param record 
     */
    setLocalRecord = (record:PeerRecord) => {
        console.log('setLocalRecord: ' + record.Name);
        this.LocalPeerRecord = record;
        this.update();
    }

    /**
     * Set the media connection for the given peer id
     * @param id 
     * @param mc 
     */
    setMediaConnection = (id:string, mc:MediaConnection) => {
        console.log('setMediaConnection: ' + id);
        const current = this.getMediaConnection(id);
        if(current && current.open)
            return;
        this.createPeer(id);
        if(this.isRemotePeer(id))
            this.RemoteMediaConnections[id] = mc;
        else
            this.LocalMediaConnections[id] = mc;

        mc.on('close', () => {
            console.log('mc:close:' + id);
            this.LocalMediaConnections[id] = undefined;
            this.RemoteMediaConnections[id] = undefined;
            this.update();
        });

        mc.on('error', (err:any) => {
            console.log('mc:error:' + id);
            console.error(err);
            this.update();
        })

        mc.on('iceStateChanged', () => {
            console.log('mc:iceStateChanged:' + id);
            this.update();
        })

        mc.on('stream', (ms:MediaStream) => {
            console.log('mc:stream:' + id);
            console.log(ms);
            this.update();
        });

        this.update();
    }

    private update = () => MainController.SetPeerConnectionTime();
}

const PeerManager = new Manager();
export {PeerManager};