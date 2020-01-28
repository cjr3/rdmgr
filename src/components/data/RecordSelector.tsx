import React from 'react';
import vars, { Record, AnthemRecord, PeerRecord, PenaltyRecord, PhaseRecord, SkaterRecord, SlideshowRecord, TeamRecord, VideoRecord } from 'tools/vars';
import {AnthemRecordList} from './AnthemEditor';
import {PenaltyRecordList} from './PenaltyEditor';
import {PeerRecordList} from './PeerEditor';
import {PhaseRecordList} from './PhaseEditor';
import {SkaterRecordList} from './SkaterEditor';
import {TeamRecordList} from './TeamEditor';
import {SlideshowRecordList} from './SlideshowEditor';
import {VideoRecordList} from './VideoEditor';
import { Icon, IconFlag, IconOffline, IconWhistle, IconSkater, IconSlideshow, IconTeam, IconStopwatch, IconMovie, IconPlus } from 'components/Elements';
import DataController from 'controllers/DataController';
import AnthemsController from 'controllers/AnthemsController';
import PeersController from 'controllers/PeersController';
import PenaltiesController from 'controllers/PenaltiesController';
import PhasesController from 'controllers/PhasesController';
import SkatersController from 'controllers/SkatersController';
import TeamsController from 'controllers/TeamsController';
import SlideshowsController from 'controllers/SlideshowsController';
import VideosController from 'controllers/VideosController';

