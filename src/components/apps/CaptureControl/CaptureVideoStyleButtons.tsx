import React from 'react';
import CaptureController from 'controllers/CaptureController';
import {
    Icon,
    IconCameraDefault,
    IconCamera2080,
    IconCamera5050,
    IconCameraLeftThird,
    IconCameraRightThird,
    IconMovie,
} from 'components/Elements';

interface SCaptureVideoStyleButtons {
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
class CaptureVideoStyleButtons extends React.PureComponent<any, SCaptureVideoStyleButtons> {

    readonly state:SCaptureVideoStyleButtons = {
        Shown:CaptureController.getState().MainVideo.Shown,
        className:CaptureController.getState().MainVideo.className
    }

    remoteState:Function

    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remoteState = CaptureController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateState() {
        this.setState({
            Shown:CaptureController.getState().MainVideo.Shown,
            className:CaptureController.getState().MainVideo.className
        });
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className="video-icons">
                <Icon 
                    src={IconMovie}
                    onClick={CaptureController.ToggleMainVideo}
                    active={this.state.Shown}
                    />
                <Icon
                    src={IconCameraDefault}
                    active={(this.state.className === 'video-def')}
                    onClick={() => {
                        CaptureController.SetMainVideoClass('video-def');
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
                        CaptureController.SetMainVideoClass('video-8020');
                        CaptureController.SetMainCameraClass('video-2080');
                    }}
                    />
                <Icon
                    src={IconCameraLeftThird}
                    active={(this.state.className === 'video-lt')}
                    onClick={() => {
                        CaptureController.SetMainVideoClass('video-lt');
                        CaptureController.SetMainCameraClass('video-def');
                    }}
                    />
                <Icon
                    src={IconCameraRightThird}
                    active={(this.state.className === 'video-lr')}
                    onClick={() => {
                        CaptureController.SetMainVideoClass('video-lr');
                        CaptureController.SetMainCameraClass('video-def');
                    }}
                    />
            </div>
        );
    }
}

export default CaptureVideoStyleButtons;