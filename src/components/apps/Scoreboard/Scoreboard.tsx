import React from 'react'
import Panel from 'components/Panel'
import ScoreboardTeam from './Team/Team'
import JamClock from './JamClock'
import GameClock from './GameClock'
import BreakClock from './BreakClock'
import JamCounter from './JamCounter'
import BoardStatus from './BoardStatus'
import {
    Icon, 
    Button, 
    IconPlay,
    IconPause,
    IconCheck,
    IconInjury,
    IconOfficialTimeout,
    ToggleButton
} from 'components/Elements'
import PhaseControl from './PhaseControl'
import PhaseSelection from './PhaseSelection'
import TeamPicker from './TeamPicker'
import JamReset from './JamReset'
import vars from 'tools/vars'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import './css/Scoreboard.scss'
import DataController from 'controllers/DataController'

/**
 * Component for the Scoreboard control
 */
export default class Scoreboard extends React.Component<{
    /**
     * Remote peer's PeerID
     * - If provided, clock values must be set with state updates
     */
    remote?:string;
    /**
     * true if open, false if not
     */
    opened:boolean;
}, {
    /**
     * Status of the scoreboard
     */
    //BoardStatus:number;
    /**
     * State of the jam clock
     */
    //JamState:number;
    /**
     * State of the break clock
     */
    //BreakState:number;
    /**
     * State of the game clock
     */
    //GameState:number;
    /**
     * Status of confirming points to in-field referees
     */
    ConfirmStatus:number;
    /**
     * Name of current phase/quarter
     */
    //PhaseName:string;
    /**
     * Left-side team
     */
    //TeamA:SScoreboardTeam;
    /**
     * Right-side team
     */
    //TeamB:SScoreboardTeam;
    /**
     * Show/Hide phase selection
     */
    PhaseOpened:boolean;
    /**
     * Show/Hide team selection
     */
    TeamOpened:boolean;
    /**
     * Show/hide display buttons
     */
    DisplayOpened:boolean;
    /**
     * Show/Hide Jam Reset
     */
    JamResetOpened:boolean;
    /**
     * Last jam start hour
     */
    //StartGameHour:number;
    /**
     * Last jam start minute
     */
    //StartGameMinute:number;
    /**
     * Last jam start second
     */
    //StartGameSecond:number;
    /**
     * Jam Change Mode
     */
    JamChangeMode:boolean;
}> {
    readonly state = {
        //BoardStatus:ScoreboardController.getState().BoardStatus,
        //JamState:ScoreboardController.getState().JamState,
        //BreakState:ScoreboardController.getState().BreakState,
        //GameState:ScoreboardController.getState().GameState,
        ConfirmStatus:ScoreboardController.getState().ConfirmStatus,
        //PhaseName:ScoreboardController.getState().PhaseName,
        //TeamA:ScoreboardController.getState().TeamA,
        //TeamB:ScoreboardController.getState().TeamB,
        PhaseOpened:false,
        TeamOpened:false,
        DisplayOpened:false,
        JamResetOpened:false,
        //StartGameHour:ScoreboardController.getState().StartGameHour,
        //StartGameMinute:ScoreboardController.getState().StartGameMinute,
        //StartGameSecond:ScoreboardController.getState().StartGameSecond,
        JamChangeMode:ScoreboardController.getState().JamChangeMode
    }

    /**
     * Labels for the jam button
     */
    protected JamLabels:Array<string> = ["JAM", "STOP", "READY"];

    /**
     * Listener for Scoreboard controller
     */
    protected remoteScore:Function|null = null;

    /**
     * Constroctor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onClickDisplay = this.onClickDisplay.bind(this);
        this.onClickPhase = this.onClickPhase.bind(this);
        this.onClickResetJam = this.onClickResetJam.bind(this);
        this.onClickTeams = this.onClickTeams.bind(this);
        this.onClickOverturned = this.onClickOverturned.bind(this);
        this.onClickUpheld = this.onClickUpheld.bind(this);
        this.onClickReview = this.onClickReview.bind(this);
        this.onClickTimeout = this.onClickTimeout.bind(this);
        this.onClickInjury = this.onClickInjury.bind(this);
        this.onClickJamMode = this.onClickJamMode.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        let cstate = ScoreboardController.getState();
        this.setState({
            ConfirmStatus:cstate.ConfirmStatus,
            JamChangeMode:cstate.JamChangeMode
        });
    }

    /**
     * Triggered when the user clicks the Quarter / Phase button
     */
    onClickPhase() {
        this.setState((state) => {
            return {
                PhaseOpened:!state.PhaseOpened,
                TeamOpened:false,
                DisplayOpened:false,
                JamResetOpened:false
            }
        });
    }

    /**
     * Triggered when the user clicks the Teams button
     */
    onClickTeams() {
        this.setState((state) => {
            return {
                PhaseOpened:false,
                TeamOpened:!state.TeamOpened,
                DisplayOpened:false,
                JamResetOpened:false
            }
        });
    }

    /**
     * Triggered when the user clicks the jam reset button
     */
    onClickResetJam() {
        this.setState((state) => {
            return {
                PhaseOpened:false,
                TeamOpened:false,
                DisplayOpened:false,
                JamResetOpened:!state.JamResetOpened
            }
        });
    }

    /**
     * Triggered when the user clicks the display button
     */
    onClickDisplay() {
        this.setState((state) => {
            return {
                PhaseOpened:false,
                TeamOpened:false,
                DisplayOpened:!state.DisplayOpened,
                JamResetOpened:false
            }
        });
    }

    /**
     * Triggered when the user clicks the upheld button
     */
    onClickUpheld() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Upheld);
    }

    /**
     * Triggered when the user clicks the overturned button.
     */
    onClickOverturned() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Overturned);
    }

    /**
     * Triggered when the user clicks the under review button.
     */
    onClickReview() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Review);
    }

    /**
     * Triggered when the user clicks the timeout button.
     */
    onClickTimeout() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Timeout);
    }

    /**
     * Triggered when the user clicks the injury button.
     */
    onClickInjury() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Injury);
    }

    /**
     * Triggered when the user clicks to change the jam control mode
     */
    onClickJamMode() {
        let settings:any = ScoreboardController.getConfig();
        settings.JamChangeMode = !this.state.JamChangeMode;
        ScoreboardController.saveConfig(settings).then(() => {
            ScoreboardController.SetState({
                JamChangeMode:settings.JamChangeMode
            });
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteScore !== null)
            this.remoteScore();
    }

    /**
     * Renders the component
     */
    render() {
        let buttons:Array<React.ReactElement> = [
            <ToggleButton
                key="btn-jammode"
                checked={this.state.JamChangeMode}
                onClick={this.onClickJamMode}
                title={`When checked, jam clock has three steps: Ready, Jam, Stopped`}
            />,
            <Button key="btn-oto" 
                //active={(this.state.BoardStatus === vars.Scoreboard.Status.Timeout)}
                onClick={ScoreboardController.OfficialTimeout}>Timeout</Button>,
            <Button key="btn-injury" 
                //active={(this.state.BoardStatus === vars.Scoreboard.Status.Injury)}
                onClick={ScoreboardController.InjuryTimeout}>Injury</Button>,
            <Button key="btn-review" 
                //active={(this.state.BoardStatus === vars.Scoreboard.Status.Review)}
                onClick={this.onClickReview}>Review</Button>,
            <Button key="btn-upheld" 
                //active={(this.state.BoardStatus === vars.Scoreboard.Status.Upheld)}
                onClick={this.onClickUpheld}>Upheld</Button>,
            <Button key="btn-overturned" 
                //active={(this.state.BoardStatus === vars.Scoreboard.Status.Overturned)}
                onClick={this.onClickOverturned}>Overturned</Button>,
            <Button key="btn-quarter" 
                active={(this.state.PhaseOpened)}
                onClick={this.onClickPhase}>Quarter</Button>,
            <Button key="btn-teams" 
                active={(this.state.TeamOpened)}
                onClick={this.onClickTeams}>Teams</Button>,
            <Button key="btn-reset" onClick={this.onClickResetJam}>Reset Jam</Button>
        ];

        return (
            <Panel 
                contentName="SB-app" 
                buttons={buttons}
                opened={this.props.opened}
                {...this.props}>
                <ScoreboardTeam side='A'/>
                <ScoreboardTeam side='B'/>
                <div className="scoreboard-center">
                    <JamClock/>
                    <div className="jamn-break">
                        <table>
                            <tbody>
                                <JamCounter/>
                                <BreakClock/>
                            </tbody>
                        </table>
                    </div>
                    <ScoreboardPhaseName/>
                    <BoardStatus/>
                    <GameClock/>
                    <PhaseControl/>
                    <ScoreboardJamControls/>
                </div>
                <div className="board-status-controls">
                    <Icon 
                        src={IconOfficialTimeout}
                        //active={this.state.BoardStatus === vars.Scoreboard.Status.Timeout}
                        onClick={ScoreboardController.OfficialTimeout}
                        title="Official Timeout ( CTRL+UP )"
                        />
                    <Icon 
                        src={IconInjury}
                        //active={this.state.BoardStatus === vars.Scoreboard.Status.Injury}
                        onClick={ScoreboardController.InjuryTimeout}
                        title="Injury Timeout ( CTRL+DOWN )"
                        />
                    <Icon 
                        src={IconCheck}
                        active={this.state.ConfirmStatus === 1}
                        onClick={ScoreboardController.ToggleConfirm}
                        title="Confirm Jam Points ( A )"
                        />
                </div>
                <PhaseSelection opened={this.state.PhaseOpened}
                    onClose={this.onClickPhase}
                    onSelect={() => {
                        this.setState(() => {
                            return {PhaseOpened:false};
                        });
                    }}
                    className="phase-selection"
                    />
                <TeamPicker opened={this.state.TeamOpened}
                    onClose={this.onClickTeams}
                    onSubmit={this.onClickTeams}
                    />
                <JamReset
                    opened={this.state.JamResetOpened}
                    onClose={this.onClickResetJam}
                    //hour={this.state.StartGameHour}
                    //minute={this.state.StartGameMinute}
                    //second={this.state.StartGameSecond}
                    />
            </Panel>
        )
    }
}

