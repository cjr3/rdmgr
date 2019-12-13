import React from 'react';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import DataController from 'controllers/DataController';
import {
    IconX,
    IconCheck,
    IconButton,
    Button,
    IconSave,
    IconLoop,
    Icon,
    IconTeam,
    IconStopwatch
} from 'components/Elements';
import { PhaseRecord } from 'tools/vars';
import Counter from 'components/tools/Counter';
import MediaPreview from 'components/tools/MediaPreview';

import JamCounter from 'components/apps/Scoreboard/JamCounter';
import GameClock from 'components/apps/Scoreboard/GameClock';
import JamClock from 'components/apps/Scoreboard/JamClock';
import TeamPicker from 'components/apps/Scoreboard/TeamPicker';
import PhaseSelection from '../Scoreboard/PhaseSelection';
import JamReset from '../Scoreboard/JamReset';
import {default as ScoreboardControllerPanel} from 'components/controllers/Scoreboard';
import UIController from 'controllers/UIController';
import {ScoreboardJamControls} from 'components/apps/Scoreboard/Scoreboard';
import Scores from 'components/data/api/Scores';
import Panel from 'components/Panel';

/**
 * Component for configuring the score banner.
 */
export default class CaptureControlScorebanner extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Left side socreboard team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right side scoreboard team
     */
    TeamB:SScoreboardTeam;
    /**
     * Current phase index
     */
    PhaseIndex:number;
    /**
     * Jam #
     */
    JamCounter:number;
    /**
     * Phases / quarters to select from
     */
    Phases:Array<PhaseRecord>;
    /**
     * Determines if the scorebanner is shown or note
     */
    Shown:boolean;
    /**
     * Determines if the clocks (jam and game) are displayed on the screen
     */
    ClocksShown:boolean;
    /**
     * Background for the scorebanner
     */
    BackgroundImage?:string;
    /**
     * Currently opened panel
     */
    panel:string;
}> {

    readonly state = {
        TeamA:ScoreboardController.getState().TeamA,
        TeamB:ScoreboardController.getState().TeamB,
        JamCounter:ScoreboardController.getState().JamCounter,
        PhaseIndex:ScoreboardController.getState().PhaseIndex,
        Phases:DataController.getPhases(),
        Shown:CaptureController.getState().Scorebanner.Shown,
        ClocksShown:CaptureController.getState().Scorebanner.ClocksShown,
        BackgroundImage:CaptureController.getState().Scorebanner.BackgroundImage,
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
    constructor(props:PCaptureControlPanel) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateData = this.updateData.bind(this);
        this.onAddJam = this.onAddJam.bind(this);
        this.onSubtractJam = this.onSubtractJam.bind(this);
        this.onChangePhase = this.onChangePhase.bind(this);
        this.onChangeBackground = this.onChangeBackground.bind(this);
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
    updateState() {
        this.setState(() => {
            return {
                TeamA:ScoreboardController.getState().TeamA,
                TeamB:ScoreboardController.getState().TeamB,
                JamCounter:ScoreboardController.getState().JamCounter,
                PhaseIndex:ScoreboardController.getState().PhaseIndex
            }
        });
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:CaptureController.getState().Scorebanner.Shown,
                ClocksShown:CaptureController.getState().Scorebanner.ClocksShown,
                BackgroundImage:CaptureController.getState().Scorebanner.BackgroundImage
            }
        });
    }

    /**
     * Updates the state to match the data controller.
     * - Update Phases.
     */
    updateData() {
        this.setState(() => {
            return {Phases:DataController.getPhases()}
        });
    }

    /**
     * Triggered when the user increase the jam counter
     * @param amount number
     */
    onAddJam(amount) {
        ScoreboardController.IncreaseJamCounter(amount);
    }

    /**
     * Triggered when the user decreases the jam counter
     * @param amount number
     */
    onSubtractJam(amount) {
        ScoreboardController.DecreaseJamCounter(amount);
    }

    /**
     * Triggered when the user changes the phase
     * @param ev React.ChangeEvent<HTMLSelectElement>
     */
    onChangePhase(ev:React.ChangeEvent<HTMLSelectElement>) {
        ScoreboardController.SetPhase(parseInt(ev.currentTarget.value));
    }

    /**
     * Triggered when the user clicks on the right side team's score
     */
    onClickIncreaseTeamAScore() {
        ScoreboardController.IncreaseTeamScore('A', 1);
    }

    /**
     * Triggered when the user context-clicks on the left-side team's score
     */
    onClickDecreaseTeamAScore() {
        ScoreboardController.DecreaseTeamScore('A', 1);
    }

    /**
     * Triggered when the user clicks on the left side team's score
     */
    onClickIncreaseTeamBScore() {
        ScoreboardController.IncreaseTeamScore('B', 1);
    }

    /**
     * Triggered when the user context-clicks on the right-side team's score
     */
    onClickDecreaseTeamBScore() {
        ScoreboardController.DecreaseTeamScore('B', 1);
    }

    /**
     * Triggered when the user selects a background image for the banner
     * @param filename string
     */
    onChangeBackground(filename:string) {
        CaptureController.SetScorebannerBackground(filename);
    }

    /**
     * Triggered when the component updates
     * @param prevProps PCaptureControlPanel
     * @param prevState 
     */
    componentDidUpdate(prevProps:PCaptureControlPanel, prevState) {
        if(prevState.JamCounter !== this.state.JamCounter) {
            if(this.JamCounterItem !== null && this.JamCounterItem.current !== null) {
                this.JamCounterItem.current.set(this.state.JamCounter, false);
            }
        }
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScoreboardController.subscribe(this.updateState);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let phases:Array<React.ReactElement> = [];
        this.state.Phases.forEach((phase, index) => {
            phases.push(
                <option
                    key={`${phase.RecordType}-${phase.RecordID}`}
                    value={index}
                    >{phase.Name}</option>
            );
        });

        let bg:string = (this.state.BackgroundImage !== undefined) ? this.state.BackgroundImage : '';

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={(this.state.panel === 'scores') ? IconX : IconSave}
                active={this.state.panel === 'scores'}
                key="btn-scores"
                title="Scores"
                onClick={() => {
                    this.setState((state) => {
                        if(state.panel == 'scores')
                            return {panel:''};
                        return {panel:'scores'}
                    });
                }}/>,
            <IconButton
                src={(this.state.panel === 'teams') ? IconX : IconTeam} 
                active={this.state.panel === 'teams'}
                key="btn-teams"
                title="Teams"
                onClick={() => {
                    this.setState((state) => {
                        if(state.panel == 'teams')
                            return {panel:''};
                        return {panel:'teams'}
                    });
                }}
                />,
            <IconButton
                src={(this.state.panel === 'phase') ? IconX : IconStopwatch}
                active={this.state.panel === 'phase'}
                key="btn-phase"
                title="Quarter"
                onClick={() => {
                    this.setState((state) => {
                        if(state.panel == 'phase')
                            return {panel:''};
                        return {panel:'phase'}
                    });
                }}
                />
        );

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}
                className="scorebanner"
                buttons={buttons}
                >
                    <div className="stack-panel s2">
                        <div 
                            className="team-score"
                            style={{
                                backgroundColor:this.state.TeamA.Color
                            }}
                            onClick={this.onClickIncreaseTeamAScore}
                            onContextMenu={this.onClickDecreaseTeamAScore}
                            >
                            {this.state.TeamA.Score}
                        </div>
                        <div 
                            className="team-score"
                            style={{
                                backgroundColor:this.state.TeamB.Color
                            }}
                            onClick={this.onClickIncreaseTeamBScore}
                            onContextMenu={this.onClickDecreaseTeamBScore}
                            >
                            {this.state.TeamB.Score}
                        </div>
                    </div>
                    <div className="record-list">
                        <IconButton
                            src={(this.state.ClocksShown === false) ? IconCheck : IconX}
                            active={(this.state.ClocksShown === false)}
                            onClick={CaptureController.ToggleScorebannerClocks}
                        >Hide Clocks</IconButton>
                    </div>
                    <table cellPadding={5}>
                        <tbody>
                            <tr>
                                <td>Jam Clock</td>
                                <td><JamClock onClick={ScoreboardController.ToggleJamClock}/></td>
                            </tr>
                            <tr>
                                <td>Game Clock</td>
                                <td><GameClock/></td>
                            </tr>
                            <JamCounter/>
                            <tr>
                                <td>Background</td>
                                <td>
                                    <MediaPreview
                                        src={bg}
                                        onChange={this.onChangeBackground}
                                        title="Background"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <ScoreboardJamControls/>

                    <PhaseSelection opened={(this.state.panel === 'phase')}
                        onClose={() => {this.setState({panel:''})}}
                        onSelect={() => {this.setState({panel:''})}}
                        className="phase-selection"
                        />
                    <TeamPicker opened={(this.state.panel === 'teams')}
                        onClose={() => {this.setState({panel:''})}}
                        onSubmit={() => {this.setState({panel:''})}}
                        />
                    <JamReset
                        opened={(this.state.panel === 'jamreset')}
                        onClose={() => {this.setState({panel:''})}}
                        />
                    <ScoreboardControllerPanel
                        opened={(this.state.panel === 'edit')}
                        onClose={() => {this.setState({panel:''})}}
                    />
                    <ScoresPanel
                        opened={(this.state.panel === 'scores')}
                        onClose={() => {this.setState({panel:''})}}
                        className="scores-panel"
                        sdate={this.StartDate}
                        edate={this.EndDate}
                    />
                </CaptureControlPanel>
        )
    }
}

