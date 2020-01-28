import React from 'react';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import { Icon, IconLoop, IconCheck, IconHidden, IconShown } from 'components/Elements';
import StandingsCaptureController from 'controllers/capture/Standings';
import ScheduleCaptureController from 'controllers/capture/Schedule';
import ScoresCaptureController from 'controllers/capture/Scores';
import { Compare } from 'controllers/functions';

/**
 * Component for misc records on the CaptureControl component
 */
export default class CaptureControlMisc extends React.PureComponent<PCaptureControlPanel, {
    /**
     * Determines if the standings are shown
     */
    StandingsShown:boolean;
    /**
     * Determines if the schedule is shown
     */
    ScheduleShown:boolean;
    /**
     * Determines if the latest scores are shown
     */
    ScoresShown:boolean;
}> {

    readonly state = {
        StandingsShown:StandingsCaptureController.GetState().Shown,
        ScheduleShown:ScheduleCaptureController.GetState().Shown,
        ScoresShown:ScoresCaptureController.GetState().Shown
    }

    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;
    protected remoteSchedule?:Unsubscribe;
    protected remoteScores?:Unsubscribe;
    protected remoteStandings?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.updateScheduleCapture = this.updateScheduleCapture.bind(this);
        this.updateScoresCapture = this.updateScoresCapture.bind(this);
        this.updateStandingsCapture = this.updateStandingsCapture.bind(this);
    }

    protected updateStandingsCapture() {
        this.setState({StandingsShown:StandingsCaptureController.GetState().Shown});
    }

    protected updateScheduleCapture() {
        this.setState({ScheduleShown:ScheduleCaptureController.GetState().Shown});
    }

    protected updateScoresCapture() {
        this.setState({ScoresShown:ScoresCaptureController.GetState().Shown});
    }

    /**
     * Triggered when the user clicks the section's toggle icon
     * - Turns off visibility of all components.
     */
    protected async onToggle() {
        if(this.state.StandingsShown)
            StandingsCaptureController.Toggle();

        if(this.state.ScheduleShown)
            ScheduleCaptureController.Toggle();

        if(this.state.ScoresShown)
            ScoresCaptureController.Toggle();
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteSchedule = ScheduleCaptureController.Subscribe(this.updateScheduleCapture);
        this.remoteStandings = StandingsCaptureController.Subscribe(this.updateStandingsCapture);
        this.remoteScores = ScoresCaptureController.Subscribe(this.updateScoresCapture);
    }

    /**
     * Close controller listeners
     */
    componentWillUnmount() {
        if(this.remoteSchedule)
            this.remoteSchedule();
        if(this.remoteScores)
            this.remoteScores();
        if(this.remoteStandings)
            this.remoteStandings();
    }

    /**
     * Renders the component
     */
    render() {

        let shown:boolean = false;
        //set to true if any of the components are shown on the CaptureForm
        if(this.state.StandingsShown || this.state.ScheduleShown || this.state.ScoresShown) {
            shown = true;
        }

        return(
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.onToggle}
                shown={shown}
                onClick={this.props.onClick}>
                <div className="record-list misc-records">
                    <Standings/>
                    <Schedule/>
                    <Scores/>
                </div>
            </CaptureControlPanel>
        );
    }
}

/**
 * Element for loading and toggling Standings
 */
