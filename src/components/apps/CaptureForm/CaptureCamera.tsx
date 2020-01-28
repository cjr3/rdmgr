import React from 'react';
import Camera from 'components/tools/Camera';
import CameraController from 'controllers/CameraController';
import cnames from 'classnames';
import './css/CaptureCamera.scss';
import CameraCaptureController from 'controllers/capture/Camera';
import { Unsubscribe } from 'redux';

/**
 * Component for displaying the camera on the capture window.
 */
export default class CaptureCamera extends React.PureComponent<any, {
    Shown:boolean;
    className:string;
    DeviceID:string;
}> {
    readonly state = {
        Shown:CameraCaptureController.GetState().Shown,
        className:CameraCaptureController.GetState().className,
        DeviceID:CameraController.GetState().DeviceID
    }

    /**
     * Camera reference
     */
    protected CameraItem:React.RefObject<Camera> = React.createRef();
    /**
     * CameraController remote
     */
    protected remoteState?:Unsubscribe;
    protected remoteCamera?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.CameraItem = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
    }

    protected updateState() {
        this.setState({
            Shown:CameraCaptureController.GetState().Shown,
            className:CameraCaptureController.GetState().className
        });
    }

    protected updateCamera() {
        this.setState({
            DeviceID:CameraController.GetState().DeviceID
        });
    }

    /**
     * Triggered when the camera starts streaming to a peer.
     * @param {MediaStream} stream
     */
    protected onStream(stream:MediaStream) {
        if(window && window.LocalServer) {
            //window.LocalServer.LocalPeer.setStream(stream);
        }
    }

    /**
     * Start listeners
     */
    componentWillMount() {
        this.remoteCamera = CameraController.Subscribe(this.updateCamera);
        this.remoteState = CameraCaptureController.Subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let className:string = cnames('main-camera', this.state.className, {
            shown:this.state.Shown
        });
        return (
            <Camera
                deviceId={this.state.DeviceID}
                className={className} 
                width={1280}
                height={720}
                onStream={this.onStream}
                ref={this.CameraItem}
                />
        )
    }
}