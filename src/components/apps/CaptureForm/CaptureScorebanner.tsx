import React, { CSSProperties } from 'react';
import ScoreboardController, {SScoreboardState, Sides} from 'controllers/ScoreboardController';
import cnames from 'classnames';
import vars from 'tools/vars';
import './css/CaptureScorebanner.scss';
import { ScorebannerCaptureController } from 'controllers/capture/Scoreboard';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';

/**
 * Banner to display on the capture window.
 */
export default class CaptureScorebanner extends React.Component<any, {
    State:SScoreboardState;
    BackgroundImage?:string;
    Shown:boolean;
    ClocksShown:boolean;
    className:string;
}> {

    readonly state = {
        State:ScoreboardController.GetState(),
        BackgroundImage:ScorebannerCaptureController.GetState().BackgroundImage,
        Shown:ScorebannerCaptureController.GetState().Shown,
        ClocksShown:ScorebannerCaptureController.GetState().ClocksShown,
        className:ScorebannerCaptureController.GetState().className,
    }

    /**
     * Listener for scoreboard controller
     */
    protected remoteState?:Unsubscribe;

    /**
     * Listener for capture controller
     */
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
     * Updates the state to match the scoreboard controller.
     */
    protected updateState() {
        this.setState({State:ScoreboardController.GetState()});
    }

    /**
     * Updates the state to match the capture controller.
     */
    protected updateCapture() {
        this.setState({
            BackgroundImage:ScorebannerCaptureController.GetState().BackgroundImage,
            Shown:ScorebannerCaptureController.GetState().Shown,
            ClocksShown:ScorebannerCaptureController.GetState().ClocksShown,
            className:ScorebannerCaptureController.GetState().className,
        });
    }

    /**
     * Gets a string representation of the game clock.
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
        this.remoteCapture = ScorebannerCaptureController.Subscribe(this.updateCapture);
        this.remoteState = ScoreboardController.Subscribe(this.updateState);
    }

    /**
     * Close listers
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
        if(this.remoteState)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let classNames:string = cnames({
            "capture-SB-banner":true,
            shown:this.state.Shown,
            longjam:(this.state.State.MaxJamSeconds > 60 || this.state.State.JamSecond > 60),
            noclocks:(this.state.ClocksShown === false),
            jamming:(this.state.State.JamState === vars.Clock.Status.Running)
        }, this.state.className);

        let gameNames:string = cnames({
            gameclock:true,
            running:(this.state.State.GameState === vars.Clock.Status.Running),
            stopped:(this.state.State.GameState === vars.Clock.Status.Stopped)
        });

        let jamNames:string = cnames({
            jamclock:true,
            running:(this.state.State.JamState === vars.Clock.Status.Running),
            warning:(this.state.State.JamSecond <= 10),
            danger:(this.state.State.JamSecond <= 5),
            stopped:(this.state.State.JamState === vars.Clock.Status.Stopped)
        });

        let jamSecond:number = (this.state.State.JamSecond) ? this.state.State.JamSecond : 0;
        let jamTime = jamSecond.toString().padStart(2,'0');
        let style:CSSProperties = {};
        if(this.state.BackgroundImage !== undefined && this.state.BackgroundImage.length >= 1) {
            style.backgroundImage = `url('${AddMediaPath(this.state.BackgroundImage)}')`;
        }

        
        if(this.state.State.MaxJamSeconds > 60 || jamSecond > 60) {
            let jamMinute:number = 0;
            while(jamSecond >= 60) {
                jamMinute++;
                jamSecond -= 60;
            }
            jamTime = jamMinute.toString().padStart(2,'0') + ":" + jamSecond.toString().padStart(2,'0');
        }

        return (
            <div className={classNames}>
                <div className="coverblock" style={style}></div>
                <div className={jamNames}>{jamTime}</div>
                <div className="phase">{this.state.State.PhaseName}</div>
                <div className="jam-counter">{this.state.State.JamCounter.toString().padStart(2,'0')}</div>
                <div className={gameNames}>{this.getClockText()}</div>
                <BoardStatus/>
                <TeamElement side='A'/>
                <TeamElement side='B'/>
            </div>
        );
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
}, {
    Thumbnail:string;
    ScoreboardThumbnail:string;
}> {

    readonly state = {
        Thumbnail:'',
        ScoreboardThumbnail:''
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Thumbnail = ScoreboardController.GetState().TeamA.Thumbnail;
            this.state.ScoreboardThumbnail = ScoreboardController.GetState().TeamA.ScoreboardThumbnail;
        } else {
            this.state.Thumbnail = ScoreboardController.GetState().TeamB.Thumbnail;
            this.state.ScoreboardThumbnail = ScoreboardController.GetState().TeamB.ScoreboardThumbnail;
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({
                Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail,
                ScoreboardThumbnail:ScoreboardController.GetState().TeamA.ScoreboardThumbnail
            });
        } else {
            this.setState({
                Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail,
                ScoreboardThumbnail:ScoreboardController.GetState().TeamB.ScoreboardThumbnail
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
        
        let style:CSSProperties = {};
        let sstyle:CSSProperties = {};
        if(this.state.ScoreboardThumbnail) {
            style.backgroundImage = "url('" + AddMediaPath(this.state.ScoreboardThumbnail) + "')";
        } else if(this.state.Thumbnail) {
            style.backgroundImage = "url('" + AddMediaPath(this.state.Thumbnail) + "')";
            style.backgroundSize = "auto 100%";
            style.backgroundPosition = "top left";
        }
        return (
            <div className={`team team-${this.props.side}`}>
                <div className="team-top" style={style}>
                    <TeamScore side={this.props.side}/>
                    <TeamTimeouts side={this.props.side}/>
                </div>
                <TeamStatus side={this.props.side}/>
                <TeamJamPoints side={this.props.side}/>
            </div>
        )
    }
}

class TeamScore extends React.PureComponent<{
    side:Sides;
}, {
    Score:number;
    ScoreboardThumbnail:string;
    Color:string;
}> {
    readonly state = {
        Score:0,
        ScoreboardThumbnail:'',
        Color:''
    }

    private Timer:any = 0;

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side === 'A') {
            this.state.Score = ScoreboardController.GetState().TeamA.Score;
            this.state.ScoreboardThumbnail = ScoreboardController.GetState().TeamA.ScoreboardThumbnail;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
        }
        else {
            this.state.Score = ScoreboardController.GetState().TeamB.Score;
            this.state.ScoreboardThumbnail = ScoreboardController.GetState().TeamB.ScoreboardThumbnail;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected updateScoreboard() {
        try {clearTimeout(this.Timer);}catch(er){}
        let state = ScoreboardController.GetState();
        if(this.props.side == 'A') {
            this.setState({
                ScoreboardThumbnail:state.TeamA.ScoreboardThumbnail,
                Color:state.TeamA.Color
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Score:state.TeamA.Score
                    });
                }, 500);
            });
        } else {
            this.setState({
                ScoreboardThumbnail:state.TeamB.ScoreboardThumbnail,
                Color:state.TeamB.Color
            }, () => {
                this.Timer = setTimeout(() => {
                    this.setState({
                        Score:state.TeamB.Score
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
        let sstyle:CSSProperties = {};
        if(!this.state.ScoreboardThumbnail) {
            sstyle.backgroundColor = this.state.Color;
            sstyle.padding = "0px 8px 4px 16px";
        }

        return (
            <div className="score" style={sstyle}>{this.state.Score}</div>
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
            timeouts.push(<div key={"timeout-" + i}></div>);
        }
        return (
            <div className="timeouts">{timeouts}</div>
        )
    }
}

class TeamJamPoints extends React.PureComponent<{
    side:Sides;
}, {
    Amount:number;
    Shown:boolean;
    Color:string;
}> {
    readonly state = {
        Amount:0,
        Shown:(ScoreboardController.GetState().ConfirmStatus == 1),
        Color:'#000'
    }

    protected remoteScoreboard?:Unsubscribe;

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
        if(this.props.side === 'A') {
            this.setState({
                Amount:ScoreboardController.GetState().TeamA.JamPoints,
                Color:ScoreboardController.GetState().TeamA.Color,
                Shown:(ScoreboardController.GetState().ConfirmStatus == 1)
            });
        } else {
            this.setState({
                Amount:ScoreboardController.GetState().TeamB.JamPoints,
                Color:ScoreboardController.GetState().TeamB.Color,
                Shown:(ScoreboardController.GetState().ConfirmStatus == 1)
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
        let className:string = cnames('jampoints', {shown:(this.state.Shown)});
        let style:CSSProperties = {backgroundColor:this.state.Color};
        return (
            <div className={className} style={style}>
                {this.state.Amount}
            </div>
        )
    }
}

class TeamStatus extends React.PureComponent<{
    side:'A'|'B';
}, {
    Status:number;
}>  {
    readonly state = {
        Status:vars.Team.Status.Normal
    }

    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side === 'A')
            this.state.Status = ScoreboardController.GetState().TeamA.Status;
        else
            this.state.Status = ScoreboardController.GetState().TeamB.Status;
    }

    protected updateScoreboard() {
        if(this.props.side === 'A') {
            this.setState({Status:ScoreboardController.GetState().TeamA.Status});
        } else {
            this.setState({Status:ScoreboardController.GetState().TeamB.Status});
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