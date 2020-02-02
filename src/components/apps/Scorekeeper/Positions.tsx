import React from 'react';
import { SkaterRecord } from 'tools/vars';
import ScorekeeperController from 'controllers/ScorekeeperController';
import { Unsubscribe } from 'redux';
import { Compare, AddMediaPath } from 'controllers/functions';
import ScoreboardController from 'controllers/ScoreboardController';

export default class Positions extends React.PureComponent<any,{
    TeamAColor:string;
    TeamBColor:string;
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
        TeamAColor:ScoreboardController.GetState().TeamA.Color,
        TeamBColor:ScoreboardController.GetState().TeamB.Color,
        TeamA:{
            Jammer:ScorekeeperController.GetState().TeamA.Track.Jammer,
            Pivot:ScorekeeperController.GetState().TeamA.Track.Pivot,
            Blocker1:ScorekeeperController.GetState().TeamA.Track.Blocker1,
            Blocker2:ScorekeeperController.GetState().TeamA.Track.Blocker2,
            Blocker3:ScorekeeperController.GetState().TeamA.Track.Blocker3,
        },
        TeamB:{
            Jammer:ScorekeeperController.GetState().TeamB.Track.Jammer,
            Pivot:ScorekeeperController.GetState().TeamB.Track.Pivot,
            Blocker1:ScorekeeperController.GetState().TeamB.Track.Blocker1,
            Blocker2:ScorekeeperController.GetState().TeamB.Track.Blocker2,
            Blocker3:ScorekeeperController.GetState().TeamB.Track.Blocker3
        }
    };

    protected remoteRoster?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected async updateScorekeeper() {
        let skatersA = ScorekeeperController.GetState().TeamA.Track;
        let skatersB = ScorekeeperController.GetState().TeamB.Track;

        if(!Compare(skatersA, this.state.TeamA))
            this.setState({TeamA:skatersA});

        if(!Compare(skatersB, this.state.TeamB))
            this.setState({TeamB:skatersB});
    }

    protected updateScoreboard() {
        this.setState({
            TeamAColor:ScoreboardController.GetState().TeamA.Color,
            TeamBColor:ScoreboardController.GetState().TeamB.Color
        });
    }

    componentDidMount() {
        this.remoteRoster = ScorekeeperController.Subscribe(this.updateScorekeeper);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteRoster)
            this.remoteRoster();
    }
    
    render() {
        return (
            <div className="positions">
                <div className="team team-a">
                    <SkaterItem skater={this.state.TeamA.Jammer} color={this.state.TeamAColor}/>
                    <SkaterItem skater={this.state.TeamA.Pivot} color={this.state.TeamAColor}/>
                    <SkaterItem skater={this.state.TeamA.Blocker1} color={this.state.TeamAColor}/>
                    <SkaterItem skater={this.state.TeamA.Blocker2} color={this.state.TeamAColor}/>
                    <SkaterItem skater={this.state.TeamA.Blocker3} color={this.state.TeamAColor}/>
                </div>
                <div className="team team-b">
                    <SkaterItem skater={this.state.TeamB.Jammer} color={this.state.TeamBColor}/>
                    <SkaterItem skater={this.state.TeamB.Pivot} color={this.state.TeamBColor}/>
                    <SkaterItem skater={this.state.TeamB.Blocker1} color={this.state.TeamBColor}/>
                    <SkaterItem skater={this.state.TeamB.Blocker2} color={this.state.TeamBColor}/>
                    <SkaterItem skater={this.state.TeamB.Blocker3} color={this.state.TeamBColor}/>
                </div>
            </div>
        );
    }
}

export function SkaterItem(props:{skater:SkaterRecord|null,color:string}) {
    let src:string = '';
    let num:string = '';
    let name:string = '';

    if(props.skater) {
        name = props.skater.Name;
        if(props.skater.Number)
            num = '#' + props.skater.Number;

        if(props.skater.Thumbnail)
            src = AddMediaPath(props.skater.Thumbnail);

        return (
            <div className="skater" style={{backgroundColor:props.color}}>
                <div className="thumbnail">
                    <img src={src}/>
                </div>
                <div className="num">{num}</div>
                <div className="name">{name}</div>
            </div>
        );
    } else {
        return (
            <div className="skater" style={{borderColor:props.color}}>
                
            </div>
        )
    }
}