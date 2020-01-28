import React from 'react';
import {
    Icon,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird,
    IconMovie,
} from 'components/Elements';
import VideoCaptureController from 'controllers/capture/Video';
import CameraCaptureController from 'controllers/capture/Camera';

/**
 * Buttons for setting the style of the main camera
 */
export default class CaptureVideoStyleButtons extends React.PureComponent<any, {
    /**
     * Determines if the camera is shown or not
     */
    Shown:boolean;
    /**
     * Determines how the camera is displayed
     */
    className:string;
}> {

    readonly state = {
        Shown:VideoCaptureController.GetState().Shown,
        className:VideoCaptureController.GetState().className
    }

    /**
     * Capture controller remote
     */
    protected remoteState:Function|null = null;

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateState() {
        this.setState({
            Shown:VideoCaptureController.GetState().Shown,
            className:VideoCaptureController.GetState().className
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = VideoCaptureController.Subscribe(this.updateState);
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
        return (
            <div className="video-icons">
                <Icon 
                    src={IconMovie}
                    onClick={VideoCaptureController.Toggle}
                    active={this.state.Shown}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        VideoCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCamera5050}
                    active={(this.state.className === 'video-5050')}
                    onClick={() => {
                        VideoCaptureController.SetClass('video-5050');
                        CameraCaptureController.SetClass('video-5050');
                    }}
                    />
                <Icon
                    src={IconCamera2080}
                    active={(this.state.className === 'video-2080'  || this.state.className === 'video-8020')}
                    onClick={() => {
                        VideoCaptureController.SetClass('video-8020');
                        CameraCaptureController.SetClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        VideoCaptureController.SetClass('video-lt');
                        CameraCaptureController.SetClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        VideoCaptureController.SetClass('video-lr');
                        CameraCaptureController.SetClass('video-def');
                    }}
                    />
            </div>
        );
    }
}