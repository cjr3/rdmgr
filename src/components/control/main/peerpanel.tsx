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
        localIp:'',
        localId:'',
        localPort:0,
        peers:[],
        updateTime:0
    }

    protected remote?:Unsubscribe;

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
                this.setState({connected:true});
            } catch(er) {
                if(peer) {
                    try {
                        peer.destroy();
                    } catch(er) {

                    } finally {
                        LocalPeers[this.state.localId] = undefined;
                    }
                }
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
            if(id && local && !local.disconnected) {
                let peer = LocalPeers[id];
                if(peer && !peer.disconnected) {
                    //already connected
                    return;
                } else if(peer && peer.disconnected) {
                    //peer disconnected - destroy and connect
                    peer.destroy();
                    local.connect(id);
                } else {
                    local.connect(id);
                }
            }
        } catch(er) {

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

            MainController.SetPeerConnectionTime();
        }
    }
    
    /**
     * Called when a peer makes a call to receive media streams
     * @param mc 
     */
    protected onRemoteCall = (mc:MediaConnection) => {
        console.log('remote call');
        //mc.answer(); //to answer calls and send a media stream back
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
        console.log('remote data connection');
        dc.on('close', () => {
            console.log('remote data connection closed');
            console.log(dc.peer);
            console.log(RemoteDataConnections[dc.peer]);
            if(dc && dc.peer && RemoteDataConnections[dc.peer]) {
                RemoteDataConnections[dc.peer] = undefined;
                MainController.SetPeerConnectionTime();
            }
        });

        dc.on('data', (data:any) => {
            console.log('data received from ' + dc.peer);
            console.log(data);
        });

        dc.on('error', (err) => {
            console.log('remote data error');
            console.error(err);
            MainController.SetPeerConnectionTime();
        });
        dc.on('iceStateChanged', () => {
            console.log('remote data connection ice state changed');
            MainController.SetPeerConnectionTime();
        });
        dc.on('open', () => {
            console.log('remote data connection open');
            MainController.SetPeerConnectionTime();
        });
        // console.log(dc);
        // console.log('...?');
        RemoteDataConnections[dc.peer] = dc;
        MainController.SetPeerConnectionTime();
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
        console.log('remote open');
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
                            
                            if(!record.Name || record.Name === this.state.localId || !record.Host || !record.Port) {
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
                                    />
                                }
                                {
                                    (!connected) &&
                                    <IconOffline
                                        title='Not connected. Click to connect.'
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