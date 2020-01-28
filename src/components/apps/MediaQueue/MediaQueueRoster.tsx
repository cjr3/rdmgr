import React from 'react';
import {Unsubscribe} from 'redux';
import cnames from 'classnames';
import vars, { SkaterRecord } from 'tools/vars';
import ScoreboardController from 'controllers/ScoreboardController';
import RosterController from 'controllers/RosterController';
import SortPanel from 'components/tools/SortPanel';
import { MediaThumbnail } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';
import { Compare, AddMediaPath } from 'controllers/functions';

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
            ID:ScoreboardController.GetState().TeamA.ID,
            Name:ScoreboardController.GetState().TeamA.Name,
            Color:ScoreboardController.GetState().TeamA.Color,
            Thumbnail:ScoreboardController.GetState().TeamA.Thumbnail,
            Slide:ScoreboardController.GetState().TeamA.Slide,
            Photo:ScoreboardController.GetState().TeamA.Photo
        },
        TeamB:{
            ID:ScoreboardController.GetState().TeamB.ID,
            Name:ScoreboardController.GetState().TeamB.Name,
            Color:ScoreboardController.GetState().TeamB.Color,
            Thumbnail:ScoreboardController.GetState().TeamB.Thumbnail,
            Slide:ScoreboardController.GetState().TeamB.Slide,
            Photo:ScoreboardController.GetState().TeamB.Photo
        },
        Index:RosterController.GetState().SkaterIndex,
        CurrentTeam:RosterController.GetState().CurrentTeam,
        SkatersA:RosterController.GetState().TeamA.Skaters,
        SkatersB:RosterController.GetState().TeamB.Skaters,
        Record:MediaQueueController.GetState().Record
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
        let cstate = RosterController.GetState();
        let changes:any = {
            CurrentTeam:cstate.CurrentTeam,
            Index:cstate.SkaterIndex
        };

        let skatersA = cstate.TeamA.Skaters;
        let skatersB = cstate.TeamB.Skaters;
        if(!Compare(skatersA, this.state.SkatersA))
            changes.SkatersA = skatersA;
        if(!Compare(skatersB, this.state.SkatersB))
            changes.SkatersB = skatersB;

        this.setState(changes);
    }

    protected async updateScoreboard() {
        let cstate = ScoreboardController.GetState();
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

        if(!Compare(teama, this.state.TeamA))
            this.setState({TeamA:teama});

        if(!Compare(teamb, this.state.TeamB))
            this.setState({TeamB:teamb});
    }

    protected async updateMedia() {
        let cstate = MediaQueueController.GetState();
        if(!Compare(cstate.Record, this.state.Record))
            this.setState({Record:cstate.Record});
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteRoster = RosterController.Subscribe(this.updateRoster);
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
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
            name = this.state.TeamB.Name;
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
                    <MediaThumbnail src={AddMediaPath(src)}/>
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