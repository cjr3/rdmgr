import React from 'react'
import {ToggleButton} from 'components/Elements';
import Panel from 'components/Panel'
import CaptureWatcher from './CaptureWatcher'
//import CaptureDisplayControls from './CaptureDisplayControls';
//import CaptureStreamControls from './CaptureStreamControls';
import CaptureControlMonitor from './CaptureControlMonitor';
import CaptureCameraStyleButtons from './CaptureCameraStyleButtons';
import CaptureVideoStyleButtons from './CaptureVideoStyleButtons';
import './css/CaptureControl.scss'
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';
import StreamPanel, {ToggleIcons} from './Panels/StreamPanel';
import ScoreboardPanel from './Panels/Scoreboard';

/**
 * Component for determining what is displayed on the capture window.
 */
export default class CaptureControl extends React.PureComponent<any, {
    /**
     * Determines if the capture control is displayed or not
     */
    opened:boolean;
}> {

    readonly state = {
        opened:UIController.GetState().CaptureControl.Shown
    }

    protected remoteUI?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({opened:UIController.GetState().CaptureControl.Shown});
    }

    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI)
            this.remoteUI();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel opened={this.state.opened} contentName="CC-app">
                <CaptureControlPreview/>
                <ScoreboardPanel/>
                <StreamPanel/>
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
            <ToggleIcons/>
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