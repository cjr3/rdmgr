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
import {default as ScoreboardControllerPanel} from 'components/controllers/Scoreboard';
import TeamPicker from './TeamPicker'
import JamReset from './JamReset'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'
import './css/Scoreboard.scss'
import { Unsubscribe } from 'redux'
import UIController from 'controllers/UIController'

/**
 * Component for the Scoreboard control
 */
export default class Scoreboard extends React.PureComponent<any, {
    opened:boolean;
}> {
    readonly state = {
        opened:UIController.getState().Scoreboard.Shown
    }

    protected remoteUI:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.getState().Scoreboard.Shown
        });
    }

    componentDidMount() {
        this.remoteUI = UIController.subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI !== null)
            this.remoteUI();
    }

    render() {
        return (
            <Panel 
                contentName="SB-app" 
                buttons={[<ScoreboardButtons key="buttons"/>]}
                opened={this.state.opened}>
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
                <ScoreboardStatusControls/>
                <ScoreboardPanels/>
            </Panel>
        )
    }
}

/**
 * Component to display status button controls
 * - Timeout
 * - Injury
 * - Confirm Points
 */
class ScoreboardStatusControls extends React.PureComponent<any, {
    BoardStatus:number;
    ConfirmStatus:number;
}> {

    readonly state = {
        BoardStatus:ScoreboardController.getState().BoardStatus,
        ConfirmStatus:ScoreboardController.getState().ConfirmStatus
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected async updateScoreboard() {
        this.setState({
            BoardStatus:ScoreboardController.getState().BoardStatus,
            ConfirmStatus:ScoreboardController.getState().ConfirmStatus
        })
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    /**
     * Renders the component
     */
    render() {
        return (
            <div className="board-status-controls">
                <Icon 
                    src={IconOfficialTimeout}
                    active={this.state.BoardStatus === vars.Scoreboard.Status.Timeout}
                    onClick={ScoreboardController.OfficialTimeout}
                    title="Official Timeout ( CTRL+UP )"
                    />
                <Icon 
                    src={IconInjury}
                    active={this.state.BoardStatus === vars.Scoreboard.Status.Injury}
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
        );
    }
}

/**
 * Component for jam control
 * - Jam Button
 * - Game Clock Button
 */
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

    protected async updateScoreboard() {
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

/**
 * Component for displaying the phase name
 */
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

    protected async updateScoreboard() {
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

    /**
     * 
     */
    render() {
        return (
            <div className="phase">{this.state.name}</div>
        );
    }
}

/**
 * Component for scoreboard buttons
 */
class ScoreboardButtons extends React.PureComponent<any, {
    BoardStatus:number;
    panel:string;
}> {
    readonly state = {
        BoardStatus:ScoreboardController.getState().BoardStatus,
        panel:''
    }

    /**
     * Subscriber for ScoreboardController
     */
    protected remoteScoreboard:Unsubscribe|null = null;

    /**
     * Subscriber for UIController
     */
    protected remoteUI:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.onClickOverturned = this.onClickOverturned.bind(this);
        this.onClickUpheld = this.onClickUpheld.bind(this);
        this.onClickReview = this.onClickReview.bind(this);
        this.onClickTimeout = this.onClickTimeout.bind(this);
        this.onClickInjury = this.onClickInjury.bind(this);
        this.updateUI = this.updateUI.bind(this);
    }

    /**
     * Updates the state to match the scoreboard
     */
    protected async updateScoreboard() {
        this.setState({
            BoardStatus:ScoreboardController.getState().BoardStatus
        });
    }

    /**
     * Updates the state to match the UI controller
     */
    protected async updateUI() {
        this.setState({
            panel:UIController.getState().Scoreboard.Panel
        });
    }

    /**
     * Triggered when the user clicks the upheld button
     */
    protected async onClickUpheld() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Upheld);
    }

    /**
     * Triggered when the user clicks the overturned button.
     */
    protected async onClickOverturned() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Overturned);
    }

    /**
     * Triggered when the user clicks the under review button.
     */
    protected async onClickReview() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Review);
    }

    /**
     * Triggered when the user clicks the timeout button.
     */
    protected async onClickTimeout() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Timeout);
    }

    /**
     * Triggered when the user clicks the injury button.
     */
    protected async onClickInjury() {
        ScoreboardController.SetBoardStatus(vars.Scoreboard.Status.Injury);
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteUI = UIController.subscribe(this.updateUI);
    }

    /**
     * Close controllers
     */
    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
        if(this.remoteUI !== null)
            this.remoteUI();
    }
    
    /**
     * Renders the component
     */
    render() {
        return (
            <React.Fragment>
                <Button 
                    active={(this.state.BoardStatus === vars.Scoreboard.Status.Timeout)}
                    onClick={ScoreboardController.OfficialTimeout}>Timeout</Button>
                <Button
                    active={(this.state.BoardStatus === vars.Scoreboard.Status.Injury)}
                    onClick={ScoreboardController.InjuryTimeout}>Injury</Button>
                <Button 
                    active={(this.state.BoardStatus === vars.Scoreboard.Status.Review)}
                    onClick={this.onClickReview}>Review</Button>
                <Button 
                    active={(this.state.BoardStatus === vars.Scoreboard.Status.Upheld)}
                    onClick={this.onClickUpheld}>Upheld</Button>
                <Button 
                    active={(this.state.BoardStatus === vars.Scoreboard.Status.Overturned)}
                    onClick={this.onClickOverturned}>Overturned</Button>
                <Button 
                    active={(this.state.panel === 'phase')}
                    onClick={() => {UIController.SetScoreboardPanel('phase');}}
                    >Quarter</Button>
                <Button 
                    active={(this.state.panel === 'teams')}
                    onClick={() => {UIController.SetScoreboardPanel('teams');}}
                    >Teams</Button>
                <Button 
                    active={(this.state.panel === 'jamreset')}
                    onClick={() => {UIController.SetScoreboardPanel('jamreset');}}
                    >Jam Reset</Button>
                <Button 
                    active={(this.state.panel === 'edit')}
                    onClick={() => {UIController.SetScoreboardPanel('edit');}}
                    >Edit</Button>
            </React.Fragment>
        )
    }
}

