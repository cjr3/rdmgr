import React from 'react';
import Camera from 'components/tools/Camera';
import CameraController, {CameraControllerState} from 'controllers/CameraController';
import cnames from 'classnames';
import './css/CaptureCamera.scss';

/**
 * Component for displaying the camera on the capture window.
 */
export default class CaptureCamera extends React.PureComponent<{
    /**
     * Determines if the camera is shown or not
     */
    shown:boolean;
    /**
     * Determines how the camera is shown
     */
    className:string;
}, CameraControllerState> {
    readonly state:CameraControllerState = CameraController.getState()

    /**
     * Camera reference
     */
    protected CameraItem:React.RefObject<Camera> = React.createRef();
    /**
     * CameraController remote
     */
    protected remoteState:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.CameraItem = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * 
     */
    updateState() {
        this.setState(CameraController.getState());
    }

    /**
     * Triggered when the camera starts streaming to a peer.
     * @param {MediaStream} stream
     */
    onStream(stream:MediaStream) {
        if(window && window.LocalServer) {
            window.LocalServer.LocalPeer.setStream(stream);
            window.LocalServer.LocalPeer.play();
        }
    }

    /**
     * Start listeners
     */
    componentWillMount() {
        this.remoteState = CameraController.subscribe(this.updateState);
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
        var className = cnames('main-camera', {shown:this.props.shown}, this.props.className);
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