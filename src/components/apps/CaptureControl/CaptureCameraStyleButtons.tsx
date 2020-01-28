import React from 'react';
import {
    Icon,
    IconStreamOff,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird
} from 'components/Elements';
import CameraCaptureController, { PeerCameraCaptureController } from 'controllers/capture/Camera';
import VideoCaptureController from 'controllers/capture/Video';

/**
 * Buttons for setting the style of the main camera
 */
export default class CaptureCameraStyleButtons extends React.PureComponent<any, {
    /**
     * Determines if the camera is shown or not
     */
    Shown:boolean;
    /**
     * Determines how the camera is displayed
     */
    className:string;
}> {

    /**
     * State
     */
    readonly state = {
        Shown:CameraCaptureController.GetState().Shown,
        className:CameraCaptureController.GetState().className
    }

    /**
     * Listener for controller changes
     */
    protected remoteState:Function|null = null;

    /**
     * Constructor
     * @param props any
     */
    constructor(props:any) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateState() {
        this.setState({
            Shown:CameraCaptureController.GetState().Shown,
            className:CameraCaptureController.GetState().className
        });
    }

    /**
     * Triggered when the component mounts to the DOM
     */
    componentDidMount() {
        this.remoteState = CameraCaptureController.Subscribe(this.updateState);
    }

    /**
     * Triggered when the component will unmount from the DOM
     * - Remove listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className="video-icons">
                <Icon 
                    src={IconStreamOff}
                    active={this.state.Shown}
                    onClick={CameraCaptureController.Toggle}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        CameraCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCamera5050}
                    active={(this.state.className === 'video-5050')}
                    onClick={() => {
                        CameraCaptureController.SetClass('video-5050');
                        VideoCaptureController.SetClass('video-5050');
                        PeerCameraCaptureController.SetClass('video-5050');
                    }}
                    />
                <Icon
                    src={IconCamera2080}
                    active={(this.state.className === 'video-2080'  || this.state.className === 'video-8020')}
                    onClick={() => {
                        CameraCaptureController.SetClass('video-8020');
                        VideoCaptureController.SetClass('video-2080');
                        PeerCameraCaptureController.SetClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        CameraCaptureController.SetClass('video-lt');
                        VideoCaptureController.SetClass('video-def');
                        PeerCameraCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        CameraCaptureController.SetClass('video-lr');
                        VideoCaptureController.SetClass('video-def');
                        PeerCameraCaptureController.SetClass('video-def');
                    }}
                    />
            </div>
        );
    }
}