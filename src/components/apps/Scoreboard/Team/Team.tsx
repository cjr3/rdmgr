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
import { Unsubscribe } from 'redux'

export default function Team(props:{side:string}) {
    return (
        <div className={cnames('team', 'side-' + props.side.toLowerCase())}>
            <Score side={props.side}/>
            <TeamLogo side={props.side}/>
            <div className="values">
                <NameInput side={props.side}/>
                <ColorInput side={props.side}/>
                <JamPoints side={props.side}/>
                <Timeouts side={props.side}/>
                <Challenges side={props.side}/>
            </div>
            <Status side={props.side}/>
            <TeamControlButtons side={props.side}/>
        </div>
    );
}

class TeamLogo extends React.PureComponent<{
    side:string;
}, {
    src:string;
}> {
    readonly state = {
        src:''
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected async updateScoreboard() {
        let src = ScoreboardController.getState().TeamA.Thumbnail;
        if(this.props.side === 'B')
            src = ScoreboardController.getState().TeamB.Thumbnail;
        this.setState({src:src});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    render() {
        let src:string = '';
        if(this.state.src !== '')
            src = DataController.mpath(this.state.src);
        return (
            <img src={src} alt="" className="logo"/>
        );
    }
}

class TeamControlButtons extends React.PureComponent<{
    side:string;
}, {
    status:number;
}> {

    readonly state = {
        status:0
    }

    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected async updateScoreboard() {
        let status:number = ScoreboardController.getState().TeamA.Status;
        if(this.props.side === 'B')
            status = ScoreboardController.getState().TeamB.Status;
        this.setState({status:status});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    render() {
        let scoreTitle:string = `Score ( ${(this.props.side === 'A') ? 'LEFT' : 'RIGHT'} )`;
        let jamTitle:string = `Lead Jammer ( ${(this.props.side === 'A') ? 'Q' : 'W'} )`;
        let timeTitle:string = `Timeout ( ${(this.props.side === 'A') ? '[' : ']'} )`;
        let chalTitle:string = `Challenge ( CTRL + ${(this.props.side === 'A') ? '[' : ']'} )`;

        return (
            <div className="controls">
                <Icon
                    src={IconPlus}
                    onClick={() => {
                        ScoreboardController.IncreaseTeamScore(this.props.side, 1);
                    }}
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        ScoreboardController.DecreaseTeamScore(this.props.side, 1);
                    }}
                    title={scoreTitle}
                />
                <Icon
                    src={IconBolt}
                    active={(this.state.status === vars.Team.Status.LeadJammer || this.state.status === vars.Team.Status.PowerJam)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.LeadJammer)
                    }}
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.PowerJam)}
                    }
                    title={jamTitle}
                />
                <Icon
                    src={IconNo}
                    active={(this.state.status === vars.Team.Status.Timeout)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.Timeout)
                    }}
                    title={timeTitle}
                />
                <Icon
                    src={IconFlag}
                    active={(this.state.status === vars.Team.Status.Challenge)}
                    onClick={() => {
                        ScoreboardController.SetTeamStatus(this.props.side, vars.Team.Status.Challenge)
                    }}
                    title={chalTitle}
                />
            </div>
        )
    }
}