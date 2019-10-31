import React, { CSSProperties } from 'react';
import ScoreboardController, {SScoreboardState} from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';
import cnames from 'classnames';
import vars from 'tools/vars';
import CaptureController from 'controllers/CaptureController';
import './css/CaptureScorebanner.scss';

/**
 * Banner to display on the capture window.
 */
export default class CaptureScorebanner extends React.Component<any, {
    /**
     * State of the scoreboard
     */
    State:SScoreboardState;
    /**
     * Background image of the banner
     */
    BackgroundImage?:string;
}> {

    readonly state = {
        State:ScoreboardController.getState(),
        BackgroundImage:''
    }

    /**
     * Listener for scoreboard controller
     */
    protected remoteState:Function|null = null;

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

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
    updateState() {
        this.setState({State:ScoreboardController.getState()});
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState({
            BackgroundImage:CaptureController.getState().Scorebanner.BackgroundImage
        })
    }

    /**
     * Gets a string representation of the game clock.
     */
    getClockText() {
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
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteState = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Close listers
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let classNames:string = cnames({
            "capture-SB-banner":true,
            shown:this.props.shown,
            longjam:(this.state.State.MaxJamSeconds > 60 || this.state.State.JamSecond > 60),
            noclocks:(this.props.clocks === false),
            jamming:(this.state.State.JamState === vars.Clock.Status.Running)
        }, this.props.className);

        let statusNames:string = cnames({
            "board-status":true,
            shown:(this.state.State.BoardStatus > 0),
            timeout:(this.state.State.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.State.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.State.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.State.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.State.BoardStatus === vars.Scoreboard.Status.Review)
        });

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
            style.backgroundImage = `url('${DataController.mpath(this.state.BackgroundImage)}')`;
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
            <div className={classNames} style={style}>
                <div className={jamNames}>{jamTime}</div>
                <div className="phase">{this.state.State.PhaseName}</div>
                <div className="jam-counter">{this.state.State.JamCounter.toString().padStart(2,'0')}</div>
                <div className={gameNames}>{this.getClockText()}</div>
                <div className={statusNames}>{vars.Scoreboard.StatusText[this.state.State.BoardStatus]}</div>
                <CaptureScoreboardBannerTeam 
                    Team={this.state.State.TeamA} 
                    ConfirmStatus={this.state.State.ConfirmStatus}
                    className="team-a"
                    />
                <CaptureScoreboardBannerTeam 
                    Team={this.state.State.TeamB}
                    ConfirmStatus={this.state.State.ConfirmStatus}
                    className="team-b"
                    />
            </div>
        );
    }
}

/**
 * 
 * @param props 
 */
function CaptureScoreboardBannerTeam(props) {
    let timeouts:Array<React.ReactElement> = [];

    const {
        Score = 0, 
        Status = vars.Team.Status.Normal,
        Color = "#191919",
        Timeouts = 3,
        ScoreboardThumbnail = null,
        Thumbnail = null,
        JamPoints = 0
    } = props.Team;

    for(let i=0; i < Timeouts; i++) {
        timeouts.push(<div key={"timeout-" + i}></div>);
    }

    let statusNames:string = cnames({
        status:true,
        shown:(Status > 0),
        timeout:(Status === vars.Team.Status.Timeout),
        challenge:(Status === vars.Team.Status.Challenge),
        powerjam:(Status === vars.Team.Status.PowerJam),
        leadjammer:(Status === vars.Team.Status.LeadJammer)
    });

    let jamNames:string = cnames({
        jampoints:true,
        shown:(props.ConfirmStatus)
    });

    let style:CSSProperties = {};
    let sstyle:CSSProperties = {};
    if(ScoreboardThumbnail) {
        style.backgroundImage = "url('" + DataController.mpath(ScoreboardThumbnail) + "')";
    } else if(Thumbnail) {
        style.backgroundImage = "url('" + DataController.mpath(Thumbnail) + "')";
        style.backgroundSize = "auto 100%";
        style.backgroundPosition = "top left";
        sstyle.backgroundColor = Color;
        sstyle.padding = "0px 8px 4px 16px";
    }

    return (
        <div className={cnames('team', props.className)}>
            <div className="team-top" style={style}>
                <div className="score" style={sstyle}>{Score}</div>
                <div className="timeouts">{timeouts}</div>
            </div>
            <div className={statusNames}>
                {vars.Team.StatusText[Status]}
            </div>
            <div className={jamNames} style={{backgroundColor:Color}}>{JamPoints.toString().padStart(2,'0')}</div>
        </div>
    );
}