import classNames from 'classnames';
import React from 'react';
import { Unsubscribe } from 'redux';
import { PenaltyTracker } from 'tools/penaltytracker/functions';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { Skaters } from 'tools/skaters/functions';
import { TeamSide } from 'tools/vars';
import { SkaterItem } from './skater';

interface Props extends React.HTMLProps<HTMLDivElement> {
    /**
     * Current skater
     */
    skaterId:number;
    /**
     * Team side
     */
    side:TeamSide;
    /**
     * Called when the user selects a skater
     */
    onSelectSkater:{(id:number):void};
}

interface State {
    /**
     * Team color (from scoreboard)
     */
    color:string;
    /**
     * Team name (from scoreboard)
     */
    name:string;
    /**
     * Last timestamp when relevant records were updated.
     */
    updateTime:number;
}

/**
 * Display a team on the penalty tracker.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        color:'',
        name:'',
        updateTime:0
    }

    protected remote?:Unsubscribe;
    
    /**
     * 
     */
    protected update = () => {
        const state = Scoreboard.GetState();
        const color = ((this.props.side === 'A') ? state.TeamA?.Color : state.TeamB?.Color) || '';
        const name = ((this.props.side === 'A') ? state.TeamA?.Name : state.TeamB?.Name) || '';
        this.setState({
            color:color,
            name:name,
            updateTime:PenaltyTracker.GetUpdateTime()
        });
    }

    /**
     * Get roster for the team.
     * @returns 
     */
    protected getRoster = () => {
        return (((this.props.side === 'A') ? Roster.Get().SkatersA : Roster.Get().SkatersB) || [])
    }

    /**
     * Get penalized skaters.
     * @returns 
     */
    protected getPenalized = () => {
        return (PenaltyTracker.Get().Skaters).map(r => r.RecordID || 0);
    }

    componentDidMount() {
        this.remote = PenaltyTracker.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const {skaterId, side, onSelectSkater, ...rprops} = {...this.props};
        const records = this.getRoster().filter(s => s.Number);
        const penalized = this.getPenalized();
        return <div {...rprops} className={classNames('team', rprops.className)}>
            <div className='name' style={{backgroundColor:this.state.color}}>{this.state.name}</div>
            <div className='skaters'>
                {
                    records.map(record => {
                        const skater = Skaters.Get(record.RecordID);
                        return <SkaterItem
                            active={penalized.indexOf(record.RecordID || 0) >= 0 ? true : false}
                            name={skater?.Name || record.Name || ''}
                            number={skater?.Number || record.Number || ''}
                            selected={this.props.skaterId === record.RecordID}
                            skaterId={record.RecordID || 0}
                            thumbnail={skater?.Thumbnail || record.Thumbnail || ''}
                            onSelect={this.props.onSelectSkater}
                            key={`skater-${record.RecordID}`}
                        />
                    })
                }   
            </div>
        </div>
    }
};

export {Main as PenaltyTrackerTeam};