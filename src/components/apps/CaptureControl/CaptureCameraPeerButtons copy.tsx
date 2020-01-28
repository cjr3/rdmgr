import React from 'react';
import CaptureStatus from 'tools/CaptureStatus';
import {
    Icon,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird,
    IconDisconnected,
    IconConnected
} from 'components/Elements';

import {PeerCameraCaptureController} from 'controllers/capture/Camera';
import CameraCaptureController from 'controllers/capture/Camera';

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
        Shown:PeerCameraCaptureController.GetState().Shown,
        className:PeerCameraCaptureController.GetState().className,
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
    protected updateState() {
        this.setState({
            Shown:PeerCameraCaptureController.GetState().Shown,
            className:PeerCameraCaptureController.GetState().className
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
        this.remoteState = PeerCameraCaptureController.Subscribe(this.updateState);
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
                    onClick={PeerCameraCaptureController.Toggle}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        PeerCameraCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCamera5050}
                    active={(this.state.className === 'video-5050')}
                    onClick={() => {
                        PeerCameraCaptureController.SetClass('video-5050');
                        CameraCaptureController.SetClass('video-5050');
                    }}
                    />
                <Icon
                    src={IconCamera2080}
                    active={(this.state.className === 'video-2080'  || this.state.className === 'video-8020')}
                    onClick={() => {
                        PeerCameraCaptureController.SetClass('video-8020');
                        CameraCaptureController.SetClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        PeerCameraCaptureController.SetClass('video-lt');
                        CameraCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        PeerCameraCaptureController.SetClass('video-lr');
                        CameraCaptureController.SetClass('video-def');
                    }}
                    />
            </div>
        );
    }
}