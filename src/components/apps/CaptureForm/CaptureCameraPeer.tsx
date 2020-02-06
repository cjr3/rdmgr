import React from 'react';
import Camera from 'components/tools/Camera';
import CameraController from 'controllers/CameraController';
import CaptureStatus from 'tools/CaptureStatus';
import cnames from 'classnames';
import './css/CaptureCameraPeer.scss';

/**
 * Component for displaying the camera on the capture window.
 */
export default class CaptureCameraPeer extends React.PureComponent<{
    /**
     * Determines if the camera is shown or not
     */
    shown:boolean;
    /**
     * Determines how the camera is shown
     */
    className?:string;
}, {
    PeerID:string;
}> {
    readonly state = {
        PeerID:CameraController.GetState().PeerID
    };

    /**
     * Camera reference
     */
    protected CameraItem:React.RefObject<Camera> = React.createRef();
    /**
     * CameraController remote
     */
    protected remoteState:Function|null = null;

    protected PeerSource:MediaStream|undefined = undefined;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.CameraItem = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
        this.onPeerStream = this.onPeerStream.bind(this);
        this.onPeerStreamError = this.onPeerStreamError.bind(this);
        this.onPeerStreamClose = this.onPeerStreamClose.bind(this);
    }

    /**
     * 
     */
    updateState() {
        this.setState({
            PeerID:CameraController.GetState().PeerID
        });
    }

    /**
     * Triggered when the camera starts streaming to a peer.
     * @param {MediaStream} stream
     */
    onStream(stream:MediaStream) {
        if(window && window.LocalServer) {
            window.LocalServer.LocalPeer.setStream(stream);
            //window.LocalServer.LocalPeer.play();
        }
    }

    /**
     * Triggered when a peer streams
     * @param stream MediaStream
     */
    onPeerStream(peer, stream:MediaStream) {
        this.PeerSource = stream;
        this.setState(() => {
            return {PeerID:peer.ID};
        }, () => {
            let parts = peer.ID.split('-');
            let id = parts[0] + "-" + parts[1];
            CaptureStatus.UpdatePeer(id, true);
        });
    }

    /**
     * Triggered when the peer closes their stream
     * @param peer Peer
     */
    onPeerStreamClose(peer:any) {
        if(peer.ID === this.state.PeerID) {
            this.PeerSource = undefined;
            this.setState(() => {
                return {PeerID:''}
            }, () => {
                let parts = peer.ID.split('-');
                let id = parts[0] + "-" + parts[1];
                CaptureStatus.UpdatePeer(id, false);
            });
        }
    }

    /**
     * Triggered when the peer's stream encounters an error
     * @param peer Peer
     * @param err Error
     */
    onPeerStreamError(peer:any, err:any) {
        if(peer.ID === this.state.PeerID) {
            let parts = peer.ID.split('-');
            let id = parts[0] + "-" + parts[1];
            //conditions ???
            //this.PeerSource = undefined;
            //this.setState({PeerID:''});
        }
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = CameraController.Subscribe(this.updateState);
        window.onPeerStream = this.onPeerStream;
        window.onPeerStreamClose = this.onPeerStreamClose;
        window.onPeerStreamError = this.onPeerStreamError;
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        var className = cnames('peer-camera', {
            shown:(this.props.shown && this.PeerSource !== undefined)
        }, this.props.className);
        return (
            <Camera
                className={className} 
                width={1280}
                height={720}
                source={this.PeerSource}
                ref={this.CameraItem}
                />
        )
    }
}