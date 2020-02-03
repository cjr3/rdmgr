import React from 'react'
import {ToggleButton, Button} from 'components/Elements';
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
import ScoresPanel from './Panels/Scores';
import TeamPicker from '../Scoreboard/TeamPicker';
import PhaseSelection from '../Scoreboard/PhaseSelection';
import CameraPanel from './Panels/Camera';
import RosterPanel from './Panels/Roster';
import PreviewPanel from './Panels/Preview';

/**
 * Component for determining what is displayed on the capture window.
 */
export default class CaptureControl extends React.PureComponent<any, {
    opened:boolean;
    CurrentPanel:string;
}> {

    readonly state = {
        opened:UIController.GetState().CaptureControl.Shown,
        CurrentPanel:''
    }

    protected remoteUI?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
        this.setPanel = this.setPanel.bind(this);
        this.onClosePanel = this.onClosePanel.bind(this);
    }

    protected async updateUI() {
        this.setState({opened:UIController.GetState().CaptureControl.Shown});
    }

    protected setPanel(value:string) {
        if(!value || this.state.CurrentPanel == value)
            this.setState({CurrentPanel:''});
        else
            this.setState({CurrentPanel:value});
    }

    protected onClosePanel() {
        this.setState({CurrentPanel:''});
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
            <Panel 
                opened={this.state.opened} 
                contentName="CC-app"
                className="CC-app-panel"
                buttons={[<Buttons key='buttons' onClick={this.setPanel} panel={this.state.CurrentPanel}/>]}
                >
                <ScoreboardPanel/>
                <StreamPanel/>
                <ScoresPanel
                    opened={(this.state.CurrentPanel === 'scores')}
                    onClose={this.onClosePanel}
                />
                <TeamPicker
                    opened={(this.state.CurrentPanel === 'teams')}
                    onClose={this.onClosePanel}
                    onSubmit={this.onClosePanel}
                    />
                <PhaseSelection
                    opened={(this.state.CurrentPanel === 'phase')}
                    onClose={this.onClosePanel}
                    onSelect={this.onClosePanel}
                    />
                <CameraPanel
                    opened={(this.state.CurrentPanel === 'camera')}
                    onClose={this.onClosePanel}
                    onSubmit={this.onClosePanel}
                    />
                <CaptureControlMonitor
                    opened={(this.state.CurrentPanel == 'monitor')}
                    onClose={this.onClosePanel}
                    onSubmit={this.onClosePanel}
                    />
                <RosterPanel
                    opened={(this.state.CurrentPanel == 'roster')}
                    onClose={this.onClosePanel}
                    />
            </Panel>
        );
    }
}

/**
 * Component for displaying a preview of the capture window.
 */
function CaptureControlPreview() {
    //<CaptureControlWatcher/>
    return (
        <div className="capture-preview">
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

class Buttons extends React.PureComponent<{
    panel:string;
    onClick:Function;
}> {

    render() {
        return (
            <React.Fragment>
                <ToggleIcons/>
                <Button onClick={() => {this.props.onClick('scores')}} active={(this.props.panel === 'scores')}>Scores</Button>
                <Button onClick={() => {this.props.onClick('phase')}} active={(this.props.panel === 'phase')}>Quarter</Button>
                <Button onClick={() => {this.props.onClick('teams')}} active={(this.props.panel === 'teams')}>Teams</Button>
                <Button onClick={() => {this.props.onClick('roster')}} active={(this.props.panel === 'roster')}>Intros</Button>
                <Button onClick={() => {this.props.onClick('monitor')}} active={(this.props.panel === 'monitor')}>Monitor</Button>
                <Button onClick={() => {this.props.onClick('camera')}} active={(this.props.panel === 'camera')}>Camera</Button>
            </React.Fragment>
        )
    }
}