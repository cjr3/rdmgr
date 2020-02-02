import React from 'react';
import cnames from 'classnames';
import vars, { 
    AnthemRecord, 
    PenaltyRecord, 
    TeamRecord, 
    SkaterRecord, 
    PhaseRecord,
    SlideshowRecord, 
    VideoRecord,
    PeerRecord
} from 'tools/vars';
import { 
    IconFlag, 
    IconWhistle,
    IconStopwatch,
    IconSkater,
    IconSlideshow,
    IconMovie,
    IconOffline,
    IconPlus,
    IconTeam,
    Icon,
    IconSkate,
    IconQueue,
    IconPalette
} from 'components/Elements';
import Panel from 'components/Panel';

import { 
    AnthemEditor, 
    TeamEditor, 
    SlideshowEditor,
    PenaltyEditor,
    PhaseEditor,
    SkaterEditor,
    VideoEditor,
    PeerEditor
} from './RecordEditor';
import ConfigFormScoreboard from './ConfigFormScoreboard';
import ConfirgFormAPI from './ConfigFormAPI';
import {AnthemRecordList} from './AnthemEditor';
import AnthemsController from 'controllers/AnthemsController';
import SkatersController from 'controllers/SkatersController';
import TeamsController from 'controllers/TeamsController';
import VideosController from 'controllers/VideosController';
import SlideshowsController from 'controllers/SlideshowsController';
import PhasesController from 'controllers/PhasesController';
import PeersController from 'controllers/PeersController';
import PenaltiesController from 'controllers/PenaltiesController';
import { SkaterRecordList } from './SkaterEditor';
import { PenaltyRecordList } from './PenaltyEditor';
import { PhaseRecordList } from './PhaseEditor';
import { PeerRecordList } from './PeerEditor';
import { SlideshowRecordList } from './SlideshowEditor';
import { TeamRecordList } from './TeamEditor';
import { VideoRecordList } from './VideoEditor';
import './css/ConfigForm.scss';
import MiscConfigForm from './MiscConfigForm';

