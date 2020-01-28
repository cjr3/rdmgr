import React from 'react'
import vars from 'tools/vars'
import cnames from 'classnames'
import './css/CaptureScoreboard.scss'
import ScoreboardController, {SScoreboardState, Sides} from 'controllers/ScoreboardController'

import {
    IconNo,
    IconFlag
} from 'components/Elements';
import ScoreboardCaptureController from 'controllers/capture/Scoreboard'
import { Unsubscribe } from 'redux'
import { AddMediaPath } from 'controllers/functions';
import DataController from 'controllers/DataController'

/**
 * Component for displaying the full-size scoreboard on the capture window.
 */
export default class CaptureScoreboard extends React.Component<any, {
    State:SScoreboardState;
    Shown:boolean;
    className:string;
}> {

    readonly state = {
        State:ScoreboardController.GetState(),
        Shown:ScoreboardCaptureController.GetState().Shown,
        className:ScoreboardCaptureController.GetState().className
    }

    /**
     * ScoreboardController remote
     */
    protected remoteState?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        this.setState({State:ScoreboardController.GetState()});
    }

    protected updateCapture() {
        this.setState({
            Shown:ScoreboardCaptureController.GetState().Shown,
            className:ScoreboardCaptureController.GetState().className
        });
    }

    /**
     * Gets the game clock formatted as a string.
     * @return String
     */
    protected getClockText() {
        let hour:number = (this.state.State.GameHour) ? this.state.State.GameHour : 0;
        let min:number = (this.state.State.GameMinute) ? this.state.State.GameMinute : 0;
        let sec:number = (this.state.State.GameSecond) ? this.state.State.GameSecond : 0;
        let str:string = min.toString().padStart(2,'0') + ":" + sec.toString().padStart(2,'0');
        if(hour > 0) {
            str = hour.toString().padStart(2,'0') + ":" + str;
        }
        return str;
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScoreboardController.Subscribe(this.updateState);
        this.remoteCapture = ScoreboardCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        let classNames:string = cnames({
            "capture-SB":true,
            shown:this.state.Shown,
            jamming:(this.state.State.JamState === vars.Clock.Status.Running),
        }, this.state.className);

        let breakNames:string = cnames({
            breakclock:true,
            shown:(this.state.State.BreakState === vars.Clock.Status.Running || this.state.State.BreakState === vars.Clock.Status.Stopped)
        });

        let gameNames:string = cnames({
            gameclock:true,
            running:(this.state.State.GameState === vars.Clock.Status.Running),
            stopped:(this.state.State.GameState === vars.Clock.Status.Stopped),
            hours:(this.state.State.GameHour > 0)
        });
        
        let jamCounter:number = (this.state.State.JamCounter) ? this.state.State.JamCounter : 0;
        let breakSecond:number = (this.state.State.BreakSecond) ? this.state.State.BreakSecond : 0;
        let jamStateNames:string = cnames({
            jamstate:true,
            shown:(this.state.State.JamState === vars.Clock.Status.Ready),
            warning:(this.state.State.BreakSecond <= 0 && this.state.State.JamState === vars.Clock.Status.Ready)
        });

        return (
            <div className={classNames}>
                <JamClock/>
                <div className="phase">{this.state.State.PhaseName}</div>
                <div className="jam-counter">{"JAM " + jamCounter.toString().padStart(2,'0')}</div>
                <div className={gameNames}>{this.getClockText()}</div>
                <BoardStatus/>
                <LeagueLogo/>
                <div className={breakNames}>{breakSecond.toString().padStart(2,'0')}</div>
                <div className={jamStateNames}></div>
                <TeamElement side='A'/>
                <TeamElement side='B'/>
            </div>
        );
    }
}

