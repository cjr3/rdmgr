import React from 'react';
import { Unsubscribe } from 'redux';
import { Capture } from 'tools/capture/functions';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { TeamSide } from 'tools/vars';
import { TeamRoles } from './roles';
import { RosterSkaterItem } from './skater';

interface Props extends React.HTMLProps<HTMLDivElement> {
    dragSide:string;
    side:TeamSide;
    onDragSkater:{(side:string):void};
}

interface State {
    color:string;
    dragIndex:number;
    dropIndex:number;
    name:string;
    rosterIndex:number;
    rosterSide:string;
    updateTime:number;
}

/**
 * Display skaters assigned to a team.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        color:'',
        dragIndex:-1,
        dropIndex:-1,
        name:'',
        rosterIndex:-1,
        rosterSide:'',
        updateTime:0
    }

    protected remote?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    protected update = () => {
        const sstate = Scoreboard.GetState();
        const rstate = Capture.GetRoster();
        this.setState({
            color:((this.props.side === 'A') ? sstate.TeamA?.Color : sstate.TeamB?.Color) || '',
            name:((this.props.side === 'A') ? sstate.TeamA?.Name : sstate.TeamB?.Name) || '',
            rosterIndex:typeof(rstate.index) === 'number' ? rstate.index : -1,
            rosterSide:rstate.side || '',
            updateTime:Roster.GetUpdateTime()
        });
    }

    /**
     * Called when the user stops dragging a skater.
     */
    protected onDragEnd = async () => {
        this.setState({dragIndex:-1});
    }

    /**
     * Called when the user's mouse leaves the drop zone of another skater
     */
    protected onDragLeave = async () => {
        this.setState({dropIndex:-1});
    }

    /**
     * Called when the current skater is dragged-over another.
     * @param ev 
     */
    protected onDragOver = async (ev:React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        if(ev.currentTarget.dataset.index !== undefined && ev.currentTarget.dataset.side === this.props.dragSide) {
            let value = parseInt(ev.currentTarget.dataset.index);
            this.setState({dropIndex:value});
        } else {
            this.setState({dropIndex:-1});
            this.props.onDragSkater('');
        }
    }

    /**
     * Called when the user starts dragging a skater.
     * @param ev 
     */
    protected onDragStart = async (ev:React.DragEvent<HTMLDivElement>) => {
        if(ev.currentTarget.dataset.index !== undefined && (ev.currentTarget.dataset.side === this.props.dragSide || this.props.dragSide === '')) {
            let value = parseInt(ev.currentTarget.dataset.index);
            this.props.onDragSkater(ev.currentTarget.dataset.side || '');
            this.setState({dragIndex:value});
        } else {
            this.setState({dragIndex:-1});
            this.props.onDragSkater('');
        }
    }

    /**
     * Called when the user drops a skater
     * @param ev 
     */
    protected onDrop = async () => {
        if(this.state.dropIndex > -1 && this.state.dragIndex > -1 && this.state.dragIndex !== this.state.dropIndex) {
            Roster.SwapSkaters(this.props.side, this.state.dragIndex, this.state.dropIndex);
        }
        this.setState({dropIndex:-1,dragIndex:-1});
        this.props.onDragSkater('');
    }

    componentDidMount() {
        this.remote = Roster.Subscribe(this.update);
        this.remoteRoster = Capture.Subscribe(this.update);
        this.remoteScoreboard = Scoreboard.Subscribe(this.update);
        this.update();
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        const records = Roster.GetSkaters(this.props.side);
        return <div className='team'>
            <div className='name' style={{backgroundColor:this.state.color}}>{this.state.name}</div>
            <div className='skaters'>
                {
                    records.map((record, index) => {
                        let className = '';
                        if(index === this.state.dragIndex)
                            className = 'dragging';
                        else if(index === this.state.dropIndex)
                            className = 'dropping';
                        return <RosterSkaterItem
                            className={className}
                            draggable={true}
                            active={false}
                            name={record.Name || ''}
                            number={record.Number || ''}
                            index={index}
                            data-index={index}
                            data-side={this.props.side}
                            recordId={record.RecordID || 0}
                            rosterIndex={this.state.rosterIndex}
                            rosterSide={this.state.rosterSide}
                            side={this.props.side}
                            onDragEnd={this.onDragEnd}
                            onDragLeave={this.onDragLeave}
                            onDragOver={this.onDragOver}
                            onDragStart={this.onDragStart}
                            onDrop={this.onDrop}
                            key={`record-${record.RecordID}-${index}`}
                        />
                    })
                }
            </div>
            <TeamRoles side={this.props.side}/>
        </div>
    }
}

export {Main as RosterTeamControl};