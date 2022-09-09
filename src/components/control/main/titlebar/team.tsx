import React from 'react';
import { Unsubscribe } from 'redux';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardTeamStatus } from 'tools/vars';

interface Props {
    side:'A'|'B'
}

interface State {
    color:string;
    name:string;
    score:number;
    status:number;
}

/**
 * Display teams data on the titlebar 
 */
class Team extends React.PureComponent<Props, State> {
    readonly state:State = {
        color:'#000',
        name:'',
        score:0,
        status:ScoreboardTeamStatus.NORMAL
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = Scoreboard.GetState();
        this.setState({
            color:((this.props.side === 'A') ? state.TeamA?.Color : state.TeamB?.Color) || '#000',
            name:((this.props.side === 'A') ? state.TeamA?.Name : state.TeamB?.Name) || '',
            score:((this.props.side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0,
            status:((this.props.side === 'A') ? state.TeamA?.Status : state.TeamB?.Status) || ScoreboardTeamStatus.NORMAL,
        })
    }

    componentDidMount() {
        this.remote = Scoreboard.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        return <span className='team'>
            <span className='name'
                title={Scoreboard.GetTeamStatusLabel(this.props.side)}
                style={{
                    backgroundColor:Scoreboard.GetTeamStatusColor(this.props.side)
                }}
            >{this.state.name}</span>
            <span className='score' style={{backgroundColor:this.state.color}}>{this.state.score}</span>
        </span>
    }
}

export {Team};