class JamClock extends React.PureComponent<any, {
    ClockState:number;
    MaxJamSeconds:number;
    Hour:number;
    Minute:number;
    Second:number;
}> {
    readonly state = {
        ClockState:ScoreboardController.GetState().JamState,
        MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds,
        Hour:ScoreboardController.GetState().JamHour,
        Minute:ScoreboardController.GetState().JamMinute,
        Second:ScoreboardController.GetState().JamSecond
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScoreboard() {
        this.setState({
            ClockState:ScoreboardController.GetState().JamState,
            MaxJamSeconds:ScoreboardController.GetState().MaxJamSeconds,
            Hour:ScoreboardController.GetState().JamHour,
            Minute:ScoreboardController.GetState().JamMinute,
            Second:ScoreboardController.GetState().JamSecond
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {

        let className:string = cnames('jamclock', {
            longjam:(this.state.MaxJamSeconds > 60 || this.state.Second > 60),
            running:(this.state.ClockState === vars.Clock.Status.Running),
            warning:(this.state.Second <= 10),
            danger:(this.state.Second <= 5),
            stopped:(this.state.ClockState === vars.Clock.Status.Stopped)
        });

        let jamTime = this.state.Second.toString().padStart(2,'0');

        if(this.state.MaxJamSeconds > 60 || this.state.Second > 60) {
            let minutes:number = 0;
            let seconds:number = this.state.Second;
            while(seconds >= 60) {
                minutes++;
                seconds -= 60;
            }
            jamTime = minutes.toString().padStart(2,'0') + ":" + seconds.toString().padStart(2,'0');
        }

        return (
            <div className={className}>
                {jamTime}
            </div>
        )
    }
}

class BoardStatus extends React.PureComponent<any, {
    Status:number;
}> {

    readonly state = {
        Status:ScoreboardController.GetState().BoardStatus
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScoreboard() {
        this.setState({
            Status:ScoreboardController.GetState().BoardStatus
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {

        let classNameTimeout = cnames('board-status', {
            timeout:true,
            shown:(this.state.Status == vars.Scoreboard.Status.Timeout)
        });

        let classNameInjury = cnames('board-status', {
            injury:true,
            shown:(this.state.Status == vars.Scoreboard.Status.Injury)
        });
        
        let classNameReview = cnames('board-status', {
            review:true,
            shown:(this.state.Status == vars.Scoreboard.Status.Review)
        });

        let classNameOverturned = cnames('board-status', {
            overturned:true,
            shown:(this.state.Status == vars.Scoreboard.Status.Overturned)
        });

        let classNameUpheld = cnames('board-status', {
            upheld:true,
            shown:(this.state.Status == vars.Scoreboard.Status.Upheld)
        });

        return (
            <React.Fragment>
                <div className={classNameTimeout}>{vars.Scoreboard.StatusText[vars.Scoreboard.Status.Timeout]}</div>
                <div className={classNameInjury}>{vars.Scoreboard.StatusText[vars.Scoreboard.Status.Injury]}</div>
                <div className={classNameReview}>{vars.Scoreboard.StatusText[vars.Scoreboard.Status.Review]}</div>
                <div className={classNameOverturned}>{vars.Scoreboard.StatusText[vars.Scoreboard.Status.Overturned]}</div>
                <div className={classNameUpheld}>{vars.Scoreboard.StatusText[vars.Scoreboard.Status.Upheld]}</div>
            </React.Fragment>
        )
    }
}

class TeamElement extends React.PureComponent<{
    side:Sides;
}> {

    render() {
        return (
            <div className={`team team-${this.props.side}`}>
                <TeamLogo side={this.props.side}/>
                <TeamScore side={this.props.side}/>
                <TeamStatus side={this.props.side}/>
                <TeamTimeouts side={this.props.side}/>
                <TeamChallenges side={this.props.side}/>
                <TeamJamPoints side={this.props.side}/>
            </div>
        );
    }
}

class TeamLogo extends React.PureComponent<{
    side:Sides;
}, {
    Thumbnail:string;
    Name:string;
}> {
    readonly state = {
        Thumbnail:'',
        Name:''
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Thumbnail = ScoreboardController.GetState().TeamA.Thumbnail;
            this.state.Name = ScoreboardController.GetState().TeamA.Name;
        } else {
            this.state.Thumbnail = ScoreboardController.GetState().TeamB.Thumbnail;
            this.state.Name = ScoreboardController.GetState().TeamB.Name;
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({
                Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail,
                Name:ScoreboardController.GetState().TeamA.Name
            });
        } else {
            this.setState({
                Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail,
                Name:ScoreboardController.GetState().TeamB.Name
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        if(this.state.Thumbnail) {
            return (
                <div className="logo">
                    <img src={AddMediaPath(this.state.Thumbnail)} alt=""/>
                </div>
            );
        } else {
            return (
                <div className="logo">
                    <div className="name">{this.state.Name}</div>
                </div>
            );
        }
    }
}

class TeamScore extends React.PureComponent<{
    side:Sides;
}, {
    Score:number;
    Color:string;
}> {
    readonly state = {
        Score:0,
        Color:'#000'
    }

    protected remoteScoreboard?:Unsubscribe;
    private Timer:any = 0;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Score = ScoreboardController.GetState().TeamA.Score;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
        } else {
            this.state.Score = ScoreboardController.GetState().TeamB.Score;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected updateScoreboard() {
        try {clearTimeout(this.Timer);} catch(er){}
        if(this.props.side == 'A') {
            this.setState({
                Color:ScoreboardController.GetState().TeamA.Color
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Score:ScoreboardController.GetState().TeamA.Score
                    });
                }, 500);
            });
        } else {
            this.setState({
                Color:ScoreboardController.GetState().TeamB.Color
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Score:ScoreboardController.GetState().TeamB.Score
                    });
                }, 500);
            });
        }
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
            <div className="score" style={{backgroundColor:this.state.Color}}>{this.state.Score}</div>
        );
    }
}

class TeamStatus extends React.PureComponent<{
    side:Sides;
}, {
    Status:number;
}> {

    readonly state = {
        Status:vars.Team.Status.Normal
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Status = ScoreboardController.GetState().TeamA.Status;
        } else {
            this.state.Status = ScoreboardController.GetState().TeamB.Status;
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({
                Status:ScoreboardController.GetState().TeamA.Status
            });
        } else {
            this.setState({
                Status:ScoreboardController.GetState().TeamB.Status
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {

        let classNameTimeout = cnames('status', {
            timeout:true,
            shown:(this.state.Status == vars.Team.Status.Timeout)
        });

        let classNameChallenge = cnames('status', {
            challenge:true,
            shown:(this.state.Status == vars.Team.Status.Challenge)
        });
        
        let classNameLead = cnames('status', {
            leadjammer:true,
            shown:(this.state.Status == vars.Team.Status.LeadJammer)
        });

        let classNamePowerJam = cnames('status', {
            powerjam:true,
            shown:(this.state.Status == vars.Team.Status.PowerJam)
        });

        let classNameInjury = cnames('status', {
            injury:true,
            shown:(this.state.Status == vars.Team.Status.Injury)
        });

        return (
            <React.Fragment>
                <div className={classNameTimeout}>{vars.Team.StatusText[vars.Team.Status.Timeout]}</div>
                <div className={classNameChallenge}>{vars.Team.StatusText[vars.Team.Status.Challenge]}</div>
                <div className={classNameInjury}>{vars.Team.StatusText[vars.Team.Status.Injury]}</div>
                <div className={classNameLead}>{vars.Team.StatusText[vars.Team.Status.LeadJammer]}</div>
                <div className={classNamePowerJam}>{vars.Team.StatusText[vars.Team.Status.PowerJam]}</div>
            </React.Fragment>
        )
    }

}

class TeamTimeouts extends React.PureComponent<{
    side:Sides;
}, {
    Amount:number;
}> {
    readonly state = {
        Amount:0
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Amount = ScoreboardController.GetState().TeamA.Timeouts;
        } else {
            this.state.Amount = ScoreboardController.GetState().TeamB.Timeouts;
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({Amount:ScoreboardController.GetState().TeamA.Timeouts});
        } else {
            this.setState({Amount:ScoreboardController.GetState().TeamB.Timeouts});
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }
    
    render() {
        let timeouts:Array<React.ReactElement> = new Array<React.ReactElement>();
        for(let i=0; i < this.state.Amount; i++) {
            timeouts.push(<img src={IconNo} key={"timeout-" + i} alt=""/>);
        }
        return (
            <div className="timeouts">{timeouts}</div>
        )
    }
}

class TeamChallenges extends React.PureComponent<{
    side:Sides;
}, {
    Amount:number;
}> {
    readonly state = {
        Amount:0
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Amount = ScoreboardController.GetState().TeamA.Challenges;
        } else {
            this.state.Amount = ScoreboardController.GetState().TeamB.Challenges;
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({Amount:ScoreboardController.GetState().TeamA.Challenges});
        } else {
            this.setState({Amount:ScoreboardController.GetState().TeamB.Challenges});
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }
    
    render() {
        let icons:Array<React.ReactElement> = new Array<React.ReactElement>();
        for(let i=0; i < this.state.Amount; i++) {
            icons.push(<img src={IconFlag} key={"challenge-" + i} alt=""/>);
        }
        return (
            <div className="challenges">{icons}</div>
        )
    }
}

class TeamJamPoints extends React.PureComponent<{
    side:Sides;
}, {
    Amount:number;
    Color:string;
    Shown:boolean;
}> {
    readonly state = {
        Amount:0,
        Color:'#000',
        Shown:(ScoreboardController.GetState().ConfirmStatus == 1)
    }

    protected remoteScoreboard?:Unsubscribe;

    private Timer:any = 0;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Amount = ScoreboardController.GetState().TeamA.JamPoints;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
        } else {
            this.state.Amount = ScoreboardController.GetState().TeamB.JamPoints;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected updateScoreboard() {
        try {clearTimeout(this.Timer);}catch(er){}
        if(this.props.side == 'A') {
            this.setState({
                Color:ScoreboardController.GetState().TeamA.Color,
                Shown:(ScoreboardController.GetState().ConfirmStatus == 1)
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Amount:ScoreboardController.GetState().TeamA.JamPoints
                    });
                }, 500);
            });
        } else {
            this.setState({
                Color:ScoreboardController.GetState().TeamB.Color,
                Shown:(ScoreboardController.GetState().ConfirmStatus == 1)
            }, () => {
                
                this.Timer = setTimeout(() => {
                    this.setState({
                        Amount:ScoreboardController.GetState().TeamB.JamPoints
                    });
                }, 500);
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        let jamNames:string = cnames('jampoints', {shown:this.state.Shown});
        let points:string = '00';
        if(this.state.Amount != 0)
            points = this.state.Amount.toString().padStart(2,'0');
        return (
            <div className={jamNames} style={{backgroundColor:this.state.Color}}>{points}</div>
        )
    }
}

/**
 * Component to display league logo
 */
class LeagueLogo extends React.PureComponent<any, {
    Shown:boolean;
    Logo:string;
}> {
    readonly state = {
        Shown:true,
        Logo:DataController.GetMiscRecord('LeagueLogo')
    }

    protected remoteData?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        let src = DataController.GetMiscRecord('LeagueLogo');
        let sstate = ScoreboardController.GetState();
        let shown = true;
        if(!src 
            || sstate.BreakState == vars.Clock.Status.Running
            || (sstate.BreakState == vars.Clock.Status.Stopped && sstate.BreakSecond <= 0)
            || sstate.BoardStatus != vars.Scoreboard.Status.Normal
            ) {
            shown = false;
        }
        this.setState({
            Shown:shown,
            Logo:src
        });
    }

    componentDidMount() {
        this.remoteData = DataController.Subscribe(this.updateData);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateData);
    }

    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        let src:string = '';
        let shown:boolean = false;
        if(this.state.Logo) {
            src = AddMediaPath(this.state.Logo);
            if(src)
                shown = this.state.Shown;
        }

        let className:string = cnames('league-logo', {
            shown:shown
        });

        return (
            <div className={className}>
                <img src={src} alt=""/>
            </div>
        )
    }
}