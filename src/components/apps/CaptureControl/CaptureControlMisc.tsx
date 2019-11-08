import React from 'react';
import DataController from 'controllers/DataController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import { Icon, IconLoop, IconCheck, IconHidden, IconShown } from 'components/Elements';
import CaptureController from 'controllers/CaptureController';

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
        StandingsShown:CaptureController.getState().Standings.Shown,
        ScheduleShown:CaptureController.getState().Schedule.Shown,
        ScoresShown:CaptureController.getState().Scores.Shown
    }

    /**
     * CaptureController listener
     */
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the CaptureController
     */
    protected async updateCapture() {
        this.setState({
            StandingsShown:CaptureController.getState().Standings.Shown,
            ScheduleShown:CaptureController.getState().Schedule.Shown,
            ScoresShown:CaptureController.getState().Scores.Shown
        });
    }

    /**
     * Triggered when the user clicks the section's toggle icon
     * - Turns off visibility of all components.
     */
    protected async onToggle() {
        if(this.state.StandingsShown)
            CaptureController.ToggleStandings();

        if(this.state.ScheduleShown)
            CaptureController.ToggleSchedule();

        if(this.state.ScoresShown)
            CaptureController.ToggleScores();
    }

    /**
     * Listen to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }

    /**
     * Close controller listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
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
        Records:CaptureController.getState().Standings.Records,
        Shown:CaptureController.getState().Standings.Shown,
        className:CaptureController.getState().Standings.className,
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
        let cstate = CaptureController.getState().Standings;
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!DataController.compare(records, this.state.Records))
            changes.Records = records;
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                DataController.loadStandings().then((records:any) => {
                    if(records) {
                        CaptureController.SetStandings(records);
                    }
                    this.setState({Loading:false,ErrorMessage:''});
                }).catch((message) => {
                    this.setState({Loading:false,ErrorMessage:message});
                });
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
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
                    onClick={CaptureController.ToggleStandings}
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
        Records:CaptureController.getState().Schedule.Records,
        Shown:CaptureController.getState().Schedule.Shown,
        className:CaptureController.getState().Schedule.className,
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
        let cstate = CaptureController.getState().Schedule;
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!DataController.compare(records, this.state.Records))
            changes.Records = records;
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                DataController.loadSchedule().then((records:any) => {
                    if(records) {
                        CaptureController.SetSchedule(records);
                    }
                    this.setState({Loading:false,ErrorMessage:''});
                }).catch((message) => {
                    this.setState({Loading:false,ErrorMessage:message});
                });
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
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
                    onClick={CaptureController.ToggleSchedule}
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
        Records:CaptureController.getState().Scores.Records,
        Shown:CaptureController.getState().Scores.Shown,
        className:CaptureController.getState().Scores.className,
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
        let cstate = CaptureController.getState().Scores;
        let changes:any = {
            Shown:cstate.Shown,
            className:cstate.className
        }

        let records:any = cstate.Records;
        if(!DataController.compare(records, this.state.Records))
            changes.Records = records;
        this.setState(changes);
    }

    /**
     * Loads the records
     */
    protected async load() {
        if(!this.state.Loading) {
            this.setState({Loading:true}, () => {
                DataController.loadScores().then((records:any) => {
                    if(records) {
                        CaptureController.SetScores(records);
                    }
                    this.setState({Loading:false,ErrorMessage:''});
                }).catch((message) => {
                    this.setState({Loading:false,ErrorMessage:message});
                });
            });
        }
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
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
                    onClick={CaptureController.ToggleScores}
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