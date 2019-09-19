import React from 'react'
import vars from 'tools/vars'
import cnames from 'classnames'
import './css/CaptureScoreboard.scss'
import ScoreboardController, {SScoreboardState} from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController';

import {
    IconNo,
    IconFlag
} from 'components/Elements';

interface PCaptureScoreboard {
    shown?:boolean,
    className?:string
}

/**
 * Component for displaying the full-size scoreboard on the capture window.
 */
class CaptureScoreboard extends React.Component<PCaptureScoreboard, SScoreboardState> {

    readonly state:SScoreboardState = ScoreboardController.getState();
    remoteState:Function

    constructor(props:PCaptureScoreboard) {
        super(props);
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteState = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(ScoreboardController.getState());
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
    var timeouts:Array<React.ReactElement> = [];
    var challenges:Array<React.ReactElement> = [];

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
            <img src={IconNo} key={"timeout-" + i} alt=""/>
        );
    }

    for(let i=0; i < Challenges; i++) {
        challenges.push(
            <img src={IconFlag} key={"challenge-" + i} alt=""/>
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

export default CaptureScoreboard;