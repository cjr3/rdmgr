import React from 'react';
import CameraController from 'controllers/CameraController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import {
    Button,
    IconButton,
    IconCheck,
    IconLoop
} from 'components/Elements';

interface ICaptureControlCameraState {
    /**
     * Local device ID of selected camera.
     */
    DeviceID:string,
    /**
     * Collection of cameras attached to the system
     */
    Cameras:Array<MediaDeviceInfo>,
    /**
     * Determines if the camera is visible or not.
     */
    Shown:boolean
}

/**
 * Component for configuring the main camera.
 */
class CaptureControlCamera extends React.PureComponent<PCaptureControlPanel,ICaptureControlCameraState> {

    readonly state:ICaptureControlCameraState = {
        Cameras:CameraController.getState().Cameras,
        DeviceID:CameraController.getState().DeviceID,
        Shown:CaptureController.getState().MainCamera.Shown
    }

    /**
     * Listener for camera controller
     */
    remoteState:Function
    /**
     * Listener for capture controller
     */
    remoteCapture:Function

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickNoCamera = this.onClickNoCamera.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);

        this.remoteState = CameraController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                Cameras:CameraController.getState().Cameras,
                DeviceID:CameraController.getState().DeviceID
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {Shown:CaptureController.getState().MainCamera.Shown};
        })
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    onClickSubmit() {
        CameraController.SetDeviceID(this.state.DeviceID);
    }

    /**
     * Triggered when the user clicks the no camera button
     */
    onClickNoCamera() {
        this.setState({DeviceID:''});
    }

    /**
     * Triggered when the component mounts to the DOM.
     */
    componentDidMount() {
        CameraController.LoadCameras();
    }

    /**
     * Triggered when the component receives new props/state.
     */
    componentDidUpdate(prevProps, prevState) {
        var cameras = this.state.Cameras;
        var deviceId = this.state.DeviceID;
        if(prevState.Cameras.length !== cameras.length) {
            if(cameras.length >= 1) {
                if(deviceId === '' && cameras[0].deviceId !== deviceId && this.state.DeviceID !== cameras[0].deviceId) {
                    this.setState((state:ICaptureControlCameraState) => {
                        if(state.Cameras.length)
                            return {DeviceID:state.Cameras[0].deviceId}
                        return null;
                    }, () => {
                        CameraController.SetDeviceID(this.state.DeviceID);
                    });
                }
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        var label = '(no camera)';
        var cameras = [
            <Button
                key="btn-no-camera"
                active={(this.state.DeviceID === '')}
                onClick={this.onClickNoCamera}>{label}</Button>
        ];
        
        //add each camera
        this.state.Cameras.forEach((camera:MediaDeviceInfo, index:number) => {
            cameras.push(
                <Button
                    key={`camera-${index}`}
                    active={(this.state.DeviceID === camera.deviceId)}
                    onClick={() => {
                        this.setState({DeviceID:camera.deviceId})
                    }}
                >{`Camera #${index+1}`}</Button>
            );
            if(camera.deviceId === this.state.DeviceID)
                label = camera.label;
        });

        var buttons = [
            <IconButton
                src={IconLoop}
                key="btn-load"
                onClick={CameraController.LoadCameras}>Load</IconButton>,
            <IconButton
                key="btn-submit"
                src={IconCheck}
                onClick={this.onClickSubmit}>Submit</IconButton>
        ];

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                buttons={buttons}
                onClickControl={this.props.onClickControl}
                controlled={this.props.controlled}
                onClick={this.props.onClick}>
                    <div className="record-list">
                        {cameras}
                    </div>
                    <p style={{padding:"4px",margin:"0px"}}>{label}</p>
            </CaptureControlPanel>
        );
    }
}

export default CaptureControlCamera;