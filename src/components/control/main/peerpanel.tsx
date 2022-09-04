import { IconOffline, IconOnline } from 'components/common/icons';
import { Panel, PanelContent, PanelFooter, PanelTitle } from 'components/common/panel';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import React from 'react';
import { Unsubscribe } from 'redux';
import { MainController } from 'tools/MainController';
import { PeerManager } from '../../../tools/PeerManager';
import { Peer as PeerRecord } from '../../../tools/vars';

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
     * Trigger the connection to the local server.
     * @param ev 
     */
    protected onClickConnectLocal = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        PeerManager.connectToLocal();
    }

    /**
     * Disconnect from all peers
     * @param ev 
     */
    protected onClickDisconnect = (ev:React.MouseEvent<HTMLElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        if(ev.ctrlKey) {
            PeerManager.closeAll();
        }
    }

    /**
     * 
     */
    protected update = () => {
        // console.log('update')
        const records = Object.values(MainController.GetState().Peers);
        const local = records.find(r => r.Host === '127.0.0.1');
        const localPeer = PeerManager.getMyLocalPeer();
        // console.log(localPeer);
        let localId = '';
        let connected = false;
        if(localPeer && localPeer.id) {
            localId = localPeer.id;
            if(localPeer && !localPeer.disconnected) {
                connected = true;
            }
        }
        
        this.setState({
            connected:connected,
            peers:records.filter(r => r.Name !== localId),
            localId:local?.Name || '',
            localIp:MainController.GetState().LocalIPAddress,
            localPort:local?.Port || 0,
            updateTime:MainController.GetState().PeerConnectionTime
        });
    }
    
    componentDidMount() {
        this.update();
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

        // console.log(this.state.peers.length);

        return <Panel active={this.props.active} onHide={this.props.onHide}>
            <PanelTitle onHide={this.props.onHide}>{title}</PanelTitle>
            <PanelContent>
                {
                    (this.state.connected) &&
                    <>
                    {
                        this.state.peers.map((record, index) => {
                            if(!record.Name) {
                                return null;
                            }


                            let id = record.Name;
                            // let peer = PeerManager.getPeer(id);
                            let dc = PeerManager.getDataConnection(id);
                            // let mc = PeerManager.getMediaConnection(id);
                            // let connected = (peer && !peer.disconnected) ? true : false;
                            let dataConnected = (dc && dc.open) ? true : false;
                            // let mediaConnected = (mc && mc.open) ? true : false;

                            return <div style={{
                                display:'grid',
                                gridTemplateColumns:'1fr auto auto',
                                alignItems:'center'
                            }}
                                key={`peer-${id}-${index}`}
                            >
                                <span style={{padding:'6px'}}>{id}</span>
                                {
                                    (dataConnected) &&
                                    <>
                                        <IconOnline
                                            title='Connected. Ctrl+Click to disconnect.'
                                            onClick={ev => {
                                                ev.stopPropagation();
                                                ev.preventDefault();
                                                if(ev.ctrlKey && record.Name) {
                                                    PeerManager.destroyPeer(record.Name)
                                                }
                                            }}
                                        />
                                    </>
                                }
                                {
                                    (!dataConnected) &&
                                    <IconOffline
                                        title='Not connected. Click to connect.'
                                        onClick={ev => {
                                            ev.stopPropagation();
                                            ev.preventDefault();
                                            PeerManager.connectToPeer(id)
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