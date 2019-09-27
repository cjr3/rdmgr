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

interface SCaptureControl {
    /**
     * Determines if the preview of the capture window is displayed or not
     */
    CapturePreviewShown:boolean
};

export interface PCaptureControl {
    /**
     * Determines if the capture control is displayed or not
     */
    opened:boolean
};

/**
 * Main class for determining what is displayed on the capture window.
 * - Scoreboard
 * - Scoreboard Banner (visibility, position, elements)
 * - Jammers (visibility, position)
 * - Penalties (visibility, position)
 * - Announcer Names (visibility, position)
 * - Slideshows (visibility)
 * - Videos (visibility)
 */
export default class CaptureControl extends React.PureComponent<PCaptureControl, SCaptureControl> {
    readonly state:SCaptureControl = {
        CapturePreviewShown:false
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel opened={this.props.opened} contentName="CC-app" >
                <div className="capture-preview">
                    <CaptureControlMonitor/>
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
                    <p>Watching the capture window may degrade performance when streaming.</p>
                    <p><b>Please do not record while streaming.</b></p>
                    <div className="camera-styles">
                        <CaptureCameraStyleButtons/>
                        <CaptureVideoStyleButtons/>
                    </div>
                </div>
                <CaptureDisplayControls/>
                <CaptureStreamControls/>
            </Panel>
        )
    }
}