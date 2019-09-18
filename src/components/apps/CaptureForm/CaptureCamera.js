import React from 'react'
import Camera from 'components/tools/Camera'
import CameraController from 'controllers/CameraController'
import cnames from 'classnames'
import './css/CaptureCamera.scss'

class CaptureCamera extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, CameraController.getState());
        this.Camera = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = CameraController.subscribe(this.updateState);
    }

    /**
     * 
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, CameraController.getState());
        });
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
                ref={this.Camera}
                />
        )
    }
}

class CapturePeerCamera extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, CameraController.getState());
        this.Camera = React.createRef();
        this.onStream = this.onStream.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateServer = this.updateServer.bind(this);
        this.remote = CameraController.subscribe(this.updateState);
    }

    /**
     * 
     */
    updateState() {
        console.log("Camera...")
        this.setState(() => {
            return Object.assign({}, CameraController.getState());
        });
    }

    updateServer() {

    }

    onStream(canvas, video) {
        if(window && window.IPC) {
            window.IPC.send({
                type:'peer-media-status',
                connected:(video.srcObejct === null) ? true : false
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var className = cnames('peer-camera', {shown:this.props.shown}, this.props.className);
        return (
            <Camera
                className={className} 
                width={1280}
                height={720}
                ref={this.Camera}
                onStream={this.onStream}
                />
        );
    }
}

export default CaptureCamera;
export {CapturePeerCamera};