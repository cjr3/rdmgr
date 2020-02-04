import React from 'react';
import CameraController from 'controllers/CameraController';
import {
    Button,
    IconButton,
    IconCheck,
    IconLoop,
    IconHidden,
    IconShown
} from 'components/Elements';
import CameraCaptureController from 'controllers/capture/Camera';
import Panel from 'components/Panel';

/**
 * Component for configuring the main camera.
 */
export default class CameraPanel extends React.PureComponent<{
    opened:boolean;
    onClose:Function;
    onSubmit:Function;
},{
    /**
     * Local device ID of selected camera.
     */
    DeviceID:string;
    /**
     * Collection of cameras attached to the system
     */
    Cameras:Array<MediaDeviceInfo>;
    /**
     * Determines if the camera is visible or not.
     */
    Shown:boolean;
    loading:boolean;
}> {
    readonly state = {
        Cameras:CameraController.GetState().Cameras,
        DeviceID:'',
        Shown:CameraCaptureController.GetState().Shown,
        loading:false
    }

    /**
     * Listener for camera controller
     */
    protected remoteState:Function|null = null;
    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onClickNoCamera = this.onClickNoCamera.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the camera controller.
     */
    protected updateState() {
        this.setState({
            Cameras:CameraController.GetState().Cameras,
            loading:false
        }, () => {
            this.forceUpdate();
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState({Shown:CameraCaptureController.GetState().Shown});
    }

    /**
     * Triggered when the user clicks the submit button.
     */
    protected async onClickSubmit() {
        await CameraController.Set(this.state.DeviceID);
        this.props.onSubmit();
    }

    /**
     * Triggered when the user clicks the no camera button
     */
    protected onClickNoCamera() {
        this.setState({DeviceID:''});
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Load cameras
     * - Start listeners
     */
    componentDidMount() {
        this.remoteState = CameraController.Subscribe(this.updateState);
        this.remoteCapture = CameraCaptureController.Subscribe(this.updateCapture);
        CameraController.Load();
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteCapture !== null)
            this.remoteCapture();
    }

    /**
     * Triggered when the component receives new props/state.
     */
    _componentDidUpdate(prevProps, prevState) {
        var cameras = this.state.Cameras;
        var deviceId = this.state.DeviceID;
        if(prevState.Cameras.length !== cameras.length) {
            if(cameras.length >= 1) {
                if(deviceId === '' && cameras[0].deviceId !== deviceId && this.state.DeviceID !== cameras[0].deviceId) {
                    this.setState((state) => {
                        if(state.Cameras.length)
                            return {DeviceID:state.Cameras[0].deviceId}
                        return null;
                    }, () => {
                        CameraController.Set(this.state.DeviceID);
                    });
                }
            }
        }
    }

    /**
     * Renders the component
     */
    render() {
        let label:string = '(no camera)';
        let iconVisibile:string = IconHidden;
        if(this.state.Shown)
            iconVisibile = IconShown;
        let changed:boolean = (this.state.DeviceID == CameraController.GetState().DeviceID) ? false : true;
        let cameras:Array<React.ReactElement> = [
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

        let buttons:Array<React.ReactElement> = [
            <IconButton
                src={iconVisibile}
                key="btn-toggle"
                active={this.state.Shown}
                onClick={CameraCaptureController.Toggle}
                title="Show/Hide"
                />,
            <IconButton
                src={IconLoop}
                key="btn-load"
                active={this.state.loading}
                title="Load"
                onClick={() => {
                    this.setState({loading:true});
                    CameraController.Load();
                }}/>,
            <IconButton
                key="btn-submit"
                src={IconCheck}
                active={changed}
                title="Submit"
                onClick={this.onClickSubmit}/>
        ];

        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
                popup={true}
                className="camera"
                onClose={this.props.onClose}
                >
                <div className="record-list">
                    {cameras}
                </div>
                <p style={{padding:"4px",margin:"0px"}}>{label}</p>
            </Panel>
        );
    }
}