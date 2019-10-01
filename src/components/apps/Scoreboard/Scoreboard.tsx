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
    IconOfficialTimeout
} from 'components/Elements'
import PhaseControl from './PhaseControl'
import PhaseSelection from './PhaseSelection'
import TeamPicker from './TeamPicker'
import JamReset from './JamReset'
import vars from 'tools/vars'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import './css/Scoreboard.scss'

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
    opened:boolean
}, {
    /**
     * Status of the scoreboard
     */
    BoardStatus:number;
    /**
     * State of the jam clock
     */
    JamState:number;
    /**
     * State of the break clock
     */
    BreakState:number;
    /**
     * State of the game clock
     */
    GameState:number;
    /**
     * Status of confirming points to in-field referees
     */
    ConfirmStatus:number;
    /**
     * Name of current phase/quarter
     */
    PhaseName:string;
    /**
     * Left-side team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right-side team
     */
    TeamB:SScoreboardTeam;
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
    StartGameHour:number;
    /**
     * Last jam start minute
     */
    StartGameMinute:number;
    /**
     * Last jam start second
     */
    StartGameSecond:number;
}> {
    readonly state = {
        BoardStatus:ScoreboardController.getState().BoardStatus,
        JamState:ScoreboardController.getState().JamState,
        BreakState:ScoreboardController.getState().BreakState,
        GameState:ScoreboardController.getState().GameState,
        ConfirmStatus:ScoreboardController.getState().ConfirmStatus,
        PhaseName:ScoreboardController.getState().PhaseName,
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        PhaseOpened:false,
        TeamOpened:false,
        DisplayOpened:false,
        JamResetOpened:false,
        StartGameHour:ScoreboardController.getState().StartGameHour,
        StartGameMinute:ScoreboardController.getState().StartGameMinute,
        StartGameSecond:ScoreboardController.getState().StartGameSecond
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
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        let cstate = ScoreboardController.getState();
        this.setState({
            BoardStatus:cstate.BoardStatus,
            JamState:cstate.JamState,
            GameState:cstate.GameState,
            BreakState:cstate.BreakState,
            ConfirmStatus:cstate.ConfirmStatus,
            PhaseName:cstate.PhaseName,
            TeamA:cstate.TeamA,
            TeamB:cstate.TeamB,
            StartGameHour:cstate.StartGameHour,
            StartGameMinute:cstate.StartGameMinute,
            StartGameSecond:cstate.StartGameSecond
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
        const jamLabel:string = this.JamLabels[this.state.JamState];
        let clockIcon:string = IconPlay
            
        if(ScoreboardController.getState().GameState === vars.Clock.Status.Running) {
            clockIcon = IconPause
        }
        
        let buttons:Array<React.ReactElement> = [
            <Button key="btn-oto" 
                active={(this.state.BoardStatus === vars.Scoreboard.Status.Timeout)}
                onClick={this.onClickTimeout}>Timeout</Button>,
            <Button key="btn-injury" 
                active={(this.state.BoardStatus === vars.Scoreboard.Status.Injury)}
                onClick={this.onClickInjury}>Injury</Button>,
            <Button key="btn-review" 
                active={(this.state.BoardStatus === vars.Scoreboard.Status.Review)}
                onClick={this.onClickReview}>Review</Button>,
            <Button key="btn-upheld" 
                active={(this.state.BoardStatus === vars.Scoreboard.Status.Upheld)}
                onClick={this.onClickUpheld}>Upheld</Button>,
            <Button key="btn-overturned" 
                active={(this.state.BoardStatus === vars.Scoreboard.Status.Overturned)}
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
                <ScoreboardTeam Team={this.state.TeamA}/>
                <ScoreboardTeam Team={this.state.TeamB}/>
                <div className="scoreboard-center">
                    <JamClock remote={this.props.remote}/>
                    <div className="jamn-break">
                        <table>
                            <tbody>
                                <JamCounter/>
                                <BreakClock remote={this.props.remote}/>
                            </tbody>
                        </table>
                    </div>
                    <div className="phase">{this.state.PhaseName}</div>
                    <BoardStatus status={this.state.BoardStatus}/>
                    <GameClock remote={this.props.remote}/>
                    <div className="jam-controls">
                        <Button onClick={ScoreboardController.ToggleJamClock} className="jam-button">{jamLabel}</Button>
                        <Icon 
                            src={clockIcon}
                            onClick={ScoreboardController.ToggleGameClock}
                            className="clock-button"
                        />
                    </div>
                </div>
                <div className="board-status-controls">
                    <Icon 
                        src={IconOfficialTimeout}
                        active={this.state.BoardStatus === vars.Scoreboard.Status.Timeout}
                        onClick={ScoreboardController.OfficialTimeout}
                        title="Official Timeout"
                        />
                    <Icon 
                        src={IconInjury}
                        active={this.state.BoardStatus === vars.Scoreboard.Status.Injury}
                        onClick={ScoreboardController.InjuryTimeout}
                        title="Injury Timeout"
                        />
                    <Icon 
                        src={IconCheck}
                        active={this.state.ConfirmStatus === 1}
                        onClick={ScoreboardController.ToggleConfirm}
                        />
                </div>
                <PhaseControl/>
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
                    hour={this.state.StartGameHour}
                    minute={this.state.StartGameMinute}
                    second={this.state.StartGameSecond}
                    />
            </Panel>
        )
    }
}