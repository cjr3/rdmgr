import React from 'react';
import {Unsubscribe} from 'redux';
import cnames from 'classnames';
import vars, { TeamRecord, SkaterRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController';
import DataController from 'controllers/DataController';
import RosterController from 'controllers/RosterController';
import SortPanel from 'components/tools/SortPanel';
import { MediaThumbnail } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';

export default class MediaQueueRoster extends React.PureComponent<any, {
    TeamA:{
        ID:number;
        Name:string;
        Color:string;
        Thumbnail:string;
        Slide?:string;
        Photo?:string;
    },
    TeamB:{
        ID:number;
        Name:string;
        Color:string;
        Thumbnail:string;
        Slide?:string;
        Photo?:string;
    },
    Index:number;
    CurrentTeam:string;
    SkatersA:Array<SkaterRecord>;
    SkatersB:Array<SkaterRecord>;
    Record:any;
}> {
    readonly state = {
        TeamA:{
            ID:ScoreboardController.getState().TeamA.ID,
            Name:ScoreboardController.getState().TeamA.Name,
            Color:ScoreboardController.getState().TeamA.Color,
            Thumbnail:ScoreboardController.getState().TeamA.Thumbnail,
            Slide:ScoreboardController.getState().TeamA.Slide,
            Photo:ScoreboardController.getState().TeamA.Photo
        },
        TeamB:{
            ID:ScoreboardController.getState().TeamB.ID,
            Name:ScoreboardController.getState().TeamB.Name,
            Color:ScoreboardController.getState().TeamB.Color,
            Thumbnail:ScoreboardController.getState().TeamB.Thumbnail,
            Slide:ScoreboardController.getState().TeamB.Slide,
            Photo:ScoreboardController.getState().TeamB.Photo
        },
        Index:RosterController.getState().SkaterIndex,
        CurrentTeam:RosterController.getState().CurrentTeam,
        SkatersA:RosterController.getState().TeamA.Skaters,
        SkatersB:RosterController.getState().TeamB.Skaters,
        Record:MediaQueueController.getState().Record
    }

    protected remoteScoreboard:Unsubscribe|null = null;
    protected remoteRoster:Unsubscribe|null = null;
    protected remoteMedia:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
    }

    protected async updateRoster() {
        let cstate = RosterController.getState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            Index:cstate.SkaterIndex
        };

        let skatersA = cstate.TeamA.Skaters;
        let skatersB = cstate.TeamB.Skaters;
        if(!DataController.compare(skatersA, this.state.SkatersA))
            changes.SkatersA = skatersA;
        if(!DataController.compare(skatersB, this.state.SkatersB))
            changes.SkatersB = skatersB;

        this.setState(changes);
    }

    protected async updateScoreboard() {
        let cstate = ScoreboardController.getState();
        let teama:any = {
            ID:cstate.TeamA.ID,
            Name:cstate.TeamA.Name,
            Color:cstate.TeamA.Color,
            Thumbnail:cstate.TeamA.Thumbnail,
            Slide:cstate.TeamA.Slide,
            Photo:cstate.TeamA.Photo
        };
        let teamb:any = {
            ID:cstate.TeamB.ID,
            Name:cstate.TeamB.Name,
            Color:cstate.TeamB.Color,
            Thumbnail:cstate.TeamB.Thumbnail,
            Slide:cstate.TeamB.Slide,
            Photo:cstate.TeamB.Photo
        };

        if(!DataController.compare(teama, this.state.TeamA))
            this.setState({TeamA:teama});

        if(!DataController.compare(teamb, this.state.TeamB))
            this.setState({TeamB:teamb});
    }

    protected async updateMedia() {
        let cstate = MediaQueueController.getState();
        if(!DataController.compare(cstate.Record, this.state.Record))
            this.setState({Record:cstate.Record});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.subscribe(this.updateRoster);
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
        if(this.remoteRoster !== null)
            this.remoteRoster();
        if(this.remoteMedia !== null)
            this.remoteMedia();
    }

    render() {
        const slides:Array<any> = new Array<any>();
        let shown:boolean = (this.state.Record && this.state.Record.RecordType === vars.RecordType.Roster) ? true : false;
        let skaters:Array<SkaterRecord> = this.state.SkatersA;
        let src:string = '';
        let id:number = this.state.TeamA.ID;
        let name:string = this.state.TeamA.Name;
        if(this.state.TeamA.Slide)
            src = this.state.TeamA.Slide;
        else if(this.state.TeamA.Photo)
            src = this.state.TeamA.Photo;

        if(this.state.CurrentTeam === 'B') {
            skaters = this.state.SkatersB;
            src = '';
            id = this.state.TeamB.ID;
            let name:string = this.state.TeamB.Name;
            if(this.state.TeamB.Slide)
                src = this.state.TeamB.Slide;
            else if(this.state.TeamB.Photo)
                src = this.state.TeamB.Photo;
        }

        slides.push({
            label:<React.Fragment key={`${vars.RecordType.Team}-${id}`}>
                <MediaThumbnail src={src}/>
                <div className="slide-title">{name}</div>
            </React.Fragment>
        });

        skaters.forEach((skater) => {
            let src:string = '';
            if(skater.Slide)
                src = skater.Slide;
            else if(skater.Photo)
                src = skater.Photo;
            else if(skater.Thumbnail)
                src = skater.Thumbnail;
            slides.push({
                label:<React.Fragment key={`${skater.RecordType}-${skater.RecordID}`}>
                    <MediaThumbnail src={DataController.mpath(src)}/>
                    <div className="slide-title">{skater.Name}</div>
                </React.Fragment>
            });
        });

        return (
            <div className={cnames('record-control slideshow-slides', {shown:(shown)})}>
                <SortPanel
                    items={slides}
                    index={(this.state.Index+1)}
                    onDoubleClick={(index) => {
                        RosterController.SetSkater(this.state.CurrentTeam, index-1);
                    }}
                    onDrop={(target, source, ctrl) => {
                        RosterController.SwapSkaters(this.state.CurrentTeam, source, this.state.CurrentTeam, target);
                    }}
                />
            </div>
        );
    }
}