class Standings extends React.PureComponent<any, {
    /**
     * Records loaded from the API
     */
    Records:Array<any>;
    /**
     * True = visible, false = not visible, on the CaptureForm
     */
    Shown:boolean;
    /**
     * True if loading
     */
    Loading:boolean;
    /**
     * Last error message
     */
    ErrorMessage:string;
    /**
     * Class Name on the CaptureForm
     */
    className:string;
}> {
    readonly state = {
        Records:StandingsCaptureController.Get(),
        Shown:StandingsCaptureController.GetState().Shown,
        className:StandingsCaptureController.GetState().className,
        Loading:false,
        ErrorMessage:''
    }

    /**
     * Listener for CaptureController
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.load = this.load.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        let cstate = StandingsCaptureController.GetState();
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!Compare(records, this.state.Records)) {
            changes.Records = records;
        }
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                StandingsCaptureController.Load().then(() => {
                    this.setState({Loading:false});
                }).catch((er) => {
                    this.setState({
                        Loading:false,
                        ErrorMessage:'Failed to load Standings!'
                    })
                })
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = StandingsCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let iconShown:string = IconHidden;
        let iconLoad:string = IconLoop;
        if(this.state.Shown)
            iconShown = IconShown;
        
        if(!this.state.Loading && this.state.Records.length)
            iconLoad = IconCheck;

        return (
            <div className="item">
                <div className="name">Standings</div>
                <Icon
                    src={iconShown}
                    active={(this.state.Shown)}
                    onClick={StandingsCaptureController.Toggle}
                    />
                <Icon 
                    src={iconLoad} 
                    active={(this.state.Loading)}
                    onClick={this.load}/>
                <div className={(cnames('error-message', {shown:(this.state.ErrorMessage)}))}>
                    {this.state.ErrorMessage}
                </div>
            </div>
        );
    }
}

/**
 * Element for loading and toggling Schedule
 */
class Schedule extends React.PureComponent<any, {
    /**
     * Records loaded from the API
     */
    Records:Array<any>;
    /**
     * True = visible, false = not visible, on the CaptureForm
     */
    Shown:boolean;
    /**
     * True if loading
     */
    Loading:boolean;
    /**
     * Last error message
     */
    ErrorMessage:string;
    /**
     * Class Name on the CaptureForm
     */
    className:string;
}> {
    readonly state = {
        Records:ScheduleCaptureController.Get(),
        Shown:ScheduleCaptureController.GetState().Shown,
        className:ScheduleCaptureController.GetState().className,
        Loading:false,
        ErrorMessage:''
    }

    /**
     * Listener for CaptureController
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.load = this.load.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        let cstate = ScheduleCaptureController.GetState();
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!Compare(records, this.state.Records)) {
            changes.Records = records;
        }
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                ScheduleCaptureController.Load().then(() => {
                    this.setState({Loading:false});
                }).catch((er) => {
                    this.setState({
                        Loading:false,
                        ErrorMessage:'Failed to Schedule!'
                    });
                })
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = ScheduleCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let iconShown:string = IconHidden;
        let iconLoad:string = IconLoop;
        if(this.state.Shown)
            iconShown = IconShown;
        
        if(!this.state.Loading && this.state.Records.length)
            iconLoad = IconCheck;

        return (
            <div className="item">
                <div className="name">Schedule</div>
                <Icon
                    src={iconShown}
                    active={(this.state.Shown)}
                    onClick={ScheduleCaptureController.Toggle}
                    />
                <Icon 
                    src={iconLoad} 
                    active={(this.state.Loading)}
                    onClick={this.load}/>
                <div className={(cnames('error-message', {shown:(this.state.ErrorMessage)}))}>
                    {this.state.ErrorMessage}
                </div>
            </div>
        );
    }
}

/**
 * Element for loading and toggling Schedule
 */
class Scores extends React.PureComponent<any, {
    /**
     * Records loaded from the API
     */
    Records:Array<any>;
    /**
     * True = visible, false = not visible, on the CaptureForm
     */
    Shown:boolean;
    /**
     * True if loading
     */
    Loading:boolean;
    /**
     * Last error message
     */
    ErrorMessage:string;
    /**
     * Class Name on the CaptureForm
     */
    className:string;
}> {
    readonly state = {
        Records:ScoresCaptureController.Get(),
        Shown:ScoresCaptureController.GetState().Shown,
        className:ScoresCaptureController.GetState().className,
        Loading:false,
        ErrorMessage:''
    }

    /**
     * Listener for CaptureController
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.load = this.load.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        let cstate = ScoresCaptureController.GetState();
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!Compare(records, this.state.Records)) {
            changes.Records = records;
        }
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                ScoresCaptureController.Load().then(() => {
                    this.setState({Loading:false});
                }).catch((er) => {
                    this.setState({
                        Loading:false,
                        ErrorMessage:'Failed to load Scores!'
                    });
                })
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = ScoresCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let iconShown:string = IconHidden;
        let iconLoad:string = IconLoop;
        if(this.state.Shown)
            iconShown = IconShown;
        
        if(!this.state.Loading && this.state.Records.length)
            iconLoad = IconCheck;

        return (
            <div className="item">
                <div className="name">Latest Scores</div>
                <Icon
                    src={iconShown}
                    active={(this.state.Shown)}
                    onClick={ScoresCaptureController.Toggle}
                    />
                <Icon 
                    src={iconLoad} 
                    active={(this.state.Loading)}
                    onClick={this.load}/>
                <div className={(cnames('error-message', {shown:(this.state.ErrorMessage)}))}>
                    {this.state.ErrorMessage}
                </div>
            </div>
        );
    }
}