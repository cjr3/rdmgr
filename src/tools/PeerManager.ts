import { CallOption, DataConnection, MediaConnection, Peer, PeerConnectOption } from "peerjs";
import { Unsubscribe } from "redux";
import { RemoveMediaPath } from "./data";
import { MainController } from "./MainController";
import { BreakClock } from "./scoreboard/breakclock";
import { GameClock } from "./scoreboard/gameclock";
import { JamClock } from "./scoreboard/jamclock";
import { ClockStatus, Peer as PeerRecord, PeerData, SClock, SScoreboard } from './vars';

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

    protected LocalIPAddress:string = '';
    protected LocalPort:number = 0;

    /**
     * Media connection objects for locally connected peers.
     */
    readonly LocalMediaConnections:{[key:string]:MediaConnection|undefined} = {};

    /**
     * Current peer records
     */
    protected PeerRecords:PeerRecord[] = [];

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

    protected remote?:Unsubscribe;

    /**
     * Timestamp when peer records were last updated.
     * Not the same timestamp when peer status is updated.
     */
    protected PeerUpdateTime:number = 0;

    constructor() {
        this.remote = MainController.Subscribe(this.updatePeerRecords);
        this.LocalIPAddress = MainController.GetState().LocalIPAddress;
    }

    /**
     * 
     * @param path 
     * @param peerId
     * @returns 
     */
    protected addAPIPath = (path:string, peerId:string = '') : string => {
        let ipAddress = this.LocalIPAddress;
        let port = (this.LocalPeerRecord && this.LocalPeerRecord.Port) ? this.LocalPeerRecord.Port : 0;
        if(peerId) {
            const peer = this.PeerRecords.find(r => r.Name === peerId);
            if(peer && peer.Host && peer.Port) {
                ipAddress = peer.Host;
                port = peer.Port;
            }
        }

        if(path 
            && !path.startsWith('http://')
            && !path.startsWith('https://')
            && ipAddress 
            && port) {
            let url = 'http://' + ipAddress + ':' + port + '/api/';
            if(path.search(/(.*?)\.{1}(png|jpg|jpeg|gif){1}$/) >= 0) {
                url += 'image/' + RemoveMediaPath(path);
            }

            //condition for other file types
            //videos ???

            //replace backslash with forward slash
            url = url.replace(/\//ig, '/');

            return url;
        }
        return path;
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
                    // console.log(id + ':call');
                    this.setMediaConnection(id, mc);
                });

                peer.on('close', () => {
                    // console.log(id + ':close');
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('connection', (dc:DataConnection) => {
                    // console.log(id + ':connection');
                    this.setDataConnection(id, dc);
                });

                peer.on('disconnected', () => {
                    // console.log(id + ':disconnected');
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('error', (err:any) => {
                    // console.log(id + ':error');
                    // console.error(err);
                    // console.error(err.type);
                    // console.error(err.message);
                    this.destroyPeer(id);
                    this.update();
                });

                peer.on('open', () => {
                    // console.log(id + ':open');
                    this.openDataConnection(id);
                });

                this.RemotePeers[id] = peer;
                // console.log('peer ' + id + ' created');
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
        // console.log('closeAll');
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

            // console.log(`start local:${this.LocalPeerRecord.Host}:${this.LocalPeerRecord.Port}:${id}`)
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
        // console.log('connectToPeer: ' + id);
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
        // console.log('destroyPeer: ' + id);
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
     * Force reload the peer records.
     */
    load = () => {
        this.PeerRecords = Object.values(MainController.GetState().Peers);
        this.LocalIPAddress = MainController.GetState().LocalIPAddress;
    }

    /**
     * Called when the local peer is destroyed
     */
    protected onLocalClose = () => {
        // console.log('onLocalClose');
        const peer = this.getMyLocalPeer();
        if(peer && peer.id) {
            this.destroyPeer(peer.id);
        }
    }

    /**
     * Called when the local peer has disconnected from its own server
     */
    protected onLocalDisconnected = () => {
        // console.log('onLocalDisconnected');
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
        // console.log('onLocalError');
        // console.error(err);
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
        // console.log('onLocalOpen');
        this.update();
    }

    /**
     * Handle received data.
     * @param id Peer Name
     * @param data message data
     */
    protected onReceiveData = async (id:string, data:any) => {
        try {
            // console.log(id);
            // console.log(data);
            let values:PeerData|undefined = undefined;
            const pr = this.PeerRecords.find(r => r.Name === id);
            if(typeof(data) === 'string')
                values = JSON.parse(data);
            else if(typeof(data) === 'object' && data !== null)
                values = data;

            if(values && values.type) {
                switch(values.type) {
                    //copy state
                    case 'state' :
                        if(values.app && values.data && pr && pr.ReceiveApplications && pr.ReceiveApplications.indexOf(values.app) >= 0) {
                            switch(values.app) {
                                //clocks
                                case 'CLK' :
                                    try {
                                        const state:SClock = values.data;
                                        GameClock.stop();
                                        JamClock.stop();
                                        BreakClock.stop();

                                        GameClock.set(state.GameHour || 0, 
                                            state.GameMinute || 0,
                                            state.GameSecond || 0,
                                            0);
                                        
                                        JamClock.set(state.JamHour || 0, 
                                            state.JamMinute || 0,
                                            state.JamSecond || 0,
                                            0);
                                        
                                        BreakClock.set(state.BreakHour || 0, 
                                            state.BreakMinute || 0,
                                            state.BreakSecond || 0,
                                            0);
                                        // MainController.UpdateClockState(state);
                                    } catch(er) {

                                    }
                                break;

                                //scoreboard state
                                case 'SB' :
                                    try {
                                        const state:SScoreboard = values.data;

                                        //stop clocks
                                        // GameClock.stop();
                                        // JamClock.stop();
                                        // BreakClock.stop();
                                        // if(state.GameClock)
                                        //     state.GameClock.Status = ClockStatus.STOPPED;
                                        // if(state.BreakClock)
                                        //     state.BreakClock.Status = ClockStatus.STOPPED;
                                        // if(state.JamClock)
                                        //     state.JamClock.Status = ClockStatus.STOPPED;

                                        //add remote peer's media path
                                        // if(state.TeamA) {
                                        //     if(state.TeamA.Logo)
                                        //         state.TeamA.Logo = this.addAPIPath(state.TeamA.Logo, id);

                                        //     if(state.TeamA.ScoreboardThumbnail)
                                        //         state.TeamA.ScoreboardThumbnail = this.addAPIPath(state.TeamA.ScoreboardThumbnail, id);
                                        // }

                                        // if(state.TeamB) {
                                        //     if(state.TeamB.Logo)
                                        //         state.TeamB.Logo = this.addAPIPath(state.TeamB.Logo, id);

                                        //     if(state.TeamB.ScoreboardThumbnail)
                                        //         state.TeamB.ScoreboardThumbnail = this.addAPIPath(state.TeamB.ScoreboardThumbnail, id);
                                        // }

                                        // console.log(state);
                                        // update clocks - they don't read from the scoreboard
                                        // and the UI reads from the clocks, not the scoreboard.
                                        // if(state.GameClock) {
                                        //     GameClock.set(state.GameClock.Hours || 0, 
                                        //         state.GameClock.Minutes || 0,
                                        //         state.GameClock.Seconds || 0,
                                        //         state.GameClock.Tenths || 0);
                                        // }

                                        // if(state.JamClock) {
                                        //     JamClock.set(state.JamClock.Hours || 0, 
                                        //         state.JamClock.Minutes || 0,
                                        //         state.JamClock.Seconds || 0,
                                        //         state.JamClock.Tenths || 0);
                                        // }

                                        // if(state.BreakClock) {
                                        //     BreakClock.set(state.BreakClock.Hours || 0, 
                                        //         state.BreakClock.Minutes || 0,
                                        //         state.BreakClock.Seconds || 0,
                                        //         state.BreakClock.Tenths || 0);
                                        // }

                                        MainController.UpdateScoreboardState(state);

                                    } catch(er) {
                                        console.error(er);
                                    }
                                break;
                            }
                        }
                    break;

                    //receive chat message
                    case 'message' : 
                        if(values.message) {
                            //add message to chat state
                        }
                    break;
                }
            }
        } catch(er:any) {
            alert(er.message);
        }
    }

    /**
     * Called when a remote peer issues a media connection request
     * @param mc 
     */
    private onRemoteCall = (mc:MediaConnection) => {
        // console.log('onRemoteCall: ' + mc.peer);
        if(mc && mc.peer) {
            this.setMediaConnection(mc.peer, mc);
        }
    }

    /**
     * Called when a remote peer issues a data connection request.
     * @param dc 
     */
    protected onRemoteConnection = (dc:DataConnection) => {
        // console.log('onRemoteConnection: ' + dc.peer);
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
        // console.log('openDataConnection: ' + id);
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
        // console.log('openMediaConnection: ' + id);
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
     * Send data to all listening peers.
     * @param data 
     * @param id Peer id to send to if applicable; otherwise, will send to all peers configured to send data to.
     */
    sendData = async (data:PeerData, id:string = '') => {
        try {
            if(id) {
                let dc = this.getDataConnection(id);
                if(dc) {
                    this.sendDataToPeer(data, dc, id);
                }
            } else {
                for(let key in this.LocalDataConnections) {
                    let dc = this.LocalDataConnections[key];
                    if(dc) {
                        this.sendDataToPeer(data, dc, key);
                    }
                }

                for(let key in this.RemoteDataConnections) {
                    let dc = this.RemoteDataConnections[key];
                    if(dc) {
                        this.sendDataToPeer(data, dc, key);
                    }
                }
            }
        } catch(er:any) {

        }
    }

    /**
     * Send data to a peer.
     * @param data 
     * @param dc
     * @param id 
     */
    protected sendDataToPeer = async (data:PeerData, dc:DataConnection, id:string) => {
        try {
            if(data && dc && dc.open && id) {
                switch(data.type) {
                    case 'state' :
                        if(data.app && data.data) {
                            const pr = this.PeerRecords.find(p => p.Name === id);

                            if(pr && pr.SendApplications && pr.SendApplications.indexOf(data.app) >= 0) {
                                // console.log(data);
                                dc.send(data);
                            }
                        }
                    break;

                    case 'message' :
                        if(data.message) {
                            dc.send(data);
                        }
                    break;
                }
            }
        } catch(er:any) {
            console.error(er);
        }
    }

    /**
     * Set the data connection for the given peer.
     * @param id 
     * @param dc 
     */
    setDataConnection = (id:string, dc:DataConnection) => {
        // console.log('setDataConnection: ' + id);
        // const current = this.getDataConnection(id);
        // if(current && current.open) {
        //     console.log('currently open');
        //     return;
        // }
        this.createPeer(id);
        if(this.isRemotePeer(id))
            this.RemoteDataConnections[id] = dc;
        else
            this.LocalDataConnections[id] = dc;

        dc.on('close', () => {
            // console.log('dc:close:' + id);
            this.destroyPeer(id);
            this.update();
        });

        dc.on('data', (data:any) => {
            // console.log('dc:data:' + id);
            // console.log(data);
            this.onReceiveData(id, data);
        });

        dc.on('error', (err:any) => {
            // console.error('dc:error:' + id);
            // console.error(err);
            this.update();
        });

        dc.on('iceStateChanged', () => {
            // console.log('dc:iceStateChanged:' + id);
            this.update();
        })

        dc.on('open', () => {
            // console.log('dc:open:' + id);
            this.update();
        })

        this.update();
    }

    /**
     * Set the local peer record for reference.
     * @param record 
     */
    setLocalRecord = (record:PeerRecord) => {
        // console.log('setLocalRecord: ' + record.Name);
        this.LocalPeerRecord = record;
        this.update();
    }

    /**
     * Set the media connection for the given peer id
     * @param id 
     * @param mc 
     */
    setMediaConnection = (id:string, mc:MediaConnection) => {
        // console.log('setMediaConnection: ' + id);
        const current = this.getMediaConnection(id);
        if(current && current.open)
            return;
        this.createPeer(id);
        if(this.isRemotePeer(id))
            this.RemoteMediaConnections[id] = mc;
        else
            this.LocalMediaConnections[id] = mc;

        mc.on('close', () => {
            // console.log('mc:close:' + id);
            this.LocalMediaConnections[id] = undefined;
            this.RemoteMediaConnections[id] = undefined;
            this.update();
        });

        mc.on('error', (err:any) => {
            // console.log('mc:error:' + id);
            // console.error(err);
            this.update();
        })

        mc.on('iceStateChanged', () => {
            // console.log('mc:iceStateChanged:' + id);
            this.update();
        })

        mc.on('stream', (ms:MediaStream) => {
            // console.log('mc:stream:' + id);
            // console.log(ms);
            this.update();
        });

        this.update();
    }

    private update = () => MainController.SetPeerConnectionTime();

    /**
     * Update peer records when updated
     */
    protected updatePeerRecords = () => {
        const mstate = MainController.GetState();
        if(mstate.UpdateTimePeers !== this.PeerUpdateTime) {
            this.LocalIPAddress = mstate.LocalIPAddress;
            this.PeerRecords = Object.values(mstate.Peers);
            const lp = this.PeerRecords.find(r => r.Host === '127.0.0.1' && r.Name && r.Port);
            if(lp) {
                this.LocalPeerRecord = lp;
            }

            this.PeerUpdateTime = mstate.UpdateTimePeers;
        }
    }
}

const PeerManager = new Manager();
export {PeerManager};