export default class RecordSelector extends React.PureComponent<{
    types:Array<string>;
    onSelect:{(record:Record)};
    keywords?:string;
    recordType?:string;
    newRecordIcon?:boolean;
    title?:string;
    highlight?:boolean;
}, {
    RecordType:string;
    Anthem:AnthemRecord|null;
    Peer:PeerRecord|null;
    Penalty:PenaltyRecord|null;
    Phase:PhaseRecord|null;
    Skater:SkaterRecord|null;
    Slideshow:SlideshowRecord|null;
    Team:TeamRecord|null;
    Video:VideoRecord|null;
}> {
    readonly state = {
        RecordType:'',
        Anthem:null,
        Peer:null,
        Penalty:null,
        Phase:null,
        Skater:null,
        Slideshow:null,
        Team:null,
        Video:null
    }

    constructor(props) {
        super(props);
        this.onSelectAnthem = this.onSelectAnthem.bind(this);
        this.onSelectPeer = this.onSelectPeer.bind(this);
        this.onSelectPenalty = this.onSelectPenalty.bind(this);
        this.onSelectPhase = this.onSelectPhase.bind(this);
        this.onSelectSkater = this.onSelectSkater.bind(this);
        this.onSelectSlideshow = this.onSelectSlideshow.bind(this);
        this.onSelectTeam = this.onSelectTeam.bind(this);
        this.onSelectVideo = this.onSelectVideo.bind(this);

        this.onClickNewRecord = this.onClickNewRecord.bind(this);

        if(this.props.recordType)
            this.state.RecordType = this.props.recordType;
    }

    protected onSelectAnthem(record:AnthemRecord) {
        this.setState({Anthem:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectPeer(record:PeerRecord) {
        this.setState({Peer:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectPenalty(record:PenaltyRecord) {
        this.setState({Penalty:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectPhase(record:PhaseRecord) {
        this.setState({Phase:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectSkater(record:SkaterRecord) {
        this.setState({Skater:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectSlideshow(record:SlideshowRecord) {
        this.setState({Slideshow:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectTeam(record:TeamRecord) {
        this.setState({Team:record}, () => {this.props.onSelect(record);});
    }

    protected onSelectVideo(record:VideoRecord) {
        this.setState({Video:record}, () => {this.props.onSelect(record);});
    }

    protected onClickNewRecord() {
        switch(this.state.RecordType) {
            case vars.RecordType.Anthem :
                this.props.onSelect(AnthemsController.NewRecord());
            break;
            case vars.RecordType.Peer :
                this.props.onSelect(PeersController.NewRecord());
            break;
            case vars.RecordType.Penalty :
                this.props.onSelect(PenaltiesController.NewRecord());
            break;
            case vars.RecordType.Phase :
                this.props.onSelect(PhasesController.NewRecord());
            break;
            case vars.RecordType.Skater :
                this.props.onSelect(SkatersController.NewRecord());
            break;
            case vars.RecordType.Team :
                this.props.onSelect(TeamsController.NewRecord());
            break;
            case vars.RecordType.Slideshow :
                this.props.onSelect(SlideshowsController.NewRecord());
            break;
            case vars.RecordType.Video :
                this.props.onSelect(VideosController.NewRecord());
            break;

            default :

            break;
        }
    }

    render() {
        const children:Array<React.ReactElement> = new Array<React.ReactElement>();
        const icons:Array<React.ReactElement> = new Array<React.ReactElement>();
        let title:string = 'Records';
        let newIcon:undefined|React.ReactElement;
        if(this.props.newRecordIcon) {
            newIcon = <Icon
                src={IconPlus}
                onClick={this.onClickNewRecord}
                title={"New Record"}
            />
        }

        if(!this.props.title) {
            switch(this.state.RecordType) {
                case vars.RecordType.Anthem : title = 'Anthem Singers'; break;
                case vars.RecordType.Peer : title = 'Peers/Network'; break;
                case vars.RecordType.Phase : title = 'Phases/Quarters'; break;
                case vars.RecordType.Penalty : title = 'Penalties'; break;
                case vars.RecordType.Skater : title = 'Skaters'; break;
                case vars.RecordType.Slideshow : title = 'Slideshows'; break;
                case vars.RecordType.Team : title = 'Teams'; break;
                case vars.RecordType.Video : title = 'Videos'; break;
            }
        } else {
            title = this.props.title;
        }

        //Anthem
        if(this.props.types.indexOf(vars.RecordType.Anthem) >= 0) {
            children.push(
                <AnthemRecordList
                    key={`list-${vars.RecordType.Anthem}`}
                    shown={(this.state.RecordType == vars.RecordType.Anthem)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Anthem : null)}
                    onSelect={this.onSelectAnthem}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Anthem}`}
                    src={IconFlag}
                    active={(this.state.RecordType == vars.RecordType.Anthem)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Anthem})}}
                    title={`Anthem Singers`}
                />
            );
        }

        //Penalty
        if(this.props.types.indexOf(vars.RecordType.Penalty) >= 0) {
            children.push(
                <PenaltyRecordList
                    key={`list-${vars.RecordType.Penalty}`}
                    shown={(this.state.RecordType == vars.RecordType.Penalty)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Penalty : null)}
                    onSelect={this.onSelectPenalty}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Penalty}`}
                    src={IconWhistle}
                    active={(this.state.RecordType == vars.RecordType.Penalty)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Penalty})}}
                    title={`Penalties`}
                />
            );
        }

        //Phase
        if(this.props.types.indexOf(vars.RecordType.Phase) >= 0) {
            children.push(
                <PhaseRecordList
                    key={`list-${vars.RecordType.Phase}`}
                    shown={(this.state.RecordType == vars.RecordType.Phase)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Phase : null)}
                    onSelect={this.onSelectPhase}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Phase}`}
                    src={IconStopwatch}
                    active={(this.state.RecordType == vars.RecordType.Phase)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Phase})}}
                    title={`Phases/Quarters`}
                />
            );
        }

        //Skater
        if(this.props.types.indexOf(vars.RecordType.Skater) >= 0) {
            children.push(
                <SkaterRecordList
                    key={`list-${vars.RecordType.Skater}`}
                    shown={(this.state.RecordType == vars.RecordType.Skater)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Skater : null)}
                    onSelect={this.onSelectSkater}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Skater}`}
                    src={IconSkater}
                    active={(this.state.RecordType == vars.RecordType.Skater)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Skater})}}
                    title={`Skaters`}
                />
            );
        }

        //Team
        if(this.props.types.indexOf(vars.RecordType.Team) >= 0) {
            children.push(
                <TeamRecordList
                    key={`list-${vars.RecordType.Team}`}
                    shown={(this.state.RecordType == vars.RecordType.Team)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Team : null)}
                    onSelect={this.onSelectTeam}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Team}`}
                    src={IconTeam}
                    active={(this.state.RecordType == vars.RecordType.Team)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Team})}}
                    title={`Teams`}
                />
            );
        }

        //Slideshow
        if(this.props.types.indexOf(vars.RecordType.Slideshow) >= 0) {
            children.push(
                <SlideshowRecordList
                    key={`list-${vars.RecordType.Slideshow}`}
                    shown={(this.state.RecordType == vars.RecordType.Slideshow)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Slideshow : null)}
                    onSelect={this.onSelectSlideshow}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Slideshow}`}
                    src={IconSlideshow}
                    active={(this.state.RecordType == vars.RecordType.Slideshow)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Slideshow})}}
                    title={`Slideshows`}
                />
            );
        }

        //Video
        if(this.props.types.indexOf(vars.RecordType.Video) >= 0) {
            children.push(
                <VideoRecordList
                    key={`list-${vars.RecordType.Video}`}
                    shown={(this.state.RecordType == vars.RecordType.Video)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Video : null)}
                    onSelect={this.onSelectVideo}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Video}`}
                    src={IconMovie}
                    active={(this.state.RecordType == vars.RecordType.Video)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Video})}}
                    title={`Videos`}
                />
            );
        }

        //Peer
        if(this.props.types.indexOf(vars.RecordType.Peer) >= 0) {
            children.push(
                <PeerRecordList
                    key={`list-${vars.RecordType.Peer}`}
                    shown={(this.state.RecordType == vars.RecordType.Peer)}
                    keywords={this.props.keywords}
                    record={((this.props.highlight == undefined || this.props.highlight == true) ? this.state.Peer : null)}
                    onSelect={this.onSelectPeer}
                />
            );
            icons.push(
                <Icon
                    key={`icon-${vars.RecordType.Peer}`}
                    src={IconOffline}
                    active={(this.state.RecordType == vars.RecordType.Peer)}
                    onClick={() => {this.setState({RecordType:vars.RecordType.Peer})}}
                    title={`Peers/Network`}
                />
            );
        }

        return (
            <div className="record-selector">
                <div className="title">
                    <span>{title}</span>
                    {newIcon}
                </div>
                <div className="icons">
                    {icons}
                </div>
                <div className="record-lists">
                    {children}
                </div>
            </div>
        );
    }
}

