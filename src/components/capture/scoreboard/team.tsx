import classNames from 'classnames';
import { IconFlag, IconNo } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import Data from 'tools/data';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardTeamStatus, TeamSide } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    side:TeamSide;
}

interface State {
    challenges:number;
    color:string;
    confirm:boolean;
    jamPoints:number;
    logo:string;
    name:string;
    score:number;
    status:number;
    statusColor:string;
    statusLabel:string;
    timeouts:number;
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        challenges:0,
        color:'',
        confirm:false,
        jamPoints:0,
        logo:'',
        name:'',
        score:0,
        status:0,
        statusColor:'',
        statusLabel:'',
        timeouts:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scoreboard.GetState();
        let statusColor = this.state.statusColor;
        let statusLabel = this.state.statusLabel;
        const status = ((this.props.side === 'A') ? state.TeamA?.Status : state.TeamB?.Status) || ScoreboardTeamStatus.NORMAL;
        if(status !== ScoreboardTeamStatus.NORMAL) {
            statusColor = Scoreboard.GetTeamStatusColor(this.props.side);
            statusLabel = Scoreboard.GetTeamStatusLabel(this.props.side);
        }
        this.setState({
            challenges:((this.props.side === 'A') ? state.TeamA?.Challenges : state.TeamB?.Challenges) || 0,
            color:((this.props.side === 'A') ? state.TeamA?.Color : state.TeamB?.Color) || '#000000',
            confirm:state?.ConfirmStatus || false,
            jamPoints:((this.props.side === 'A') ? state.TeamA?.JamPoints : state.TeamB?.JamPoints) || 0,
            logo:((this.props.side === 'A') ? state.TeamA?.Logo : state.TeamB?.Logo) || '',
            name:((this.props.side === 'A') ? state.TeamA?.Name : state.TeamB?.Name) || '',
            score:((this.props.side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0,
            status:status,
            statusColor:statusColor,
            statusLabel:statusLabel,
            timeouts:((this.props.side === 'A') ? state.TeamA?.Timeouts : state.TeamB?.Timeouts) || 0,
        })
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
        const {side, ...props} = {...this.props};
        const timeouts:number[] = [];
        const challenges:number[] = [];
        for(let i=0; i < this.state.timeouts; i++)
            timeouts.push(i);
        for(let i=0; i < this.state.challenges; i++)
            challenges.push(i);

        return <div {...props} className={classNames('team team-' + side, props.className)}>
            <div className='logo'>
                {
                    (this.state.logo && this.state.logo.length > 0) &&
                    <img src={Data.GetMediaPath(this.state.logo)} alt=''/>
                }
                <div 
                    className={classNames('status', {active:this.state.status !== ScoreboardTeamStatus.NORMAL})}
                    style={{backgroundColor:this.state.statusColor}}
                    >{this.state.statusLabel}</div>
            </div>
            <div className='score'>
                <div className='value' style={{backgroundColor:this.state.color}}>
                    {this.state.score}
                </div>
                <div className={classNames('jam-points', {active:this.state.confirm})} style={{backgroundColor:this.state.color}}>
                    <span className='value'>
                        {this.state.jamPoints.toString().padStart(2,'0')}
                    </span>
                </div>
            </div>
            <div className='timeouts-challenges'>
                <div className='timeouts'>
                    {
                        timeouts.map(t => {
                            return <IconNo key={`timeout-${t}`}/>
                        })
                    }
                </div>
                <div className='challenges'>
                    {
                        challenges.map(t => {
                            return <IconFlag key={`challenge-${t}`}/>
                        })
                    }
                </div>
            </div>
            <div className='team-name'>{this.state.name}</div>
        </div>
    }
}

export {Main as Team};