import React from 'react';
import VideoController from 'controllers/VideoController';
import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import vars from 'tools/vars';

import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

interface SCaptureControlVideo {
    /**
     * Source of the current video
     */
    Source:string,
    /**
     * Determines if the video is displayed or not
     */
    Shown:boolean,
    /**
     * Status of the video
     */
    Status:number
}

/**
 * Component for configuring the main video.
 */
class CaptureControlVideo extends React.PureComponent<PCaptureControlPanel> {

    readonly state:SCaptureControlVideo = {
        Source:VideoController.getState().Source,
        Status:VideoController.getState().Status,
        Shown:CaptureController.getState().MainVideo.Shown,
    }

    remoteState:Function
    remoteCapture:Function

    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);

        this.remoteState = VideoController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Updates the state to match the camera controller.
     */
    updateState() {
        this.setState(() => {
            return {
                Status:VideoController.getState().Status,
                Source:VideoController.getState().Source
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:CaptureController.getState().MainVideo.Shown
            }
        });
    }

    /**
     * Renders the component.
     */
    render() {
        var name = '(no video playing)';
        if(this.state.Source && this.state.Status === vars.Video.Status.Playing) {
            if(DataController.PATH != null)
                name = DataController.PATH.basename(this.state.Source);
        }

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}>
                <div className="text">{name}</div>
            </CaptureControlPanel>
        );
    }
}

export default CaptureControlVideo;