import React from 'react'
import {ToggleButton} from 'components/Elements';
import Panel from 'components/Panel'
import CaptureWatcher from './CaptureWatcher'
import CaptureDisplayControls from './CaptureDisplayControls';
import CaptureStreamControls from './CaptureStreamControls';
import CaptureControlMonitor from './CaptureControlMonitor';
import CaptureCameraStyleButtons from './CaptureCameraStyleButtons';
import CaptureVideoStyleButtons from './CaptureVideoStyleButtons';
import './css/CaptureControl.scss'
import CaptureCameraPeerButtons from './CaptureCameraPeerButtons copy';

/**
 * Component for determining what is displayed on the capture window.
 */
export default class CaptureControl extends React.PureComponent<{
    /**
     * Determines if the capture control is displayed or not
     */
    opened:boolean;
}> {
    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel opened={this.props.opened} contentName="CC-app">
                <CaptureControlPreview/>
                <CaptureDisplayControls/>
                <CaptureStreamControls/>
            </Panel>
        );
    }
}

/**
 * Component for displaying a preview of the capture window.
 */
function CaptureControlPreview() {
    return (
        <div className="capture-preview">
            <CaptureControlMonitor/>
            <CaptureControlWatcher/>
            <p>Watching the capture window may degrade performance when streaming.</p>
            <p><b>Please do not record while streaming.</b></p>
            <div className="camera-styles">
                <CaptureCameraStyleButtons/>
                <CaptureVideoStyleButtons/>
            </div>
        </div>
    );
}

class CaptureControlWatcher extends React.PureComponent<any, {
    /**
     * Determines if the preview of the capture window is displayed or not
     */
    CapturePreviewShown:boolean;
}> {
    readonly state = {
        CapturePreviewShown:false
    };

    render() {
        return (
            <React.Fragment>
                <CaptureWatcher shown={this.state.CapturePreviewShown}/>
                <div className="watcher-control">
                    <ToggleButton
                        checked={this.state.CapturePreviewShown}
                        onClick={() => {
                            this.setState({CapturePreviewShown:!this.state.CapturePreviewShown});
                        }}
                        label="Watch"
                    />
                </div>
            </React.Fragment>
        );
    }
}