import React from 'react';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import AnthemCaptureController from 'controllers/capture/Anthem';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import ScoresCaptureController from 'controllers/capture/Scores';
import ScheduleCaptureController from 'controllers/capture/Schedule';
import StandingsCaptureController from 'controllers/capture/Standings';
import { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';
import { Icon, IconMic, IconFlag, IconWhistle, IconClipboard } from 'components/Elements';
import PenaltyTrackerPanel from './PenaltyTracker';
import CameraCaptureController from 'controllers/capture/Camera';
import Positions from 'components/apps/Scorekeeper/Positions';

export default class StreamPanel extends React.PureComponent<any, {
    CurrentPanel:string;
}> {
    render() {
        return (
            <div className="stream-panel">
                <div className="panels">
                    <div className="scorekeeper">
                        <Positions/>
                    </div>
                    <div className="penalty-tracker">
                        <PenaltyTrackerPanel/>
                    </div>
                </div>
            </div>
        );
    }
}

export class ToggleIcons extends React.PureComponent<any, {
    AnnouncerShown:boolean;
    AnthemShown:boolean;
    //RosterShown:boolean;
    PenaltyTrackerShown:boolean;
    ScorekeeperShown:boolean;
    ScoresShown:boolean;
    ScheduleShown:boolean;
    StandingsShown:boolean;
    ScorebannerShown:boolean;
    CameraShown:boolean;
}> {
    readonly state = {
        AnnouncerShown:AnnouncerCaptureController.GetState().Shown,
        AnthemShown:AnthemCaptureController.GetState().Shown,
        //RosterShown:RosterCaptureController.GetState().Shown,
        PenaltyTrackerShown:PenaltyCaptureController.GetState().Shown,
        ScorekeeperShown:ScorekeeperCaptureController.GetState().Shown,
        ScoresShown:ScoresCaptureController.GetState().Shown,
        ScheduleShown:ScheduleCaptureController.GetState().Shown,
        StandingsShown:StandingsCaptureController.GetState().Shown,
        ScorebannerShown:ScorebannerCaptureController.GetState().Shown,
        CameraShown:CameraCaptureController.GetState().Shown
    }

    protected remoteAnnouncer?:Unsubscribe;
    protected remoteAnthem?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;
    protected remotePenalty?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;
    protected remoteScores?:Unsubscribe;
    protected remoteSchedule?:Unsubscribe;
    protected remoteStandings?:Unsubscribe;
    protected remoteScorebanner?:Unsubscribe;
    protected remoteCamera?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateAnnouncer = this.updateAnnouncer.bind(this);
        this.updateAnthem = this.updateAnthem.bind(this);
        this.updateRoster = this.updateRoster.bind(this);
        this.updatePenalty = this.updatePenalty.bind(this);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updateScores = this.updateScores.bind(this);
        this.updateSchedule = this.updateSchedule.bind(this);
        this.updateStandings = this.updateStandings.bind(this);
        this.updateScorebanner = this.updateScorebanner.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
    }

    protected updateAnnouncer() {
        this.setState({AnnouncerShown:AnnouncerCaptureController.GetState().Shown});
    }

    protected updateAnthem() {
        this.setState({AnthemShown:AnthemCaptureController.GetState().Shown});
    }

    protected updateRoster(){
        //this.setState({RosterShown:RosterCaptureController.GetState().Shown});
    }

    protected updatePenalty(){
        this.setState({PenaltyTrackerShown:PenaltyCaptureController.GetState().Shown});
    }

    protected updateScorekeeper(){
        this.setState({ScorekeeperShown:ScorekeeperCaptureController.GetState().Shown});
    }

    protected updateScores(){
        this.setState({ScoresShown:ScoresCaptureController.GetState().Shown});
    }

    protected updateSchedule(){
        this.setState({ScheduleShown:ScheduleCaptureController.GetState().Shown});
    }

    protected updateStandings(){
        this.setState({StandingsShown:StandingsCaptureController.GetState().Shown});
    }

    protected updateScorebanner(){
        this.setState({ScorebannerShown:ScorebannerCaptureController.GetState().Shown});
    }

    protected updateCamera(){
        this.setState({CameraShown:CameraCaptureController.GetState().Shown});
    }

    componentDidMount() {
        this.remoteAnnouncer = AnnouncerCaptureController.Subscribe(this.updateAnnouncer);
        this.remoteAnthem = AnthemCaptureController.Subscribe(this.updateAnthem);
        this.remotePenalty = PenaltyCaptureController.Subscribe(this.updatePenalty);
        //this.remoteRoster = RosterCaptureController.Subscribe(this.updateRoster);
        this.remoteSchedule = ScheduleCaptureController.Subscribe(this.updateSchedule);
        this.remoteScorebanner = ScorebannerCaptureController.Subscribe(this.updateScorebanner);
        this.remoteScorekeeper = ScorekeeperCaptureController.Subscribe(this.updateScorekeeper);
        this.remoteScores = ScoresCaptureController.Subscribe(this.updateScores);
        this.remoteStandings = StandingsCaptureController.Subscribe(this.updateStandings);
        this.remoteCamera = CameraCaptureController.Subscribe(this.updateCamera);
    }

    componentWillUnmount() {
        if(this.remoteAnnouncer)
            this.remoteAnnouncer();
        if(this.remoteAnthem)
            this.remoteAnthem();
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteSchedule)
            this.remoteSchedule();
        if(this.remoteScorebanner)
            this.remoteScorebanner();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
        if(this.remoteScores)
            this.remoteScores();
        if(this.remoteStandings)
            this.remoteStandings();
        if(this.remoteCamera)
            this.remoteCamera();
    }

    render() {
        return (
            <div className="toggle-icons">
                <Icon src={IconMic} title="Announcers" onClick={() => {
                    AnnouncerCaptureController.SetClass('banner');
                    AnnouncerCaptureController.Toggle();
                }} active={this.state.AnnouncerShown}/>

                <Icon src={IconFlag} title="Anthem" onClick={() => {
                    AnthemCaptureController.SetClass('banner');
                    AnthemCaptureController.Toggle();
                }} active={this.state.AnthemShown}/>

                <Icon src={IconWhistle} title="Penalties" onClick={() => {
                    PenaltyCaptureController.SetClass('stream');
                    PenaltyCaptureController.Toggle();
                }} active={this.state.PenaltyTrackerShown}/>

                <Icon src={IconClipboard} title="Jammers" onClick={() => {
                    ScorekeeperCaptureController.SetClass('stream');
                    ScorekeeperCaptureController.Toggle();
                }} active={this.state.ScorekeeperShown}/>
            </div>
        )
    }
}