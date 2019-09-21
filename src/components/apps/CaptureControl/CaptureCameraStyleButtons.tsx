import React from 'react';
import CaptureController from 'controllers/CaptureController';
import {
    Icon,
    IconStreamOff,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird
} from 'components/Elements';

interface SCaptureCameraStyleButtons {
    /**
     * Determines if the camera is shown or not
     */
    Shown:boolean,
    /**
     * Determines how the camera is displayed
     */
    className:string
}

/**
 * Buttons for setting the style of the main camera
 */
export default class CaptureCameraStyleButtons extends React.PureComponent<any, SCaptureCameraStyleButtons> {

    /**
     * State
     */
    readonly state:SCaptureCameraStyleButtons = {
        Shown:CaptureController.getState().MainCamera.Shown,
        className:CaptureController.getState().MainCamera.className
    }

    /**
     * Listener for controller changes
     */
    protected remoteState:Function

    /**
     * 
     * @param props Constructor
     */
    constructor(props:any) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteState = CaptureController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateState() {
        this.setState({
            Shown:CaptureController.getState().MainCamera.Shown,
            className:CaptureController.getState().MainCamera.className
        });
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
                    onClick={CaptureController.ToggleMainCamera}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        CaptureController.SetMainCameraClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCamera5050}
                    active={(this.state.className === 'video-5050')}
                    onClick={() => {
                        CaptureController.SetMainCameraClass('video-5050');
                        CaptureController.SetMainVideoClass('video-5050');
                    }}
                    />
                <Icon
                    src={IconCamera2080}
                    active={(this.state.className === 'video-2080'  || this.state.className === 'video-8020')}
                    onClick={() => {
                        CaptureController.SetMainCameraClass('video-8020');
                        CaptureController.SetMainVideoClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        CaptureController.SetMainCameraClass('video-lt');
                        CaptureController.SetMainVideoClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        CaptureController.SetMainCameraClass('video-lr');
                        CaptureController.SetMainVideoClass('video-def');
                    }}
                    />
            </div>
        );
    }
}