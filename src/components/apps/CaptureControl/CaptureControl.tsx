import React from 'react'
import {Button} from 'components/Elements';
import Panel from 'components/Panel'
import CaptureControlMonitor from './CaptureControlMonitor';
import './css/CaptureControl.scss'
import UIController from 'controllers/UIController';
import { Unsubscribe } from 'redux';
import {ToggleIcons} from './Panels/StreamPanel';
import ScoreboardPanel from './Panels/Scoreboard';
import PostScoresPanel from './Panels/PostScores';
import TeamPicker from '../Scoreboard/TeamPicker';
import PhaseSelection from '../Scoreboard/PhaseSelection';
import CameraPanel from './Panels/Camera';
import RosterPanel from './Panels/Roster';
import AnnouncerPanel from './Panels/Announcer';
import AnthemPanel from './Panels/Anthem';
import JammersPanel from './Panels/Jammers';
import SchedulePanel from './Panels/Schedule';
import ScoresPanel from './Panels/Scores';

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
                <AnthemPanel opened={true}/>
                <AnnouncerPanel opened={true}/>
                <SchedulePanel opened={true}/>
                <ScoresPanel opened={true}/>
                <JammersPanel/>
                <PostScoresPanel
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

class Buttons extends React.PureComponent<{
    panel:string;
    onClick:Function;
}> {

    render() {
        return (
            <React.Fragment>
                <ToggleIcons/>
                <Button onClick={() => {this.props.onClick('scores')}} active={(this.props.panel === 'scores')}>Post Scores</Button>
                <Button onClick={() => {this.props.onClick('phase')}} active={(this.props.panel === 'phase')}>Quarter</Button>
                <Button onClick={() => {this.props.onClick('teams')}} active={(this.props.panel === 'teams')}>Teams</Button>
                <Button onClick={() => {this.props.onClick('roster')}} active={(this.props.panel === 'roster')}>Intros</Button>
                <Button onClick={() => {this.props.onClick('monitor')}} active={(this.props.panel === 'monitor')}>Monitor</Button>
            </React.Fragment>
        )
    }
}