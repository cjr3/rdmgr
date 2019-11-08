import React from 'react';
import vars, { AnthemRecord, SlideshowRecord, VideoRecord, SponsorRecord } from 'tools/vars';
import { Unsubscribe } from 'redux';
import cnames from 'classnames';
import DataController from 'controllers/DataController';
import CaptureController from 'controllers/CaptureController';
import { IconButton, IconFlag, IconCheck, IconX, IconSlideshow, IconShown, IconHidden, ToggleButton, IconMovie, IconTicket, IconTeam, Button, IconPlus } from 'components/Elements';
import RecordList from 'components/data/RecordList';
import MediaQueueController from 'controllers/MediaQueueController';
import Raffle from 'components/apps/Raffle/Raffle';
import SponsorController from 'controllers/SponsorController';
import ScoreboardController from 'controllers/ScoreboardController';

export default class MediaQueueRecordSets extends React.PureComponent<any, {
    RecordType:string;
}> {
    readonly state = {
        RecordType:vars.RecordType.RafflePrize
    }

    protected RaffleItem:React.RefObject<Raffle> = React.createRef();

    render() {
        return (
            <div className="queue-recordsets">
                <AnthemRecords 
                    shown={(this.state.RecordType == vars.RecordType.Anthem)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Anthem})}}
                    />
                <SlideshowRecords 
                    shown={(this.state.RecordType == vars.RecordType.Slideshow)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Slideshow})}}
                    />
                <SponsorRecords 
                    shown={(this.state.RecordType == vars.RecordType.Sponsor)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Sponsor})}}
                    />
                <VideoRecords 
                    shown={(this.state.RecordType == vars.RecordType.Video)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Video})}}
                    />

                <RosterRecords
                    shown={(this.state.RecordType == vars.RecordType.Roster)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Roster})}}
                />
                
                <div className={cnames('recordset', {shown:(this.state.RecordType === vars.RecordType.RafflePrize)})}>
                    <IconButton
                        src={IconTicket}
                        onClick={() => {this.setState({RecordType:vars.RecordType.RafflePrize});}}
                    >Raffle</IconButton>
                    <Raffle opened={true} ref={this.RaffleItem}/>
                </div>
            </div>
        )
    }
}

class AnthemRecords extends React.PureComponent<{
    shown:boolean;
    onClick:Function;
}, {
    Records:Array<AnthemRecord>;
    className:string;
}> {

    readonly state = {
        Records:DataController.getAnthemSingers(true),
        className:CaptureController.getState().NationalAnthem.className
    }

    protected remoteData:Unsubscribe|null = null;
    protected remoteCapture:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    protected async updateData() {
        let records = DataController.getAnthemSingers(true);
        if(!DataController.compare(records, this.state.Records))
            this.setState({Records:records});
    }

    protected async updateCapture() {
        this.setState({className:CaptureController.getState().NationalAnthem.className});
    }

    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
    }
    
    componentWillUnmount() {
        if(this.remoteData !== null) {
            this.remoteData();
        }
        if(this.remoteCapture !== null) {
            this.remoteCapture();
        }
    }

    render() {
        return (
            <div className={cnames('recordset', {shown:this.props.shown})}>
                <IconButton
                    src={IconFlag}
                    onClick={this.props.onClick}
                    >Anthem</IconButton>
                <div className="stack-panel s2">
                    <IconButton
                        src={(this.state.className === 'banner') ? IconCheck : IconX}
                        active={(this.state.className === 'banner')}
                        onClick={() => {
                            CaptureController.SetNationalAnthemClass('banner');
                        }}
                        >Banner</IconButton>
                    <IconButton
                        src={(this.state.className === '') ? IconCheck : IconX}
                        active={(this.state.className === '')}
                        onClick={() => {
                            CaptureController.SetNationalAnthemClass('');
                        }}
                        >Full</IconButton>
                </div>
                <RecordList
                    records={this.state.Records}
                    onSelect={(record) => {MediaQueueController.Add(record);}}
                />
            </div>
        )
    }
}

