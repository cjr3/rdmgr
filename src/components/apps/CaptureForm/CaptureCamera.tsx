import React from 'react'
import Camera from 'components/tools/Camera'
import CameraController, {CameraControllerState} from 'controllers/CameraController'
import cnames from 'classnames'
import './css/CaptureCamera.scss'

export interface PCaptureCamera {
    /**
     * Determines if the camera is shown or not
     */
    shown:boolean,
    /**
     * Determines how the camera is shown
     */
    className:string
}

/**
 * Component for displaying the camera on the capture window.
 */
class CaptureCamera extends React.PureComponent<PCaptureCamera, CameraControllerState> {

    readonly state:CameraControllerState = CameraController.getState()

    CameraItem:React.RefObject<Camera>
    remoteState:Function

    constructor(props) {
        super(props);
        this.CameraItem = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteState = CameraController.subscribe(this.updateState);
    }

    /**
     * 
     */
    updateState() {
        this.setState(CameraController.getState());
    }

    /**
     * Triggered when the camera starts streaming to a peer.
     * @param {HTML5CanvasElement} canvas 
     */
    onStream(canvas) {
        if(window && window.LocalServer) {
            window.LocalServer.LocalPeer.setStreamCanvas(canvas);
            window.LocalServer.LocalPeer.play();
        }
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

export default CaptureCamera;