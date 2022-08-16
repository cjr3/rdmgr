import { IconOffline, IconOnline } from 'components/common/icons';
import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import React from 'react';
import { Unsubscribe } from 'redux';
import { MainController } from 'tools/MainController';
import { LocalPeers, Peer as PeerRecord, RemoteDataConnections, RemoteMediaConnections } from '../../../tools/vars';

interface Props {
    active:boolean;
    onHide:{():void};
}

interface State {
    /**
     * True if the current user has connected to their server.
     */
    connected:boolean;
    /**
     * Peers connected to the server
     */
    connectedPeers:string[];
    /**
     * Local peer id from the first host with a host of 127.0.0.1
     */
    localId:string;
    /**
     * Local IP Address for peers to connect to
     */
    localIp:string;
    /**
     * Local port number
     */
    localPort:number;
    /**
     * Available peers
     */
    peers:PeerRecord[];
    /**
     * Timestamp when peer connections were last updated.
     */
    updateTime:number;
}

/**
 * Panel to manage peer-to-peer connections.
 */
class PeerPanel extends React.PureComponent<Props, State> {
    readonly state:State = {
        connected:false,
        connectedPeers:[],
        localIp:'',
        localId:'',
        localPort:0,
        peers:[],
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected checkTimer:any = 0;

    /**
     * 
     * @param id 
     * @param dc 
     */
    protected addDataConnection = (id:string, dc:DataConnection) => {
        RemoteDataConnections[id] = dc;
        console.log('addDataConnection: ' + id);
        dc.on('close', () => {
            console.log('dc: close ' + id);
            this.removeDataConnection(id);
        });

        dc.on('data', (data:any) => {
            console.log('data received ' + id);
            console.log(data);
        })

        dc.on('error', (err) => {
            console.log('dc error ' + id);
            console.error(err);
            this.removeDataConnection(id);
        })

        dc.on('iceStateChanged', (state:RTCIceConnectionState) => {
            console.log('dc: iceStateChanged ' + id);
            console.log(state);
            MainController.SetPeerConnectionTime();
        });

        dc.on('open', () => {
            console.log('dc: open ' + id);
            MainController.SetPeerConnectionTime();
        });

        
        MainController.SetPeerConnectionTime();
    }

    protected addMediaConnection = (id:string, mc:MediaConnection) => {
        mc.on('close', () => {
            this.removeMediaConnection(id);
        });

        mc.on('error', () => {
            try {
                mc.close();
            } catch {

            }
        });

        mc.on('iceStateChanged', () => {
            MainController.SetPeerConnectionTime();
        });

        mc.on('stream', (ms:MediaStream) => {
            
        });

        MainController.SetPeerConnectionTime();
    }

    protected removeDataConnection = (id:string) => {
        RemoteDataConnections[id] = undefined;
        MainController.SetPeerConnectionTime();
    }

    protected removeMediaConnection = (id:string) => {
        RemoteMediaConnections[id] = undefined;
        MainController.SetPeerConnectionTime();
    }

    /**
     * Connect to the localhost
     */
    protected connectToLocal = () => {
        if(this.state.localId && this.state.localIp && this.state.localPort) {
            let peer = this.getLocal();
            // console.log(peer);
            if(peer && peer.disconnected) {
                try {
                    peer.destroy();
                } catch(er) {
                    
                } finally {
                    peer = undefined;
                }
            } else if(peer && !peer.disconnected) {
                //already connected to local
                this.setState({connected:true});
                MainController.SetPeerConnectionTime();
                return;
            }

            try {
                peer = new Peer(this.state.localId, {
                    host:'127.0.0.1',
                    port:this.state.localPort,
                    secure:false,
                    path:'peerjs'
                });
    
                peer.on('open', this.onRemoteOpen);
                peer.on('call', this.onRemoteCall);
                peer.on('close', this.onRemoteClose);
                peer.on('connection', this.onRemoteConnection);
                peer.on('disconnected', this.onRemoteDisconnected);
                peer.on('error', this.onRemoteError);
                LocalPeers[this.state.localId] = peer;
                this.setState({connected:true}, this.checkPeers);
            } catch(er) {
                if(peer) {
                    try {
                        peer.destroy();
                    } catch(er) {

                    } finally {
                        LocalPeers[this.state.localId] = undefined;
                    }
                }
            } finally {
                MainController.SetPeerConnectionTime();
            }
        }
    }

    /**
     * 
     * @param id 
     */
    protected connectToPeer = (id:string) => {
        try {
            let local = this.getLocal();
            const record = this.state.peers.find(r => r.Name === id);
            if(record && id && local && !local.disconnected) {
                try {
                    let dc = RemoteDataConnections[id];
                    if(!dc) {
                        dc = local.connect(id);
                        if(dc) {
                            this.addDataConnection(id, dc);
                        }
                    }
                } catch(er) {

                }
            }
        } catch(er) {

        }
    }

    /**
     * Close connection to peer
     * @param id 
     */
    protected disconnectFromPeer = (id:string) => {
        console.log('disconnectFromPeer: ' + id);
        const localp = LocalPeers[id];
        const dc = RemoteDataConnections[id];
        const mc = RemoteMediaConnections[id];
        if(dc) {
            try {
                console.log('closing data connection: ' + id);
                dc.close();
            } catch(er) {

            } finally {
                RemoteDataConnections[id] = undefined;
            }
        }

        if(mc) {
            try {
                console.log('closing media connection ' + id);
                mc.close();
            } catch(er) {

            } finally {
                RemoteMediaConnections[id] = undefined;
            }
        }

        if(localp) {
            try {
                localp.disconnect();
            } catch(er) {

            } finally {
                LocalPeers[id] = undefined;
            }
        }
        
        MainController.SetPeerConnectionTime();
    }

    /**
     * Update connected peers
     */
    protected checkPeers = async () : Promise<void> => {
        console.log('checkPeers');
        let ids:string[] = [];
        try {
            clearTimeout(this.checkTimer);
        } catch(er) {

        }

        try {
            if(this.state.localId && this.state.localIp && this.state.localPort) {
                const response = await fetch('http://127.0.0.1:' + this.state.localPort + '/peers');
                const data = await response.text();
                if(data && data.length) {
                    ids = data.split(',');
                }
            }
        } catch(er) {

        } finally {
            this.checkTimer = setTimeout(this.checkPeers, 15000);
            this.state.connectedPeers.forEach(id => {
                if(ids.indexOf(id) < 0) {
                    this.disconnectFromPeer(id);
                }
            });
            this.setState({connectedPeers:ids});
        }
    }

    /**
     * Get peer object for local peer
     * @returns 
     */
    protected getLocal = () : Peer|undefined => {
        return (this.state.localId && this.state.localIp && this.state.localPort) ? LocalPeers[this.state.localId] : undefined;
    }

    /**
     * Trigger the connection to the local server.
     * @param ev 
     */
    protected onClickConnectLocal = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.connectToLocal();
    }

