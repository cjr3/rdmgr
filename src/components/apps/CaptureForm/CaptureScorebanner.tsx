import React, { CSSProperties } from 'react';
import ScoreboardController, {SScoreboardState} from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';
import cnames from 'classnames';
import vars from 'tools/vars';
import CaptureController from 'controllers/CaptureController';

interface SCaptureScorebanner {
    State:SScoreboardState,
    BackgroundImage?:string
}

/**
 * Banner to display on the capture window.
 */
class CaptureScorebanner extends React.Component<any, SCaptureScorebanner> {

    readonly state:SCaptureScorebanner = {
        State:ScoreboardController.getState(),
        BackgroundImage:''
    }

    /**
     * Listener for scoreboard controller
     */
    protected remoteState:Function

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function

    constructor(props) {
        super(props);
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteState = ScoreboardController.subscribe(this.updateState);
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
        var str = this.state.State.GameMinute.toString().padStart(2,'0') + ":" +
            this.state.State.GameSecond.toString().padStart(2,'0');

        return str;
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames({
            "capture-SB-banner":true,
            shown:this.props.shown,
            noclocks:(this.props.clocks === false),
            jamming:(this.state.State.JamState === vars.Clock.Status.Running)
        }, this.props.className);

        var statusNames = cnames({
            "board-status":true,
            shown:(this.state.State.BoardStatus > 0),
            timeout:(this.state.State.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.State.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.State.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.State.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.State.BoardStatus === vars.Scoreboard.Status.Review)
        });

        var gameNames = cnames({
            gameclock:true,
            running:(this.state.State.GameState === vars.Clock.Status.Running),
            stopped:(this.state.State.GameState === vars.Clock.Status.Stopped)
        });

        var jamNames = cnames({
            jamclock:true,
            running:(this.state.State.JamState === vars.Clock.Status.Running),
            warning:(this.state.State.JamSecond <= 10),
            danger:(this.state.State.JamSecond <= 5),
            stopped:(this.state.State.JamState === vars.Clock.Status.Stopped)
        });

        const style:CSSProperties = {
            
        };
        if(this.state.BackgroundImage !== undefined && this.state.BackgroundImage.length >= 1) {
            style.backgroundImage = `url('${DataController.mpath(this.state.BackgroundImage)}')`;
        }

        return (
            <div className={classNames} style={style}>
                <div className={jamNames}>{this.state.State.JamSecond.toString().padStart(2,'0')}</div>
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

function CaptureScoreboardBannerTeam(props) {
    var timeouts:Array<React.ReactElement> = [];

    const {
        Score = 0, 
        Status = vars.Team.Status.Normal,
        Color = "#191919",
        Timeouts = 3,
        ScoreboardThumbnail = null,
        Thumbnail = null,
        JamPoints = 0
    } = props.Team;

    for(var i=0; i < Timeouts; i++) {
        timeouts.push(<div key={"timeout-" + i}></div>);
    }

    const statusNames = cnames({
        status:true,
        shown:(Status > 0),
        timeout:(Status === vars.Team.Status.Timeout),
        challenge:(Status === vars.Team.Status.Challenge),
        powerjam:(Status === vars.Team.Status.PowerJam),
        leadjammer:(Status === vars.Team.Status.LeadJammer)
    });

    const jamNames = cnames({
        jampoints:true,
        shown:(props.ConfirmStatus)
    });

    var style:any = {};
    var sstyle:any = {};
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

export default CaptureScorebanner;