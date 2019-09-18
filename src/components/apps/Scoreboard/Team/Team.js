import React from 'react'
import cnames from 'classnames'
import Score from './Score'
import JamPoints from './JamPoints'
import Timeouts from './Timeouts'
import Challenges from './Challenges'
import {Icon, IconPlus, IconBolt, IconNo, IconFlag} from 'components/Elements'
import NameInput from './NameInput'
import ColorInput from './ColorInput'
import Status from './Status'
import vars from 'tools/vars'
import ScoreboardController from 'controllers/ScoreboardController'
import DataController from 'controllers/DataController'

import './css/Team.scss'

/**
 * Scoreboard Team component.
 */
class Team extends React.PureComponent {
    /**
     * Constructor
     * @param {Object} props 
     */
    constructor(props) {
        super(props);

        this.state = {
            id:(this.props.Team) ? this.props.Team.ID : 0,
            name:(this.props.Team) ? this.props.Team.Name : "Team",
            score:(this.props.Team) ? this.props.Team.Score : 0,
            timeouts:(this.props.Team) ? this.props.Team.Timeouts : 0,
            challenges:(this.props.Team) ? this.props.Team.Challenges : 0,
            status:(this.props.Team) ? this.props.Team.Status : vars.Team.Status.Normal,
            jamPoints:(this.props.Team) ? this.props.Team.JamPoints : 0,
            thumbnail:(this.props.Team) ? this.props.Team.Thumbnail : "",
            color:(this.props.Team) ? this.props.Team.Color : "#222222"
        };

        //bindings
        this._getThumbnail = this._getThumbnail.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            var team = ScoreboardController.getState().TeamA;
            if(this.props.side === 'b')
                team = ScoreboardController.getState().TeamB;
            return {
                id:team.ID,
                name:team.Name,
                score:team.Score,
                timeouts:team.Timeouts,
                challenges:team.Challenges,
                jamPoints:team.JamPoints,
                status:team.Status,
                color:team.Color,
                thumbnail:team.Thumbnail
            }
        });
    }

    _getThumbnail() {
        if(this.state.thumbnail)
            return DataController.mpath(this.state.thumbnail);
        return null;
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <div className={cnames('team', 'side-' + this.props.side)}>
                <Score Team={this.props.Team} color={this.state.color}/>
                <img src={this._getThumbnail()} alt="" className="logo"/>
                <div className="values">
                    <NameInput Team={this.props.Team}/>
                    <ColorInput Team={this.props.Team}/>
                    <JamPoints Team={this.props.Team}/>
                    <Timeouts Team={this.props.Team}/>
                    <Challenges Team={this.props.Team}/>
                </div>
                <Status status={this.state.status}/>
                <div className="controls">
                    <Icon
                        src={IconPlus}
                        onClick={() => {
                            ScoreboardController.IncreaseTeamScore(this.props.Team, 1);
                        }}
                        onContextMenu={(ev) => {
                            ev.preventDefault();
                            ScoreboardController.DecreaseTeamScore(this.props.Team, 1);
                        }}
                        title="Score"
                    />
                    <Icon
                        src={IconBolt}
                        active={(this.state.status === vars.Team.Status.LeadJammer || this.state.status === vars.Team.Status.PowerJam)}
                        onClick={() => {
                            ScoreboardController.SetTeamStatus(this.props.Team, vars.Team.Status.LeadJammer)
                        }}
                        onContextMenu={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            ScoreboardController.SetTeamStatus(this.props.Team, vars.Team.Status.PowerJam)}
                        }
                        title="Lead jammer"
                    />
                    <Icon
                        src={IconNo}
                        active={(this.state.status === vars.Team.Status.Timeout)}
                        onClick={() => {
                            ScoreboardController.SetTeamStatus(this.props.Team, vars.Team.Status.Timeout)
                        }}
                        title="Timeout"
                    />
                    <Icon
                        src={IconFlag}
                        active={(this.state.status === vars.Team.Status.Challenge)}
                        onClick={() => {
                            ScoreboardController.SetTeamStatus(this.props.Team, vars.Team.Status.Challenge)
                        }}
                        title="Challenge"
                    />
                </div>
            </div>
        )
    }
}

export default Team;