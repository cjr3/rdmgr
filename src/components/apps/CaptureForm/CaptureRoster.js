import React from 'react';
import cnames from 'classnames';
import RosterController from 'controllers/RosterController';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';

import './css/CaptureRoster.scss';

class CaptureRoster extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Roster:Object.assign({}, RosterController.getState()),
            TeamA:Object.assign({}, ScoreboardController.getState().TeamA),
            TeamB:Object.assign({}, ScoreboardController.getState().TeamB)
        };

        this.updateRoster = this.updateRoster.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);

        this.remoteRoster = RosterController.subscribe(this.updateRoster);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Updates the state to match the roster controller.
     */
    updateRoster() {
        var cstate = RosterController.getState();
        if(!DataController.compare(cstate, this.state.Roster)) {
            this.setState(() => {
                return {Roster:Object.assign({}, cstate)};
            });
        }
    }

    /**
     * Updates the state to match the scoreboard controller.
     * - Update TeamA
     * - Update TeamB
     */
    updateScoreboard() {
        var cstate = ScoreboardController.getState();
        if(!DataController.compare(cstate.TeamA, this.state.TemA)) {
            this.setState(() => {
                return {TeamA:Object.assign({}, cstate.TeamA)};
            });
        }

        if(!DataController.compare(cstate.TeamB, this.state.TemB)) {
            this.setState(() => {
                return {TeamB:Object.assign({}, cstate.TeamB)};
            });
        }
    }

    render() {
        var teamColor = this.state.TeamA.Color;
        var teamLogo = this.state.TeamA.Thumbnail;
        var teamName = this.state.TeamA.Name;
        var teamSkaters = this.state.Roster.TeamA.Skaters;
        
        if(this.state.Roster.CurrentTeam === 'B') {
            teamLogo = this.state.TeamB.Thumbnail;
            teamColor = this.state.TeamB.Color;
            teamName = this.state.TeamB.Name;
            teamSkaters = this.state.Roster.TeamB.Skaters;
        }

        teamLogo = DataController.mpath(teamLogo);

        let start = Math.max(0, this.state.Roster.SkaterIndex - 3);
        let end = Math.min(start + 4, start + 8);

        start = 0;
        end = teamSkaters.length;
        var skaters = [];
        
        if(teamSkaters && teamSkaters.length >= 1) {
            for(let i=start; i < end; i++) {
                let skater = teamSkaters[i];
                if(skater === null || skater === undefined)
                    break;
                var src = DataController.mpath(skater.Thumbnail);
                if(!src) {
                    src = teamLogo;
                }

                if(i === this.state.Roster.SkaterIndex) {
                    teamName = skater.Name;
                    if(skater.Number) {
                        teamName = `#${skater.Number} ${skater.Name}`;
                    }
                }
                skaters.push(
                    <div
                        key={`${skater.RecordType}-${skater.RecordID}`}
                        className={cnames('skater', {
                            current:(i === this.state.Roster.SkaterIndex)
                        })}
                        >
                        <img src={src} alt="" style={{borderColor:teamColor}}/>
                        <div className="num"
                            style={{
                                backgroundImage:`linear-gradient(rgba(0,0,0,0), ${teamColor})`
                            }}
                            >{skater.Number}</div>
                    </div>
                )
            }
        }

        return (
            <div className={cnames('capture-roster', {
                shown:this.props.shown
            })}
            >
                <div className="roster-thumbs">
                    <div className="team-logo">
                        <img src={teamLogo} alt=""/>
                    </div>
                    <div className="skaters">
                        {skaters}
                    </div>
                </div>
                <div className="team-name"
                    style={{
                        backgroundColor:teamColor
                    }}>
                    {teamName}
                </div>
            </div>
        )
    }
}

export default CaptureRoster;