class SlideshowRecords extends React.PureComponent<{
    shown:boolean;
    onClick:Function;
}, {
    Records:Array<SlideshowRecord>;
}> {

    readonly state = {
        Records:DataController.getSlideshows(true)
    }

    protected remoteData:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected async updateData() {
        let records = DataController.getSlideshows(true);
        if(!DataController.compare(records, this.state.Records))
            this.setState({Records:records});
    }

    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }
    
    componentWillUnmount() {
        if(this.remoteData !== null) {
            this.remoteData();
        }
    }

    render() {
        return (
            <div className={cnames('recordset', {shown:this.props.shown})}>
                <IconButton
                    src={IconSlideshow}
                    onClick={this.props.onClick}
                    >Slideshow</IconButton>
                <RecordList
                    records={this.state.Records}
                    onSelect={(record) => {MediaQueueController.Add(record);}}
                />
            </div>
        )
    }
}

class SponsorRecords extends React.PureComponent<{
    shown:boolean;
    onClick:Function;
}, {
    Records:Array<SlideshowRecord>;
    Shown:boolean;
    className:string;
    Delay:number;
    RecordID:number;
}> {

    readonly state = {
        Records:DataController.getSlideshows(true),
        Shown:CaptureController.getState().SponsorSlideshow.Shown,
        Delay:SponsorController.getState().SlideDuration,
        RecordID:SponsorController.getState().RecordID,
        className:CaptureController.getState().SponsorSlideshow.className
    }

    protected remoteData:Unsubscribe|null = null;
    protected remoteCapture:Unsubscribe|null = null;
    protected remoteSponsor:Unsubscribe|null = null;

    protected Timer:number = 0;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateSponsor = this.updateSponsor.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    protected async updateData() {
        let records = DataController.getSlideshows(true);
        if(!DataController.compare(records, this.state.Records))
            this.setState({Records:records});
    }

    protected async updateCapture() {
        this.setState({
            Shown:CaptureController.getState().SponsorSlideshow.Shown,
            className:CaptureController.getState().className
        });
    }

    protected async updateSponsor() {
        this.setState({
            Delay:SponsorController.getState().SlideDuration,
            RecordID:SponsorController.getState().RecordID,
        });
    }

    protected async onSelect(record:SponsorRecord|null) {
        try {clearInterval(this.Timer);} catch(er) {}
        if(record !== null) {
            SponsorController.SetSlides(record.Records, record.RecordID);
            this.Timer = window.setInterval(() => {
                if(this.state.Shown)
                    SponsorController.Next();
            }, this.state.Delay);
        } else {
            CaptureController.SetSponsorSlideshowVisibility(false);
        }
    }

    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteSponsor = SponsorController.subscribe(this.updateSponsor);
    }
    
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteSponsor !== null)
            this.remoteSponsor();
    }

    render() {
        let records:Array<SlideshowRecord> = new Array<SlideshowRecord>();
        this.state.Records.forEach((record) => {
            if(record.SlideshowType === 'SPONSOR') {
                records.push(record);
            }
        });
        
        return (
            <div className={cnames('recordset has-buttons', {shown:this.props.shown})}>
                <IconButton
                    src={IconSlideshow}
                    onClick={this.props.onClick}
                    >Sponsors</IconButton>
                <RecordList
                    records={records}
                    recordid={this.state.RecordID}
                    onSelect={this.onSelect}
                />
                <div className="buttons">
                    <IconButton
                        active={this.state.Shown}
                        onClick={CaptureController.ToggleSponsors}
                        src={(this.state.Shown) ? IconShown : IconHidden}
                    >{(this.state.Shown) ? 'Hide' : 'Show'}</IconButton>
                    
                    <IconButton
                        active={(this.state.className === 'sponsor-board')}
                        onClick={CaptureController.ToggleSponsorView}
                        src={(this.state.className === 'sponsor-board') ? IconCheck : IconX}
                    >{'Sponsor View'}</IconButton>
                </div>
            </div>
        )
    }
}

