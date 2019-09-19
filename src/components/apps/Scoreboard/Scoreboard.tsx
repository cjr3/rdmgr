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
    IconCheck, 
    IconPlay} from 'components/Elements'
import PhaseControl from './PhaseControl'
import PhaseSelection from './PhaseSelection'
import TeamPicker from './TeamPicker'
import JamReset from './JamReset'
import DisplayPanel from './DisplayPanel'
import vars from 'tools/vars'
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'
import './css/Scoreboard.scss'

interface SScoreboard {
    BoardStatus:number,
    JamState:number,
    BreakState:number,
    GameState:number,
    ConfirmStatus:number,
    PhaseName:string,
    TeamA:SScoreboardTeam,
    TeamB:SScoreboardTeam,
    PhaseOpened:boolean,
    TeamOpened:boolean,
    DisplayOpened:boolean,
    JamResetOpened:boolean,
    StartGameHour:number,
    StartGameMinute:number,
    StartGameSecond:number
}

interface PScoreboard {
    remote?:string,
    opened:boolean
}

/**
 * Component for the scoreboard control
 */
class Scoreboard extends React.Component<PScoreboard, SScoreboard> {
    readonly state:SScoreboard = {
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

    JamLabels:Array<string> = ["JAM", "STOP", "READY"];

    remoteScore:Function

    constructor(props) {
        super(props);
        this.onClickDisplay = this.onClickDisplay.bind(this);
        this.onClickPhase = this.onClickPhase.bind(this);
        this.onClickResetJam = this.onClickResetJam.bind(this);
        this.onClickTeams = this.onClickTeams.bind(this);
        this.onClickOverturned = this.onClickOverturned.bind(this);
        this.onClickUpheld = this.onClickUpheld.bind(this);
        this.onClickReview = this.onClickReview.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScore = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({
            BoardStatus:ScoreboardController.getState().BoardStatus,
            JamState:ScoreboardController.getState().JamState,
            ConfirmStatus:ScoreboardController.getState().ConfirmStatus,
            PhaseName:ScoreboardController.getState().PhaseName,
            TeamA:ScoreboardController.getState().TeamA,
            TeamB:ScoreboardController.getState().TeamB
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
     * Renders the component
     */
    render() {
        var jamLabel = this.JamLabels[this.state.JamState];
        var clockIcon = IconPlay
            
        if(ScoreboardController.getState().GameState === vars.Clock.Status.Running) {
            //clockIcon = 'pause.png';
        }
        
        var buttons = [
            <Button key="btn-review" 
                active={(this.state.BoardStatus == vars.Scoreboard.Status.Review)}
                onClick={this.onClickReview}>Review</Button>,
            <Button key="btn-upheld" 
                active={(this.state.BoardStatus == vars.Scoreboard.Status.Upheld)}
                onClick={this.onClickUpheld}>Upheld</Button>,
            <Button key="btn-overturned" 
                active={(this.state.BoardStatus == vars.Scoreboard.Status.Overturned)}
                onClick={this.onClickOverturned}>Overturned</Button>,
            <Button key="btn-display" 
                active={(this.state.DisplayOpened)}
                onClick={this.onClickDisplay}>Display</Button>,
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
                        src={require('images/icons/oto.png')}
                        active={this.state.BoardStatus === vars.Scoreboard.Status.Timeout}
                        onClick={ScoreboardController.OfficialTimeout}
                        title="Official Timeout"
                        />
                    <Icon 
                        src={require('images/icons/injury.png')}
                        active={this.state.BoardStatus === vars.Scoreboard.Status.Injury}
                        onClick={ScoreboardController.InjuryTimeout}
                        title="Injury Timeout"
                        />
                    <Icon 
                        src={require('images/icons/check.png')}
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
                <DisplayPanel opened={this.state.DisplayOpened}/>
            </Panel>
        )
    }
}

export default Scoreboard;