/**
 * Component that holds popup panels for the scoreboard
 */
class ScoreboardPanels extends React.PureComponent<any, {
    panel:string;
}> {
    readonly state = {
        panel:''
    }

    protected remoteUI:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    /**
     * Updates the state to match the UIController
     */
    protected async updateUI() {
        this.setState({
            panel:UIController.getState().Scoreboard.Panel
        });
    }

    /**
     * Start subscribers
     */
    componentDidMount() {
        this.remoteUI = UIController.subscribe(this.updateUI);
    }

    /**
     * Close subscribers
     */
    componentWillUnmount() {
        if(this.remoteUI !== null)
            this.remoteUI();
    }
    
    /**
     * Renders the component
     */
    render() {
        return (
            <React.Fragment>
                <PhaseSelection opened={(this.state.panel === 'phase')}
                    onClose={() => {UIController.SetScoreboardPanel('');}}
                    onSelect={() => {UIController.SetScoreboardPanel('');}}
                    className="phase-selection"
                    />
                <TeamPicker opened={(this.state.panel === 'teams')}
                    onClose={() => {UIController.SetScoreboardPanel('');}}
                    onSubmit={() => {UIController.SetScoreboardPanel('');}}
                    />
                <JamReset
                    opened={(this.state.panel === 'jamreset')}
                    onClose={() => {UIController.SetScoreboardPanel('');}}
                    />
                <ScoreboardControllerPanel
                    opened={(this.state.panel === 'edit')}
                    onClose={() => {UIController.SetScoreboardPanel('');}}
                />
            </React.Fragment>
        )
    }
}