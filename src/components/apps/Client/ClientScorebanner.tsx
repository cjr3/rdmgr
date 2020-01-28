import React from 'react';
import ScoreboardController, {SScoreboardState} from 'controllers/ScoreboardController';
import vars from 'tools/vars';
import cnames from 'classnames';

/**
 * Component for a banner on the top of the client panel
 * to display the current scoreboard summary.
 */
export default class ClientScorebanner extends React.PureComponent<any, SScoreboardState> {

    readonly state:SScoreboardState = ScoreboardController.GetState()

    /**
     * ScoreboardController listener
     */
    protected remoteState:Function|null = null;

    /**
     * 
     * @param props Object
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the scoreboard controller.
     */
    updateState() {
        this.setState(ScoreboardController.GetState());
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = ScoreboardController.Subscribe(this.updateState);
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
        let gameClock = this.state.GameMinute.toString().padStart(2,'0') + ":" +
            this.state.GameSecond.toString().padStart(2,'0');
        if(this.state.GameHour > 0)
            gameClock = this.state.GameHour.toString().padStart(2,'0') + ":" + gameClock;
        const jamClock = this.state.JamSecond.toString().padStart(2,'0');
        const jamCounter = "#" + this.state.JamCounter.toString().padStart(2,'0');
        const boardStatus = vars.Scoreboard.StatusText[this.state.BoardStatus];

        const teamAClassName = cnames('name', {
            lead:(this.state.TeamA.Status === vars.Team.Status.LeadJammer),
            power:(this.state.TeamA.Status === vars.Team.Status.PowerJam),
            challenge:(this.state.TeamA.Status === vars.Team.Status.Challenge),
            timeout:(this.state.TeamA.Status === vars.Team.Status.Timeout),
            injury:(this.state.TeamA.Status === vars.Team.Status.Injury)
        });
        const teamAStyle = {backgroundColor:this.state.TeamA.Color};

        const teamBClassName = cnames('name', {
            lead:(this.state.TeamB.Status === vars.Team.Status.LeadJammer),
            power:(this.state.TeamB.Status === vars.Team.Status.PowerJam),
            challenge:(this.state.TeamB.Status === vars.Team.Status.Challenge),
            timeout:(this.state.TeamB.Status === vars.Team.Status.Timeout),
            injury:(this.state.TeamB.Status === vars.Team.Status.Injury)
        });
        const teamBStyle = {backgroundColor:this.state.TeamB.Color};

        return (
            <div className="scorebanner">
                <div className={teamAClassName}>{this.state.TeamA.Name}</div>
                <div style={teamAStyle} className="score">{this.state.TeamA.Score}</div>
                <div className={teamBClassName}>{this.state.TeamB.Name}</div>
                <div style={teamBStyle} className="score">{this.state.TeamB.Score}</div>
                <div className="phase-name">{this.state.PhaseName}</div>
                <div className="game-clock">{gameClock}</div>
                <div className="jam-clock">{jamClock}</div>
                <div className="jam-counter">{jamCounter}</div>
                <div className="board-status">{boardStatus}</div>
            </div>
        )
    }
}