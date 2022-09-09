import React from 'react';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import {Score} from './score';
import { Name } from './name';
import { TeamJamPointsControl } from './jampoints';
import { TeamChallengesControl } from './challenges';
import { TeamTimeoutsControl } from './timeouts';
// import { TeamButtons } from './buttons';
import { TeamStatus } from './status';
import { ScoreboardTeamStatus, TeamSide } from 'tools/vars';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {
    side:TeamSide;
}

interface State {
    challenges:number;
    color:string;
    jampoints:number;
    logo:string;
    name:string;
    score:number;
    status:number;
    timeouts:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        challenges:0,
        color:'#000',
        jampoints:0,
        logo:'',
        name:'', 
        score:999,
        status:0,
        timeouts:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scoreboard.GetState();
        this.setState({
            challenges:((this.props.side === 'A') ? state.TeamA?.Challenges : state.TeamB?.Challenges) || 0,
            color:((this.props.side === 'A') ? state.TeamA?.Color : state.TeamB?.Color) || '#000000',
            jampoints:((this.props.side === 'A') ? state.TeamA?.JamPoints : state.TeamB?.JamPoints) || 0,
            logo:((this.props.side === 'A') ? state.TeamA?.Logo : state.TeamB?.Logo) || '',
            name:((this.props.side === 'A') ? state.TeamA?.Name : state.TeamB?.Name) || `Team ${this.props.side}`,
            score:((this.props.side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0,
            status:((this.props.side === 'A') ? state.TeamA?.Status : state.TeamB?.Status) || ScoreboardTeamStatus.NORMAL,
            timeouts:((this.props.side === 'A') ? state.TeamA?.Timeouts : state.TeamB?.Timeouts) || 0
        });
    }

    componentDidMount() {
        this.update();
        this.remote = Scoreboard.Subscribe(this.update);
    }
    
    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const {side, ...rprops} = {...this.props};
        return <>
            <div {...rprops} className={cnames('team', rprops.className, {
                'team-a':(side === 'A'),
                'team-b':(side === 'B')
            })}>
                <div className='score-logo'>
                    <div className='logo'>
                        {
                            (this.state.logo && this.state.logo.length > 0) &&
                            <img src={Data.GetMediaPath(this.state.logo)} alt='' title={this.state.name}/>
                        }
                    </div>
                    <Score side={this.props.side} score={this.state.score} color={this.state.color}/>
                </div>
                <Name side={this.props.side} value={this.state.name}/>
                <div className='controls'>
                    <TeamJamPointsControl side={this.props.side} amount={this.state.jampoints}/>
                    <TeamTimeoutsControl side={this.props.side} amount={this.state.timeouts}/>
                    <TeamChallengesControl side={this.props.side} amount={this.state.challenges}/>
                </div>
                <TeamStatus side={this.props.side} status={this.state.status}/>
            </div>
        </>
        ;
    }
}

export {Main as Team};