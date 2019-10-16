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

/**
 * Component for displaying the full-size scoreboard on the capture window.
 */
export default class CaptureScoreboard extends React.Component<{
    /**
     * true to show, false ot hide
     */
    shown:boolean;
    /**
     * Additional class names
     */
    className?:string;
}, SScoreboardState> {

    readonly state:SScoreboardState = ScoreboardController.getState();
    /**
     * ScoreboardController remote
     */
    protected remoteState:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.getClockText = this.getClockText.bind(this);
        this.updateState = this.updateState.bind(this);
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
        let hour:number = (this.state.GameHour) ? this.state.GameHour : 0;
        let min:number = (this.state.GameMinute) ? this.state.GameMinute : 0;
        let sec:number = (this.state.GameSecond) ? this.state.GameSecond : 0;
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
        this.remoteState = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState !== null)
            this.remoteState();
    }

    /**
     * Renders the component.
     */
    render() {
        let classNames:string = cnames({
            "capture-SB":true,
            shown:this.props.shown,
            jamming:(this.state.JamState === vars.Clock.Status.Running),
        }, this.props.className);

        let statusNames:string = cnames({
            "board-status":true,
            shown:(this.state.BoardStatus > 0),
            timeout:(this.state.BoardStatus === vars.Scoreboard.Status.Timeout),
            injury:(this.state.BoardStatus === vars.Scoreboard.Status.Injury),
            upheld:(this.state.BoardStatus === vars.Scoreboard.Status.Upheld),
            overturned:(this.state.BoardStatus === vars.Scoreboard.Status.Overturned),
            review:(this.state.BoardStatus === vars.Scoreboard.Status.Review)
        });

        let breakNames:string = cnames({
            breakclock:true,
            shown:(this.state.BreakState === vars.Clock.Status.Running || this.state.BreakState === vars.Clock.Status.Stopped)
        });

        let gameNames:string = cnames({
            gameclock:true,
            running:(this.state.GameState === vars.Clock.Status.Running),
            stopped:(this.state.GameState === vars.Clock.Status.Stopped),
            hours:(this.state.GameHour > 0)
        });

        let jamNames:string = cnames({
            jamclock:true,
            running:(this.state.JamState === vars.Clock.Status.Running),
            warning:(this.state.JamSecond <= 10),
            danger:(this.state.JamSecond <= 5),
            stopped:(this.state.JamState === vars.Clock.Status.Stopped)
        });

        let jamSecond:number = (this.state.JamSecond) ? this.state.JamSecond : 0;
        let jamCounter:number = (this.state.JamCounter) ? this.state.JamCounter : 0;
        let breakSecond:number = (this.state.BreakSecond) ? this.state.BreakSecond : 0;

        let jamStateNames:string = cnames({
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
    let timeouts:Array<React.ReactElement> = [];
    let challenges:Array<React.ReactElement> = [];

    const {
        Score = 0, 
        Status = vars.Team.Status.Normal,
        Color = "#191919",
        Timeouts = ScoreboardController.getState().MaxTimeouts,
        Challenges = ScoreboardController.getState().MaxChallenges,
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