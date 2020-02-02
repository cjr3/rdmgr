import React from 'react';
import { Unsubscribe } from 'redux';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import Counter from 'components/tools/Counter';
import GameClock from 'components/apps/Scoreboard/GameClock';
import JamClock from 'components/apps/Scoreboard/JamClock';
import PhaseControl from 'components/apps/Scoreboard/PhaseControl';
import {ScoreboardJamControls, ScoreboardPhaseName} from 'components/apps/Scoreboard/Scoreboard';
import Panel from 'components/Panel';
import Score from 'components/apps/Scoreboard/Team/Score';
import TeamIcons from 'components/apps/Scoreboard/Team/Icons';
import Logo from 'components/apps/Scoreboard/Team/Logo';
import {ScoreboardStatusControls} from 'components/apps/Scoreboard/Scoreboard';
import { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';

/**
 * Component for configuring the score banner.
 */
export default class ScoreboardPanel extends React.PureComponent<any, {
    /**
     * Left side socreboard team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right side scoreboard team
     */
    TeamB:SScoreboardTeam;
    /**
     * Determines if the scorebanner is shown or note
     */
    Shown:boolean;
    /**
     * Currently opened panel
     */
    panel:string;
}> {

    readonly state = {
        TeamA:ScoreboardController.GetState().TeamA,
        TeamB:ScoreboardController.GetState().TeamB,
        Shown:ScorebannerCaptureController.GetState().Shown,
        panel:''
    }

    /**
     * Reference to jam Counter element
     */
    protected JamCounterItem:React.RefObject<Counter> = React.createRef();

    /**
     * Listener for scoreboard controller
     */
    protected remoteState:Function|null = null;

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    /**
     * Listener for data controller
     */
    protected remoteData:Function|null = null;

    protected StartDate:string|undefined;
    protected EndDate:string|undefined;

    /**
     * 
     * @param props PCaptureControlPanel
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.onClickIncreaseTeamAScore = this.onClickIncreaseTeamAScore.bind(this);
        this.onClickDecreaseTeamAScore = this.onClickDecreaseTeamAScore.bind(this);
        this.onClickIncreaseTeamBScore = this.onClickIncreaseTeamBScore.bind(this);
        this.onClickDecreaseTeamBScore = this.onClickDecreaseTeamBScore.bind(this);

        let edate:Date = new Date();
        let sdate:Date = new Date();
        sdate.setDate(sdate.getDate() - 30);
        this.StartDate = sdate.toLocaleDateString("en", {
            year:"numeric",
            month:"2-digit",
            day:"numeric"
        });

        this.EndDate = edate.toLocaleDateString("en", {
            year:"numeric",
            month:"2-digit",
            day:"numeric"
        });
    }

    /**
     * Updates the state to match the scoreboard controller.
     */
    protected updateState() {
        this.setState(() => {
            return {
                TeamA:ScoreboardController.GetState().TeamA,
                TeamB:ScoreboardController.GetState().TeamB
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState({
            Shown:ScorebannerCaptureController.GetState().Shown
        });
    }

    /**
     * Triggered when the user clicks on the right side team's score
     */
    protected onClickIncreaseTeamAScore() {
        ScoreboardController.IncreaseTeamScore('A', 1);
    }

    /**
     * Triggered when the user context-clicks on the left-side team's score
     */
    protected onClickDecreaseTeamAScore() {
        ScoreboardController.DecreaseTeamScore('A', 1);
    }

    /**
     * Triggered when the user clicks on the left side team's score
     */
    protected onClickIncreaseTeamBScore() {
        ScoreboardController.IncreaseTeamScore('B', 1);
    }

    /**
     * Triggered when the user context-clicks on the right-side team's score
     */
    protected onClickDecreaseTeamBScore() {
        ScoreboardController.DecreaseTeamScore('B', 1);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScoreboardController.Subscribe(this.updateState);
        this.remoteCapture = ScorebannerCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteCapture !== null)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel
                opened={true}
                className="scoreboard"
                contentName="scorebanner"
                >
                    <div className="stack-panel s2">
                        <div className="team team-a"><Team side='A'/></div>
                        <div className="team team-b"><Team side='B'/></div>
                    </div>
                    <div className="stack-panel s2" style={{textAlign:"center",padding:"3px"}}>
                        <div>Jam Clock</div>
                        <div>Game Clock</div>
                        <div><JamClock onClick={ScoreboardController.ToggleJamClock}/></div>
                        <div><GameClock/></div>
                        <div>Jam #</div>
                        <div>&nbsp;</div>
                        <div><JamCounter/></div>
                        <div><ScoreboardStatusControls/></div>
                    </div>

                    <ScoreboardPhaseName/>
                    <PhaseControl/>
                    <ScoreboardJamControls/>
                </Panel>
        )
    }
}

class JamCounter extends React.PureComponent<any, {
    JamCounter:number;
}> {

    readonly state = {
        JamCounter:ScoreboardController.GetState().JamCounter
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    protected updateScoreboard() {
        this.setState({JamCounter:ScoreboardController.GetState().JamCounter});
    }

    protected onClick() {
        ScoreboardController.IncreaseJamCounter(1);
    }

    protected onContextMenu() {
        ScoreboardController.DecreaseJamCounter(1);
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        return (
            <div 
                className="counter jam-counter"
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
                >{this.state.JamCounter}</div>
        );
    }
}

const Team = function(props:{side:'A'|'B'}) {
    return (
        <React.Fragment>
            <Logo side={props.side}/>
            <Score side={props.side}/>
            <TeamIcons side={props.side}/>
        </React.Fragment>
    );
}