    /**
     * Disconnect from all peers
     * @param ev 
     */
    protected onClickDisconnect = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        if(ev.ctrlKey) {
            for(let key in LocalPeers) {
                let peer = LocalPeers[key];
                try {
                    if(peer) {
                        peer.destroy();
                    }
                } catch(er) {

                } finally {
                    LocalPeers[key] = undefined;
                }
            }

            for(let key in RemoteDataConnections) {
                RemoteDataConnections[key] = undefined;
            }

            for(let key in RemoteMediaConnections) {
                RemoteMediaConnections[key] = undefined;
            }

            console.log('closed?')
            MainController.SetPeerConnectionTime();
            this.setState({connected:false});
        }
    }
    
    /**
     * Called when a peer makes a call to send media streams
     * @param mc 
     */
    protected onRemoteCall = (mc:MediaConnection) => {
        console.log('remote call');
        //mc.answer(); //to answer calls so the peer can send audio/video
    }

    /**
     * Called when a remote peer closes its connection.
     * - Update disconnected peers
     */
    protected onRemoteClose = () => {
        console.log('remote close');
        MainController.SetPeerConnectionTime();
    }

    /**
     * Called when a peer establishes a data connection
     * @param dc 
     */
    protected onRemoteConnection = (dc:DataConnection) => {
        console.log('onRemoteConnection: ' + dc.peer);
        if(dc && dc.peer) {
            this.addDataConnection(dc.peer, dc);
        }
    }

    /**
     * Called when a remote peer disconnects.
     * - Check which peers are disconnected and update their status
     */
    protected onRemoteDisconnected = (id:string) => {
        console.log('remote disconnected');
        if(id && this.state.localId && id === this.state.localId) {
            const peer = this.getLocal();
            if(peer) {
                try {
                    peer.destroy();
                } catch(er) {
                    console.error(er);
                } finally {
                    LocalPeers[id] = undefined;
                }
            }

            this.setState({connected:false});

            if(RemoteDataConnections[id]) {
                delete RemoteDataConnections[id];
            }

            if(RemoteMediaConnections[id]) {
                delete RemoteMediaConnections[id];
            }
            
            MainController.SetPeerConnectionTime();
        }
    }

    /**
     * Called when a remote peer encounters and error
     * @param err 
     */
    protected onRemoteError = (err:any) => {
        // console.error('remote error');
        console.error(err);
        MainController.SetPeerConnectionTime();
    }

    /**
     * Called when a remote peer opens a connection to this local peer
     * @param id 
     */
    protected onRemoteOpen = (id:string) => {
        console.log('remote open: ' + id);
        MainController.SetPeerConnectionTime();
    }

    /**
     * 
     */
    protected update = () => {
        const records = Object.values(MainController.GetState().Peers);
        const local = records.find(r => r.Host === '127.0.0.1');
        // console.log(local);
        this.setState({
            peers:records,
            localId:local?.Name || '',
            localIp:MainController.GetState().LocalIPAddress,
            localPort:local?.Port || 0,
            updateTime:MainController.GetState().PeerConnectionTime
        });
    }

    /**
     * 
     */
    protected updateFirst = () => {
        const records = Object.values(MainController.GetState().Peers);
        const local = records.find(r => r.Host === '127.0.0.1');
        if(local && local.Name && local.Port) {
            const peer = LocalPeers[local.Name];
            if(peer && !peer.disconnected) {
                this.setState({connected:true});
                MainController.SetPeerConnectionTime();
            }
        }
    }
    
    componentDidMount() {
        this.update();
        this.updateFirst();
        this.remote = MainController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render(): React.ReactNode {
        let title = 'No Localhost Record';
        let local = false;
        if(this.state.localId && this.state.localIp && this.state.localPort) {
            title = this.state.localIp + ':' + this.state.localPort + ' (' + this.state.localId + ')';
            local = true;
        }

        return <Panel active={this.props.active} onHide={this.props.onHide}>
            <PanelTitle onHide={this.props.onHide}>{title}</PanelTitle>
            <PanelContent>
                {
                    (this.state.connected) &&
                    <>
                    {
                        this.state.peers.map((record, index) => {
                            let sconnected = (record && record.Name && this.state.connectedPeers.indexOf(record.Name) >= 0);
                            if(!record.Name || record.Name === this.state.localId || !record.Host || !record.Port || !sconnected) {
                                return null;
                            }
                            
                            let peer:Peer|undefined = LocalPeers[record.Name];
                            let connected = (peer && !peer.disconnected) ? true : false;

                            if(!connected) {
                                connected = (RemoteDataConnections[record.Name]) ? true : false;
                            }

                            if(!connected) {
                                connected = (RemoteMediaConnections[record.Name]) ? true : false;
                            }

                            return <div style={{
                                display:'grid',
                                gridTemplateColumns:'1fr auto auto',
                                alignItems:'center'
                            }}
                                key={`peer-${record.Name}-${record.Port}-${record.Host}-${index}`}
                            >
                                <span style={{padding:'6px'}}>{record.Name}</span>
                                {
                                    (connected) &&
                                    <IconOnline
                                        title='Connected. Ctrl+Click to disconnect.'
                                        onClick={ev => {
                                            ev.stopPropagation();
                                            ev.preventDefault();
                                            if(ev.ctrlKey && record.Name) {
                                                this.disconnectFromPeer(record.Name);
                                            }
                                        }}
                                    />
                                }
                                {
                                    (!connected) &&
                                    <IconOffline
                                        title='Not connected. Click to connect.'
                                        onClick={ev => {
                                            ev.stopPropagation();
                                            ev.preventDefault();
                                            this.connectToPeer(record.Name || '');
                                        }}
                                    />
                                }
                            </div>
                        })
                    }
                    </>
                }
                {
                    (!this.state.connected && local) &&
                    <p style={{padding:'12px'}}>Click Start Server to accept connections from peers.</p>
                }
            </PanelContent>
            <PanelFooter>
                {
                    (!this.state.connected) &&
                    <button onClick={this.onClickConnectLocal}>
                        Start Server
                    </button>
                }
                {
                    (this.state.connected) &&
                    <button onClick={this.onClickDisconnect} title='Ctrl+Click to disconnect all peers including self.'>Stop Server</button>
                }
            </PanelFooter>
        </Panel>
    }
}

export {PeerPanel};