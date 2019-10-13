import React from 'react';
import CaptureController from 'controllers/CaptureController';
import CaptureStatus from 'tools/CaptureStatus';
import {
    Icon,
    IconStreamOff,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird,
    IconDisconnected,
    IconConnected
} from 'components/Elements';

/**
 * Buttons for setting the style of the main camera
 */
export default class CaptureCameraPeerButtons extends React.PureComponent<any, {
    /**
     * Determines if the camera is shown or not
     */
    Shown:boolean;
    /**
     * Determines how the camera is displayed
     */
    className:string;

    /**
     * Peer to stream from
     */
    PeerID:string;
    /**
     * Determines if the peer is streaming or not
     */
    Connected:boolean;
}> {

    /**
     * State
     */
    readonly state = {
        Shown:CaptureController.getState().PeerCamera.Shown,
        className:CaptureController.getState().PeerCamera.className,
        PeerID:'',
        Connected:false
    }

    /**
     * Listener for controller changes
     */
    protected remoteState:Function|null = null;

    /**
     * CaptureStatus listener
     */
    protected remoteStatus:Function|null = null;

    /**
     * Constructor
     * @param props any
     */
    constructor(props:any) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateState() {
        this.setState({
            Shown:CaptureController.getState().PeerCamera.Shown,
            className:CaptureController.getState().PeerCamera.className
        });
    }

    updateStatus() {
        this.setState({
            PeerID:CaptureStatus.getState().PeerCamera.PeerID,
            Connected:CaptureStatus.getState().PeerCamera.Connected
        });
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.remoteState = CaptureController.subscribe(this.updateState);
        this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
    }

    /**
     * Triggered when the component will unmount from the DOM
     * - Remove listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
        if(this.remoteStatus)
            this.remoteStatus();
    }

    /**
     * Renders the component.
     */
    render() {
        let icon = IconDisconnected;
        if(this.state.PeerID && this.state.Connected)
            icon = IconConnected;
        return (
            <div className="video-icons">
                <Icon 
                    src={icon}
                    active={this.state.Shown}
                    onClick={CaptureController.TogglePeerCamera}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        CaptureController.SetPeerCameraClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCamera5050}
                    active={(this.state.className === 'video-5050')}
                    onClick={() => {
                        CaptureController.SetPeerCameraClass('video-5050');
                        CaptureController.SetMainCameraClass('video-5050');
                    }}
                    />
                <Icon
                    src={IconCamera2080}
                    active={(this.state.className === 'video-2080'  || this.state.className === 'video-8020')}
                    onClick={() => {
                        CaptureController.SetPeerCameraClass('video-8020');
                        CaptureController.SetMainCameraClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        CaptureController.SetPeerCameraClass('video-lt');
                        CaptureController.SetMainCameraClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        CaptureController.SetPeerCameraClass('video-lr');
                        CaptureController.SetMainCameraClass('video-def');
                    }}
                    />
            </div>
        );
    }
}