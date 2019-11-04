import React from 'react';
import { SkaterRecord } from 'tools/vars';
import ScorekeeperController from 'controllers/ScorekeeperController';
import { Unsubscribe } from 'redux';
import DataController from 'controllers/DataController';

export default class Positions extends React.PureComponent<any,{
    TeamA:{
        Jammer:SkaterRecord|null;
        Pivot:SkaterRecord|null;
        Blocker1:SkaterRecord|null;
        Blocker2:SkaterRecord|null;
        Blocker3:SkaterRecord|null;
    },
    TeamB:{
        Jammer:SkaterRecord|null;
        Pivot:SkaterRecord|null;
        Blocker1:SkaterRecord|null;
        Blocker2:SkaterRecord|null;
        Blocker3:SkaterRecord|null;
    }
}> {
    readonly state = {
        TeamA:{
            Jammer:ScorekeeperController.getState().TeamA.Track.Jammer,
            Pivot:ScorekeeperController.getState().TeamA.Track.Pivot,
            Blocker1:ScorekeeperController.getState().TeamA.Track.Blocker1,
            Blocker2:ScorekeeperController.getState().TeamA.Track.Blocker2,
            Blocker3:ScorekeeperController.getState().TeamA.Track.Blocker3,
        },
        TeamB:{
            Jammer:ScorekeeperController.getState().TeamB.Track.Jammer,
            Pivot:ScorekeeperController.getState().TeamB.Track.Pivot,
            Blocker1:ScorekeeperController.getState().TeamB.Track.Blocker1,
            Blocker2:ScorekeeperController.getState().TeamB.Track.Blocker2,
            Blocker3:ScorekeeperController.getState().TeamB.Track.Blocker3
        }
    };

    protected remoteRoster:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateRoster = this.updateRoster.bind(this);
    }

    protected async updateRoster() {
        let skatersA = ScorekeeperController.getState().TeamA.Track;
        let skatersB = ScorekeeperController.getState().TeamB.Track;

        if(!DataController.compare(skatersA, this.state.TeamA))
            this.setState({TeamA:skatersA});

        if(!DataController.compare(skatersB, this.state.TeamB))
            this.setState({TeamB:skatersB});
    }

    componentDidMount() {
        this.remoteRoster = ScorekeeperController.subscribe(this.updateRoster);
    }

    componentWillUnmount() {
        if(this.remoteRoster !== null)
            this.remoteRoster();
    }
    
    render() {
        return (
            <div className="positions">
                <div className="team team-a">
                    <SkaterItem skater={this.state.TeamA.Jammer}/>
                    <SkaterItem skater={this.state.TeamA.Pivot}/>
                    <SkaterItem skater={this.state.TeamA.Blocker1}/>
                    <SkaterItem skater={this.state.TeamA.Blocker2}/>
                    <SkaterItem skater={this.state.TeamA.Blocker3}/>
                </div>
                <div className="team team-b">
                    <SkaterItem skater={this.state.TeamB.Jammer}/>
                    <SkaterItem skater={this.state.TeamB.Pivot}/>
                    <SkaterItem skater={this.state.TeamB.Blocker1}/>
                    <SkaterItem skater={this.state.TeamB.Blocker2}/>
                    <SkaterItem skater={this.state.TeamB.Blocker3}/>
                </div>
            </div>
        );
    }
}

function SkaterItem(props:{skater:SkaterRecord|null}) {
    let src:string = '';
    let num:string = '';
    let name:string = '';
    let color:string = '#000';

    if(props.skater !== null) {
        name = props.skater.Name;
        if(props.skater.Number)
            num = '#' + props.skater.Number;

        if(props.skater.Thumbnail)
            src = DataController.mpath(props.skater.Thumbnail);

        if(props.skater.Color)
            color = props.skater.Color;
        return (
            <div className="skater" style={{backgroundColor:color}}>
                <div className="thumbnail">
                    <img src={src}/>
                </div>
                <div className="num">{num}</div>
                <div className="name">{name}</div>
            </div>
        );
    } else {
        return (
            <div className="skater">
                
            </div>
        )
    }
}