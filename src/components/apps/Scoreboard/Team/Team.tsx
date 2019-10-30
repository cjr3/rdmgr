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
    side:string;
}

export default class Team extends React.PureComponent<{
    side:string;
}, {
    status:number;
    thumbnail:string;
}>{

    readonly state = {
        status:0,
        thumbnail:''
    }

    protected remoteScoreboard:Function|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    updateScoreboard() {
        let state = ScoreboardController.getState();
        if(this.props.side === 'A') {
            if(this.state.status != state.TeamA.Status)
                this.setState({status:state.TeamA.Status});

            if(this.state.thumbnail != state.TeamA.Thumbnail)
                this.setState({thumbnail:state.TeamA.Thumbnail});
        } else {

            if(this.state.status != state.TeamB.Status)
                this.setState({status:state.TeamB.Status});

            if(this.state.thumbnail != state.TeamB.Thumbnail)
                this.setState({thumbnail:state.TeamB.Thumbnail});
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.updateScoreboard();
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null) {
            this.remoteScoreboard();
        }
    }

    render() {
        
        let scoreTitle:string = `Score ( ${(this.props.side === 'A') ? 'LEFT' : 'RIGHT'} )`;
        let jamTitle:string = `Lead Jammer ( ${(this.props.side === 'A') ? 'Q' : 'W'} )`;
        let timeTitle:string = `Timeout ( ${(this.props.side === 'A') ? '[' : ']'} )`;
        let chalTitle:string = `Challenge ( CTRL + ${(this.props.side === 'A') ? '[' : ']'} )`;

        let src:string = (this.state.thumbnail) ? DataController.mpath(this.state.thumbnail) : '';

        return (
            <div className={cnames('team', 'side-' + this.props.side.toLowerCase())}>
                <Score side={this.props.side}/>
                <img src={src} alt="" className="logo"/>
                <div className="values">
                    <NameInput side={this.props.side}/>
                    <ColorInput side={this.props.side}/>
                    <JamPoints side={this.props.side}/>
                    <Timeouts side={this.props.side}/>
                    <Challenges side={this.props.side}/>
                </div>
                <Status side={this.props.side}/>
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
            </div>
        );
    }
}
