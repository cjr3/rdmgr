import React from 'react';
import { Unsubscribe } from 'redux';
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import {
    IconX,
    IconButton,
    IconSave,
    IconLoop,
    IconTeam,
    IconStopwatch,
    ToggleButton,
    IconPalette
} from 'components/Elements';
import Counter from 'components/tools/Counter';
import MediaPreview from 'components/tools/MediaPreview';
import GameClock from 'components/apps/Scoreboard/GameClock';
import JamClock from 'components/apps/Scoreboard/JamClock';
import TeamPicker from 'components/apps/Scoreboard/TeamPicker';
import PhaseSelection from '../Scoreboard/PhaseSelection';
import PhaseControl from '../Scoreboard/PhaseControl';
import JamReset from '../Scoreboard/JamReset';
import {default as ScoreboardControllerPanel} from 'components/controllers/Scoreboard';
import {ScoreboardJamControls, ScoreboardPhaseName} from 'components/apps/Scoreboard/Scoreboard';
import Scores from 'components/data/api/Scores';
import Panel from 'components/Panel';
import Score from '../Scoreboard/Team/Score';
import TeamIcons from '../Scoreboard/Team/Icons';
import Logo from '../Scoreboard/Team/Logo';
import {ScoreboardStatusControls} from '../Scoreboard/Scoreboard';
import PhasesController from 'controllers/PhasesController';
import ScoreboardCaptureController, { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';
import APIMatchesController from 'controllers/api/Matches';

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
        Phases:PhasesController.Get(),
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
    constructor(props:PCaptureControlPanel) {
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
        let phases:Array<React.ReactElement> = [];
        this.state.Phases.forEach((phase, index) => {
            phases.push(
                <option
                    key={`${phase.RecordType}-${phase.RecordID}`}
                    value={index}
                    >{phase.Name}</option>
            );
        });

        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={(this.state.panel === 'capture') ? IconX : IconPalette}
                active={this.state.panel === 'capture'}
                key="btn-appearance"
                title="Appearance"
                onClick={() => {
                    this.setState((state) => {
                        if(state.panel == 'capture')
                            return {panel:''};
                        return {panel:'capture'}
                    });
                }}/>,
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

                    <PhaseSelection opened={(this.state.panel === 'phase')}
                        onClose={() => {this.setState({panel:''})}}
                        onSelect={() => {this.setState({panel:''})}}
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
                    <CapturePanel
                        opened={(this.state.panel === 'capture')}
                        onClose={() => {this.setState({panel:''})}}
                    />
                </CaptureControlPanel>
        )
    }
}

/**
 * Component for posting scores to the API Endpoint
 * - This is a wrapper component
 */
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

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.load = this.load.bind(this);
    }

    /**
     * Attempts to load matches from the API
     */
    protected load() {
        this.setState({error:'',title:"Loading...",Matches:[]});
        APIMatchesController.Load().then((records) => {
            if(typeof(records) === 'object')
                this.setState({Matches:records, error:'', title:'Post Scores'});
            else
                this.setState({error:'', title:'Scores'});
        }).catch((er) => {
            this.setState({error:er});
        });
        /*
        DataController.loadAPIMatches(false, {
            sdate:this.props.sdate,
            edate:this.props.edate,
            order:"DESC"
        }).then((matches) => {
            this.setState({Matches:matches, error:'',title:"Post Scores"});
        }).catch((msg:string) => {
            this.setState({error:msg});
        });
        */
    }

    /**
     * Triggered when the component is mounted to the DOM
     */
    componentDidMount() {
        this.load();
    }

    /**
     * Renders the component
     * - A list of matches with textbox entries to adjust scores, and save them.
     */
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

/**
 * Panel for controlling Scorebanner appearance
 */
class CapturePanel extends React.PureComponent<{
    opened:boolean;
    onClose:Function;
}, {
    BackgroundImage:string;
    ClocksShown:boolean;
    ScoreboardClass:string;
}> {
    readonly state = {
        BackgroundImage:ScorebannerCaptureController.GetState().BackgroundImage,
        ClocksShown:ScorebannerCaptureController.GetState().ClocksShown,
        ScoreboardClass:ScoreboardCaptureController.GetState().className
    }

    protected remoteCapture?:Unsubscribe;
    protected remoteScoreboardCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateScoreboardCapture = this.updateScoreboardCapture.bind(this);
        this.onChangeBackground = this.onChangeBackground.bind(this);
        this.onChangeScoreboardClass = this.onChangeScoreboardClass.bind(this);
    }

    /**
     * Update state to match CaptureController
     */
    protected updateCapture() {
        this.setState({
            BackgroundImage:ScorebannerCaptureController.GetState().BackgroundImage,
            ClocksShown:ScorebannerCaptureController.GetState().ClocksShown
        });
    }

    protected updateScoreboardCapture() {
        this.setState({
            ScoreboardClass:ScoreboardCaptureController.GetState().className
        })
    }

    /**
     * Triggered when the user selects a background image for the banner
     * @param filename string
     */
    protected onChangeBackground(filename:string) {
        ScorebannerCaptureController.SetBackground(filename);
    }

    protected onChangeScoreboardClass(ev: React.ChangeEvent<HTMLSelectElement>) {
        let value:string = ev.currentTarget.value;
        ScoreboardCaptureController.SetClass(value);
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = ScorebannerCaptureController.Subscribe(this.updateCapture);
        this.remoteScoreboardCapture = ScoreboardCaptureController.Subscribe(this.updateScoreboardCapture);
    }

    /**
     * Unsubscribe from listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteScoreboardCapture)
            this.remoteScoreboardCapture();
    }

    render() {
        let bg:string = '';
        let sbcClassName:string = '';
        if(this.state.BackgroundImage)
            bg = this.state.BackgroundImage;

        if(this.state.ScoreboardClass)
            sbcClassName = this.state.ScoreboardClass;

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                onClose={this.props.onClose}
                contentName="scorebanner"
                className="scorebanner-panel"
                title="Appearance"
            >
                <h3>Banner</h3>
                <div style={{padding:"6px"}}>
                    <ToggleButton
                        checked={this.state.ClocksShown}
                        label="Show Clocks"
                        onClick={ScorebannerCaptureController.ToggleClocks}
                    />
                </div>
                <div style={{padding:"6px"}}>
                    <MediaPreview
                        src={bg}
                        onChange={this.onChangeBackground}
                        title="Background"
                    />
                </div>
                <h3>Full-Screen</h3>
                <div style={{padding:"6px"}}>
                    <select 
                        size={1} 
                        value={sbcClassName}
                        onChange={this.onChangeScoreboardClass}
                        >
                        <option value="">Default</option>
                        <option value="light">Light</option>
                    </select>
                </div>
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