class ScoresPanel extends React.PureComponent<{
    opened:boolean;
    sdate?:string;
    edate?:string;
    onClose?:Function;
    className?:string;
}, {
    Matches:Array<any>;
    error?:string;
    title:string;
}> {

    readonly state = {
        Matches:[],
        error:'',
        title:"Post Scores"
    }

    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
    }

    protected load() {
        this.setState({error:'',title:"Loading...",Matches:[]});
        DataController.loadAPIMatches(false, {
            sdate:this.props.sdate,
            edate:this.props.edate,
            order:"DESC"
        }).then((matches) => {
            this.setState({Matches:matches, error:'',title:"Post Scores"});
        }).catch((msg:string) => {
            this.setState({error:msg});
        });
    }

    componentDidMount() {
        this.load();
    }

    render() {

        const buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={IconLoop}
                onClick={this.load}
                key="btn-load"
                >
                Load
            </IconButton>
        );

        return (
            <Panel
                popup={true}
                className="scores-panel"
                opened={this.props.opened}
                buttons={buttons}
                error={this.state.error}
                title={this.state.title}
                {...this.props}
                >
                <p>
                    Scores that are more than 30 days old cannot be changed.
                </p>
                <Scores Matches={this.state.Matches}/>
            </Panel>
        );
    }
}