export default class ConfigForm extends React.PureComponent<{
    opened:boolean;
    onClose:Function;
}, {
    RecordType:string;
    Keywords:string;
    AnthemSinger:AnthemRecord|null;
    Peer:PeerRecord|null;
    Penalty:PenaltyRecord|null;
    Phase:PhaseRecord|null;
    Skater:SkaterRecord|null;
    Team:TeamRecord|null;
    Slideshow:SlideshowRecord|null;
    Video:VideoRecord|null;
}> {
    readonly state = {
        RecordType:'',
        Keywords:'',
        AnthemSinger:null,
        Peer:null,
        Penalty:null,
        Phase:null,
        Skater:null,
        Team:null,
        Slideshow:null,
        Video:null
    }

    constructor(props) {
        super(props);
        this.onKeyUpKeywords = this.onKeyUpKeywords.bind(this);
        this.onClickNewRecord = this.onClickNewRecord.bind(this);
        this.setRecordType = this.setRecordType.bind(this);
    }

    protected onKeyUpKeywords(ev: React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({Keywords:value});
    }

    protected setRecordType(type:string) {
        if(!type || type == this.state.RecordType)
            this.setState({RecordType:''});
        else
            this.setState({RecordType:type});
    }

    protected onClickNewRecord() {
        switch(this.state.RecordType) {
            case vars.RecordType.Anthem :
                this.setState({AnthemSinger:AnthemsController.NewRecord()});
            break;
            case vars.RecordType.Peer :
                this.setState({Peer:PeersController.NewRecord()});
            break;
            case vars.RecordType.Penalty :
                this.setState({Penalty:PenaltiesController.NewRecord()});
            break;
            case vars.RecordType.Phase :
                this.setState({Phase:PhasesController.NewRecord()});
            break;
            case vars.RecordType.Skater :
                this.setState({Skater:SkatersController.NewRecord()});
            break;
            case vars.RecordType.Team :
                this.setState({Team:TeamsController.NewRecord()});
            break;
            case vars.RecordType.Slideshow :
                this.setState({Slideshow:SlideshowsController.NewRecord()});
            break;
            case vars.RecordType.Video :
                this.setState({Video:VideosController.NewRecord()});
            break;

            default :

            break;
        }
    }

    render() {
        let active:boolean = false;
        if(this.state.AnthemSinger && this.state.RecordType == vars.RecordType.Anthem)
            active = true;

        let className:string = cnames('CFG-app', {
            active:active
        });
        let title:string = 'Configuration';
        switch(this.state.RecordType) {
            case vars.RecordType.Anthem : title = "Anthem Singers"; break;
            case vars.RecordType.Peer : title = "Network/Peers"; break;
            case vars.RecordType.Penalty : title = "Penalties"; break;
            case vars.RecordType.Phase : title = "Phase/Quarter"; break;
            case vars.RecordType.Skater : title = "Skaters"; break;
            case vars.RecordType.Slideshow : title = "Slideshows"; break;
            case vars.RecordType.Team : title = "Teams"; break;
            case 'SCOREBOARD' : title = "Scoreboard"; break;
            case 'API' : title = "RDMGR API"; break;
            case 'MISC' : title = "Misc. Config"; break;
        }
        
        return (
            <Panel
                opened={this.props.opened}
                contentName={className}
                className="CFG-app-panel"
                >
                <div className="forms">
                    <AnthemEditor
                        record={this.state.AnthemSinger}
                        opened={(this.state.RecordType == vars.RecordType.Anthem && this.state.AnthemSinger != null)}
                        onCancel={() => this.setState({AnthemSinger:null})}
                        />
                    <PeerEditor
                        record={this.state.Peer}
                        opened={(this.state.RecordType == vars.RecordType.Peer && this.state.Peer != null)}
                        onCancel={() => this.setState({Peer:null})}
                        />
                    <PenaltyEditor
                        record={this.state.Penalty}
                        opened={(this.state.RecordType == vars.RecordType.Penalty && this.state.Penalty != null)}
                        onCancel={() => this.setState({Penalty:null})}
                        />
                    <PhaseEditor
                        record={this.state.Phase}
                        opened={(this.state.RecordType == vars.RecordType.Phase && this.state.Phase != null)}
                        onCancel={() => this.setState({Phase:null})}
                        />
                    <SkaterEditor
                        record={this.state.Skater}
                        opened={(this.state.RecordType == vars.RecordType.Skater && this.state.Skater != null)}
                        onCancel={() => this.setState({Skater:null})}
                        />
                    <TeamEditor
                        record={this.state.Team}
                        opened={(this.state.RecordType == vars.RecordType.Team && this.state.Team != null)}
                        onCancel={() => this.setState({Team:null})}
                        />
                    <SlideshowEditor
                        record={this.state.Slideshow}
                        opened={(this.state.RecordType == vars.RecordType.Slideshow && this.state.Slideshow != null)}
                        onCancel={() => this.setState({Slideshow:null})}
                        />
                    <VideoEditor
                        record={this.state.Video}
                        opened={(this.state.RecordType == vars.RecordType.Video && this.state.Video != null)}
                        onCancel={() => this.setState({Video:null})}
                        />
                    <ConfigFormScoreboard
                        opened={(this.state.RecordType == 'SCOREBOARD')}
                        onCancel={() => this.setState({RecordType:''})}
                        onSubmit={() => this.setState({RecordType:''})}
                        />
                    <ConfirgFormAPI
                        opened={(this.state.RecordType == 'API')}
                        onCancel={() => this.setState({RecordType:''})}
                        onSubmit={() => this.setState({RecordType:''})}
                        />
                    <MiscConfigForm
                        opened={(this.state.RecordType == 'MISC')}
                        onCancel={() => this.setState({RecordType:''})}
                        onSubmit={() => this.setState({RecordType:''})}
                        />
                </div>
                <div className="sections">
                    <div className="title">
                        <div className="text">{title}</div>
                        <Icon
                            src={IconPlus}
                            onClick={this.onClickNewRecord}
                            title="New Record"
                            />
                    </div>
                    <div className="lists">
                        <AnthemRecordList
                            shown={(this.state.RecordType == vars.RecordType.Anthem)}
                            record={this.state.AnthemSinger}
                            onSelect={(record:AnthemRecord) => {this.setState({AnthemSinger:record})}}
                            keywords={this.state.Keywords}
                            />
                        <PeerRecordList
                            shown={(this.state.RecordType == vars.RecordType.Peer)}
                            record={this.state.Peer}
                            onSelect={(record:PeerRecord) => {this.setState({Peer:record})}}
                            keywords={this.state.Keywords}
                            />
                        <PenaltyRecordList
                            shown={(this.state.RecordType == vars.RecordType.Penalty)}
                            record={this.state.Penalty}
                            onSelect={(record:PenaltyRecord) => {this.setState({Penalty:record})}}
                            keywords={this.state.Keywords}
                            />
                        <PhaseRecordList
                            shown={(this.state.RecordType == vars.RecordType.Phase)}
                            record={this.state.Phase}
                            onSelect={(record:PhaseRecord) => {this.setState({Phase:record})}}
                            keywords={this.state.Keywords}
                            />
                        <SkaterRecordList
                            shown={(this.state.RecordType == vars.RecordType.Skater)}
                            record={this.state.Skater}
                            onSelect={(record:SkaterRecord) => {this.setState({Skater:record})}}
                            keywords={this.state.Keywords}
                            />
                        <SlideshowRecordList
                            shown={(this.state.RecordType == vars.RecordType.Slideshow)}
                            record={this.state.Slideshow}
                            onSelect={(record:SlideshowRecord) => {this.setState({Slideshow:record})}}
                            keywords={this.state.Keywords}
                            />
                        <TeamRecordList
                            shown={(this.state.RecordType == vars.RecordType.Team)}
                            record={this.state.Team}
                            onSelect={(record:TeamRecord) => {this.setState({Team:record})}}
                            keywords={this.state.Keywords}
                            />
                        <VideoRecordList
                            shown={(this.state.RecordType == vars.RecordType.Video)}
                            record={this.state.Video}
                            onSelect={(record:VideoRecord) => {this.setState({Video:record})}}
                            keywords={this.state.Keywords}
                            />
                    </div>
                    <div className="icons">
                        <Icon 
                            src={IconFlag}
                            title="Anthem Singers"
                            active={(this.state.RecordType == vars.RecordType.Anthem)}
                            onClick={() => this.setRecordType(vars.RecordType.Anthem)}
                            />
                        <Icon 
                            src={IconWhistle}
                            title="Penalties"
                            active={(this.state.RecordType == vars.RecordType.Penalty)}
                            onClick={() => this.setRecordType(vars.RecordType.Penalty)}
                            />
                        <Icon 
                            src={IconStopwatch}
                            title="Quarters/Phases"
                            active={(this.state.RecordType == vars.RecordType.Phase)}
                            onClick={() => this.setRecordType(vars.RecordType.Phase)}
                            />
                        <Icon 
                            src={IconSkater}
                            title="Skaters"
                            active={(this.state.RecordType == vars.RecordType.Skater)}
                            onClick={() => this.setRecordType(vars.RecordType.Skater)}
                            />
                        <Icon 
                            src={IconTeam}
                            title="Teams"
                            active={(this.state.RecordType == vars.RecordType.Team)}
                            onClick={() => this.setRecordType(vars.RecordType.Team)}
                            />
                        <Icon 
                            src={IconSlideshow}
                            title="Slideshows"
                            active={(this.state.RecordType == vars.RecordType.Slideshow)}
                            onClick={() => this.setRecordType(vars.RecordType.Slideshow)}
                            />
                        <Icon 
                            src={IconMovie}
                            title="Videos"
                            active={(this.state.RecordType == vars.RecordType.Video)}
                            onClick={() => this.setRecordType(vars.RecordType.Video)}
                            />
                        <Icon 
                            src={IconOffline}
                            title="Network/Peers"
                            active={(this.state.RecordType == vars.RecordType.Peer)}
                            onClick={() => this.setRecordType(vars.RecordType.Peer)}
                            />
                        <Icon 
                            src={IconSkate}
                            title="Scoreboard"
                            active={(this.state.RecordType == 'SCOREBOARD')}
                            onClick={() => this.setRecordType('SCOREBOARD')}
                            />
                        <Icon 
                            src={IconQueue}
                            title="API"
                            active={(this.state.RecordType == 'API')}
                            onClick={() => this.setRecordType('API')}
                            />
                        <Icon 
                            src={IconPalette}
                            title="Misc"
                            active={(this.state.RecordType == 'MISC')}
                            onClick={() => this.setRecordType('MISC')}
                            />
                    </div>
                    <div className="search">
                        <input type="text"
                            maxLength={30}
                            onChange={this.onKeyUpKeywords}
                            value={this.state.Keywords}
                            placeholder="Search..."
                            />
                    </div>
                </div>
            </Panel>
        );
    }
}