class ScoreboardJamControls extends React.PureComponent<any, {
    JamState:number;
    GameState:number;
}> {
    readonly state = {
        JamState:ScoreboardController.getState().JamState,
        GameState:ScoreboardController.getState().GameState
    }

    protected remoteScoreboard:Function|null = null;

    protected JamLabels:Array<string> = ["JAM", "STOP", "READY"];

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    updateScoreboard() {
        this.setState({
            JamState:ScoreboardController.getState().JamState,
            GameState:ScoreboardController.getState().GameState
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        const jamLabel:string = this.JamLabels[this.state.JamState];
        let clockIcon:string = IconPlay;
        if(this.state.GameState === vars.Clock.Status.Running)
            clockIcon = IconPause;
        return (
            <div className="jam-controls">
                <Button 
                    onClick={ScoreboardController.ToggleJamClock} 
                    className="jam-button"
                    title="Toggle Jam Clock ( SPACEBAR, ENTER )"
                    >{jamLabel}</Button>
                <Icon 
                    src={clockIcon}
                    onClick={ScoreboardController.ToggleGameClock}
                    className="clock-button"
                    title="Toggle Game Clock ( UP )"
                />
            </div>
        );
    }
}

class ScoreboardPhaseName extends React.PureComponent<any, {
    name:string;
}> {
    readonly state = {
        name:ScoreboardController.getState().PhaseName
    }

    protected remoteScoreboard:Function|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    updateScoreboard() {
        this.setState({
            name:ScoreboardController.getState().PhaseName
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }

    render() {
        return (
            <div className="phase">{this.state.name}</div>
        );
    }
}