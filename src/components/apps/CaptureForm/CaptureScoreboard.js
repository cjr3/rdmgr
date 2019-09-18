import React from 'react'
import vars from 'tools/vars'
import cnames from 'classnames'
import './css/CaptureScoreboard.scss'
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'

class CaptureScoreboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, ScoreboardController.getState());
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, ScoreboardController.getState());
        });
    }

    /**
     * Gets the game clock formatted as a string.
     * @return String
     */
    getClockText() {
        var min = (this.state.GameMinute) ? this.state.GameMinute : 0;
        var sec = (this.state.GameSecond) ? this.state.GameSecond : 0;
        return min.toString().padStart(2,'0') + ":" + sec.toString().padStart(2,'0');
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames({
            "capture-SB":true,
            shown:this.props.shown,
            jamming:(this.state.JamState === vars.Clock.Status.Running),
        }, this.props.className);

        var statusNames = cnames({
            "board-status":true,
            shown:(this.state.BoardStatus > 0),
            timeout:(this.state.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.BoardStatus === vars.Scoreboard.Status.Review)
        });

        var breakNames = cnames({
            breakclock:true,
            shown:(this.state.BreakState === vars.Clock.Status.Running || this.state.BreakState === vars.Clock.Status.Stopped)
        });

        var gameNames = cnames({
            gameclock:true,
            running:(this.state.GameState === vars.Clock.Status.Running),
            stopped:(this.state.GameState === vars.Clock.Status.Stopped)
        });

        var jamNames = cnames({
            jamclock:true,
            running:(this.state.JamState === vars.Clock.Status.Running),
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5),
            stopped:(this.state.JamState === vars.Clock.Status.Stopped)
        });

        var jamSecond = (this.state.JamSecond) ? this.state.JamSecond : 0;
        var jamCounter = (this.state.JamCounter) ? this.state.JamCounter : 0;
        var breakSecond = (this.state.BreakSecond) ? this.state.BreakSecond : 0;

        var jamStateNames = cnames({
            jamstate:true,
            shown:(this.state.JamState === vars.Clock.Status.Ready),
            warning:(this.state.BreakSecond <= 0 && this.state.JamState === vars.Clock.Status.Ready)
        });


        return (
            <div className={classNames}>
                <div className={jamNames}>{jamSecond.toString().padStart(2,'0')}</div>
                <div className="phase">{this.state.PhaseName}</div>
                <div className="jam-counter">{"JAM " + jamCounter.toString().padStart(2,'0')}</div>
                <div className={gameNames}>{this.getClockText()}</div>
                <div className={statusNames}>{vars.Scoreboard.StatusText[this.state.BoardStatus]}</div>
                <div className={breakNames}>{breakSecond.toString().padStart(2,'0')}</div>
                <div className={jamStateNames}></div>
                <CaptureScoreboardTeam 
                    Team={this.state.TeamA} 
                    ConfirmStatus={this.state.ConfirmStatus}
                    className="team-a"
                    />
                <CaptureScoreboardTeam 
                    Team={this.state.TeamB}
                    ConfirmStatus={this.state.ConfirmStatus}
                    className="team-b"
                    />
            </div>
        );
    }
}

/**
 * Component to represent a team on the main scoreboard.
 * @param {Object} props 
 */
