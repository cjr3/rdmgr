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
import ScoreboardController, {SScoreboardTeam} from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';

import './css/Team.scss'

interface PTeam {
    Team:SScoreboardTeam
}

/**
 * Component for displaying a team and its controls on the scoreboard control
 * @param props PTeam
 */
export default function Team(props:PTeam) {
    return (
        <div className={cnames('team', 'side-' + props.Team.Side.toLowerCase())}>
            <Score Team={props.Team}/>
            <img src={DataController.mpath(props.Team.Thumbnail)} alt="" className="logo"/>
            <div className="values">
                <NameInput Team={props.Team}/>
                <ColorInput Team={props.Team}/>
                <JamPoints Team={props.Team}/>
                <Timeouts Team={props.Team}/>
                <Challenges Team={props.Team}/>
            </div>
            <Status status={props.Team.Status}/>
            <div className="controls">
                <Icon
                    src={IconPlus}
                    onClick={() => {
                        ScoreboardController.IncreaseTeamScore(props.Team, 1);
                    }}
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        ScoreboardController.DecreaseTeamScore(props.Team, 1);
                    }}
                    title="Score"
                />
                <Icon
                    src={IconBolt}
                    active={(props.Team.Status === vars.Team.Status.LeadJammer || props.Team.Status === vars.Team.Status.PowerJam)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(props.Team, vars.Team.Status.LeadJammer)
                    }}
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        ScoreboardController.SetTeamStatus(props.Team, vars.Team.Status.PowerJam)}
                    }
                    title="Lead jammer"
                />
                <Icon
                    src={IconNo}
                    active={(props.Team.Status === vars.Team.Status.Timeout)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(props.Team, vars.Team.Status.Timeout)
                    }}
                    title="Timeout"
                />
                <Icon
                    src={IconFlag}
                    active={(props.Team.Status === vars.Team.Status.Challenge)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(props.Team, vars.Team.Status.Challenge)
                    }}
                    title="Challenge"
                />
            </div>
        </div>
    );
}