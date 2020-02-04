import React from 'react';
import { SkaterRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import { Unsubscribe } from 'redux';
import Panel from 'components/Panel';
import { AddMediaPath } from 'controllers/functions';
import './css/Jammers.scss';

export default class JammersPanel extends React.PureComponent<any, {
    ColorA:string;
    ColorB:string;
    LogoA:string;
    LogoB:string;
    JammerA:SkaterRecord;
    JammerB:SkaterRecord;
}> {
    readonly state = {
        ColorA:ScoreboardController.GetState().TeamA.Color,
        ColorB:ScoreboardController.GetState().TeamB.Color,
        LogoA:ScoreboardController.GetState().TeamA.Thumbnail,
        LogoB:ScoreboardController.GetState().TeamB.Thumbnail,
        JammerA:ScorekeeperController.GetState().TeamA.Track.Jammer,
        JammerB:ScorekeeperController.GetState().TeamB.Track.Jammer
    };

    protected remoteScoreboard?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
    }

    protected updateScoreboard() {
        this.setState({
            ColorA:ScoreboardController.GetState().TeamA.Color,
            ColorB:ScoreboardController.GetState().TeamB.Color,
            LogoA:ScoreboardController.GetState().TeamA.Logo,
            LogoB:ScoreboardController.GetState().TeamB.Logo
        });
    }

    protected updateScorekeeper() {
        this.setState({
            JammerA:ScorekeeperController.GetState().TeamA.Track.Jammer,
            JammerB:ScorekeeperController.GetState().TeamB.Track.Jammer
        });
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
    }

    render() {
        return (
            <div className="jammers">
                <JammerItem skater={this.state.JammerA} color={this.state.ColorA} logo={this.state.LogoA}/>
                <JammerItem skater={this.state.JammerB} color={this.state.ColorB} logo={this.state.LogoB}/>
            </div>
        )
    }
}

function JammerItem(props:{skater:SkaterRecord|null,color:string,logo:string}) {
    if(!props.skater)
    {
        return (
            <div className="jammer no-jammer" style={{borderColor:props.color}}>

            </div>
        );
    }

    let src:string = '';
    let num:string = '';
    if(props.skater.Number)
        num = '#' + props.skater.Number;
    
    if(props.skater.Thumbnail)
        src = AddMediaPath(props.skater.Thumbnail);
    else if(props.logo)
        src = AddMediaPath(props.logo);

    return (
        <div className="jammer" style={{borderColor:props.color}}>
            <div className="num">{num}</div>
            <div className="thumbnail">
                <img src={src} title={props.skater.Name} alt=""/>
            </div>
        </div>
    );
}