function CaptureScoreboardTeam(props) {
    var timeouts = [];
    var challenges = [];

    const {
        Score = 0, 
        Status = vars.Team.Status.Normal,
        Color = "#191919",
        Timeouts = 3,
        Challenges = 3,
        Thumbnail = null,
        JamPoints = 0
    } = props.Team;

    for(let i=0; i < Timeouts; i++) {
        timeouts.push(
            <img src={require('images/icons/no.png')} key={"timeout-" + i} alt=""/>
        );
    }

    for(let i=0; i < Challenges; i++) {
        challenges.push(
            <img src={require('images/icons/flag.png')} key={"challenge-" + i} alt=""/>
        );
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
        shown:(props.ConfirmStatus === 1)
    });

    return (
        <div className={cnames('team', props.className)}>
            <div className="logo">
                <img src={DataController.mpath(Thumbnail)} alt=""/>
            </div>
            <div className="score" style={{backgroundColor:Color}}>{Score}</div>
            <div className={statusNames}>
                {vars.Team.StatusText[Status]}
            </div>
            <div className="timeouts">{timeouts}</div>
            <div className="challenges">{challenges}</div>
            <div className={jamNames} style={{backgroundColor:Color}}
            >{JamPoints.toString().padStart(2,'0')}</div>
        </div>
    );
}

/**
 * Banner to display on the capture window.
 */
class CaptureScoreboardBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, ScoreboardController.getState());
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, ScoreboardController.getState());
        });
    }

    /**
     * Gets a string representation of the game clock.
     */
    getClockText() {
        var str = this.state.GameMinute.toString().padStart(2,'0') + ":" +
            this.state.GameSecond.toString().padStart(2,'0');

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
            jamming:(this.state.JamState === vars.Clock.Status.Running)
        }, this.props.className);

        var statusNames = cnames({
            "board-status":true,
            shown:(this.state.BoardStatus > 0),
            timeout:(this.state.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.BoardStatus === vars.Scoreboard.Status.Review)
        });

        var gameNames = cnames({
            gameclock:true,
            running:(this.state.GameState === vars.Clock.Status.Running),
            stopped:(this.state.GameState === vars.Clock.Status.Stopped)
        });

        var jamNames = cnames({
            jamclock:true,
            running:(this.state.JamState === vars.Clock.Status.Running),
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5),
            stopped:(this.state.JamState === vars.Clock.Status.Stopped)
        });

        return (
            <div className={classNames}>
                <div className={jamNames}>{this.state.JamSecond.toString().padStart(2,'0')}</div>
                <div className="phase">{this.state.PhaseName}</div>
                <div className="jam-counter">{this.state.JamCounter.toString().padStart(2,'0')}</div>
                <div className={gameNames}>{this.getClockText()}</div>
                <div className={statusNames}>{vars.Scoreboard.StatusText[this.state.BoardStatus]}</div>
                <CaptureScoreboardBannerTeam 
                    Team={this.state.TeamA} 
                    ConfirmStatus={this.state.ConfirmStatus}
                    className="team-a"
                    />
                <CaptureScoreboardBannerTeam 
                    Team={this.state.TeamB}
                    ConfirmStatus={this.state.ConfirmStatus}
                    className="team-b"
                    />
            </div>
        );
    }
}

function CaptureScoreboardBannerTeam(props) {
    var timeouts = [];

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

    var style = {};
    var sstyle = {};
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

class CaptureJamCounter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            JamCounter:ScoreboardController.getState().JamCounter
        };
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            return {JamCounter:ScoreboardController.getState().JamCounter};
        });
    }

    render() {
        var className = cnames('capture-jam-counter', {shown:this.props.shown});
        return (
            <div className={className}>
                {this.state.JamCounter.toString().padStart(2,'0')}
            </div>
        )
    }
}


class CaptureJamClock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            JamSecond:ScoreboardController.getState().JamSecond
        };
        this.updateState = this.updateState.bind(this);
        this.remote = ScoreboardController.subscribe(this.updateState);
    }

    updateState() {
        this.setState(() => {
            return {JamSecond:ScoreboardController.getState().JamSecond};
        });
    }

    render() {
        var className = cnames('capture-jam-clock', {
            shown:this.props.shown,
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5)
        });
        return (
            <div className={className}>
                {this.state.JamSecond.toString().padStart(2,'0')}
            </div>
        )
    }
}

export default CaptureScoreboard;
export {
    CaptureScoreboardBanner,
    CaptureJamCounter,
    CaptureJamClock
};