class VideoRecords extends React.PureComponent<{
    shown:boolean;
    onClick:Function;
}, {
    Records:Array<VideoRecord>;
}> {

    readonly state = {
        Records:DataController.getVideos(true)
    }

    protected remoteData:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected async updateData() {
        let records = DataController.getVideos(true);
        if(!DataController.compare(records, this.state.Records))
            this.setState({Records:records});
    }

    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }
    
    componentWillUnmount() {
        if(this.remoteData !== null) {
            this.remoteData();
        }
    }

    render() {
        return (
            <div className={cnames('recordset', {shown:this.props.shown})}>
                <IconButton
                    src={IconMovie}
                    onClick={this.props.onClick}
                    >Videos</IconButton>
                <RecordList
                    records={this.state.Records}
                    onSelect={(record) => {MediaQueueController.Add(record);}}
                />
            </div>
        )
    }
}

class RosterRecords extends React.PureComponent<{
    shown:boolean;
    onClick:Function;
}, {
    TeamA:{
        RecordID:number;
        Name:string;
        Color:string;
        Thumbnail:string;
    },
    TeamB:{
        RecordID:number;
        Name:string;
        Color:string;
        Thumbnail:string;
    }
}> {
    
    readonly state = {
        TeamA:{
            RecordID:ScoreboardController.getState().TeamA.ID,
            Name:ScoreboardController.getState().TeamA.Name,
            Color:ScoreboardController.getState().TeamA.Color,
            Thumbnail:ScoreboardController.getState().TeamA.Thumbnail
        },
        TeamB:{
            RecordID:ScoreboardController.getState().TeamB.ID,
            Name:ScoreboardController.getState().TeamB.Name,
            Color:ScoreboardController.getState().TeamB.Color,
            Thumbnail:ScoreboardController.getState().TeamB.Thumbnail
        },
    }
    protected remoteScoreboard:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }
    
    protected async updateScoreboard() {
        let cstate = ScoreboardController.getState();
        let teama = {
            RecordID:cstate.TeamA.ID,
            Name:cstate.TeamA.Name,
            Color:cstate.TeamA.Color,
            Thumbnail:cstate.TeamA.Thumbnail
        };
        let teamb = {
            RecordID:cstate.TeamB.ID,
            Name:cstate.TeamB.Name,
            Color:cstate.TeamB.Color,
            Thumbnail:cstate.TeamB.Thumbnail
        };

        if(!DataController.compare(teama, this.state.TeamA))
            this.setState({TeamA:teama});

        if(!DataController.compare(teamb, this.state.TeamB))
            this.setState({TeamB:teamb});
    }
    
    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
    }
    
    render() {
        return (
            <div className={cnames('recordset', {shown:this.props.shown})}>
                <IconButton
                    src={IconTeam}
                    onClick={this.props.onClick}
                    >Roster / Intros</IconButton>
                <IconButton
                    src={IconPlus}
                    onClick={() => {
                        MediaQueueController.Add(Object.assign({
                            RecordType:vars.RecordType.Roster,
                            Side:'A'
                        }, this.state.TeamA));
                    }}
                    style={{backgroundColor:this.state.TeamA.Color}}
                >{this.state.TeamA.Name}</IconButton>
                <IconButton
                    src={IconPlus}
                    onClick={() => {
                        MediaQueueController.Add(Object.assign({
                            RecordType:vars.RecordType.Roster,
                            Side:'B'
                        }, this.state.TeamB));
                    }}
                    style={{backgroundColor:this.state.TeamB.Color}}
                >{this.state.TeamB.Name}</IconButton>
            </div>
        );
    }
}