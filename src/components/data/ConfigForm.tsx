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
    Button,
    IconButton,
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
    IconStreamOff,
    IconOnline,
    IconStreamOn
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
import DataController from 'controllers/DataController';
import RecordList from './RecordList';

import './css/ConfigForm.scss';

/**
 * Component for configuring network, accessing records,
 * and user settings.
 */
export default class ConfigForm extends React.PureComponent<any, {
    /**
     * Selected configuration app / recordset
     */
    currentApp:string;
}> {
    readonly state = {
        currentApp:''
    }

    /**
     * Applications / Record sets
     */
    protected Applications:any = {}

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onCancelRecord = this.onCancelRecord.bind(this);
        this.Applications = {
            [vars.RecordType.Anthem]:{
                type:ConfigPanelAnthem,
                form:AnthemEditor,
                name:"Anthem Singers",
                icon:IconFlag,
                record:null
            },
            [vars.RecordType.Penalty]:{
                type:ConfigPanelPenalty,
                form:PenaltyEditor,
                name:"Penalties",
                icon:IconWhistle,
                record:null
            },
            [vars.RecordType.Phase]:{
                type:ConfigPanelPhase,
                form:PhaseEditor,
                name:"Quarters",
                icon:IconStopwatch,
                record:null
            },
            [vars.RecordType.Skater]:{
                type:ConfigPanelSkaters,
                form:SkaterEditor,
                name:"Skaters",
                icon:IconSkater,
                record:null
            },
            [vars.RecordType.Team]:{
                type:ConfigPanelTeams,
                form:TeamEditor,
                name:"Teams",
                icon:IconTeam,
                record:null
            },
            [vars.RecordType.Slideshow]:{
                type:ConfigPanelSlideshows,
                name:"Slideshows",
                form:SlideshowEditor,
                icon:IconSlideshow,
                record:null
            },
            [vars.RecordType.Video]:{
                type:ConfigPanelVideos,
                name:"Videos",
                icon:IconMovie,
                form:VideoEditor,
                record:null
            },
            [vars.RecordType.Peer]:{
                type:ConfigPanelPeers,
                form:PeerEditor,
                icon:IconOffline,
                name:"Network",
                record:null
            }
        }
    }

    /**
     * Triggered when the user cancels the editing of a record.
     */
    onCancelRecord() {
        if(this.Applications[this.state.currentApp]) {
            this.Applications[this.state.currentApp].record = null;
            this.forceUpdate();
        }
    }

    /**
     * Renders the component.
     * - Left side: current panel
     * - Right side: list of sections, accordion
     */
    render() {
        let sections:Array<React.ReactElement> = [];
        let forms:Array<React.ReactElement> = [];
        for(let key in this.Applications) {
            let app = this.Applications[key];
            let current = (this.state.currentApp === key);
            let form = <app.form
                key={key}
                opened={(current)}
                record={app.record}
                onCancel={this.onCancelRecord}
                onClose={() => {
                    if(this.props.onClose)
                        this.props.onClose();
                }}
            />

            let section = <app.type
                key={key}
                icon={app.icon}
                name={app.name}
                active={(current)}
                record={app.record}
                onSelect={(record) => {
                    app.record = record;
                    this.setState(() => {
                        return {currentApp:key};
                    }, () => {
                        this.forceUpdate();
                    });
                }}
                onClick={() => {
                    this.setState(() => {
                        return {currentApp:key}
                    }, () => {
                        this.forceUpdate();
                    });
                }}
                />
            forms.push( form );
            sections.push( section );
        }

        let className:string = cnames('CFG-app', {
            record:(this.Applications[this.state.currentApp] !== undefined && this.Applications[this.state.currentApp].record !== null)
        });

        return (
            <Panel
                opened={this.props.opened}
                contentName={className}
                >
                <div className="forms">{forms}</div>
                <div className="sections">{sections}</div>
            </Panel>
        );
    }
}

interface PConfigFormSection {
    active:boolean,
    icon:string,
    name:string,
    onClick:Function,
    icons?:Array<React.ReactElement>,
    children:any
}

/**
 * Component for a section on the config form
 * @param props PConfigmFormSection
 */
function ConfigFormSection(props:PConfigFormSection) {
    return (
        <div className={cnames('section', {
            shown:(props.active)
        })}>
            <div className="section-header">
                <IconButton
                    src={props.icon}
                    active={props.active}
                    onClick={props.onClick}
                    >{props.name}</IconButton>
                {props.icons}
            </div>
            {props.children}
        </div>
    );
}

/**
 * Component for listing national anthem singer records.
 */
class ConfigPanelAnthem extends React.PureComponent<any, {
    /**
     * Records to select from
     */
    Records:Array<AnthemRecord>
}> {
    readonly state = {
        Records:DataController.getAnthemSingers(true)
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getAnthemSingers(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Anthem))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component for selecting penalty records
 */
class ConfigPanelPenalty extends React.PureComponent<any, {
    Records:Array<PenaltyRecord>
}> {
    readonly state = {
        Records:DataController.getPenalties(true)
    }
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getPenalties(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Penalty))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component for listing phases to create and edit.
 */
class ConfigPanelPhase extends React.PureComponent<any, {
    Records:Array<PhaseRecord>
}> {
    readonly state = {
        Records:DataController.getPhases()
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getPhases()});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Phase))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component to select and create/edit skaters.
 */
class ConfigPanelSkaters extends React.PureComponent<any, {
    Records:Array<SkaterRecord>
}> {
    readonly state = {
        Records:DataController.getSkaters(true)
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getSkaters(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Skater))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

class ConfigPanelTeams extends React.PureComponent<any, {
    Records:Array<TeamRecord>
}> {
    readonly state = {
        Records:DataController.getTeams(true)
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getTeams(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Team))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * 
 */
class ConfigPanelSlideshows extends React.PureComponent<any, {
    Records:Array<SlideshowRecord>
}> {
    readonly state = {
        Records:DataController.getSlideshows(true)
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getSlideshows(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Slideshow))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component to add/edit video records.
 */
class ConfigPanelVideos extends React.PureComponent<any, {
    Records:Array<VideoRecord>
}> {
    readonly state = {
        Records:DataController.getVideos(true)
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getVideos(true)});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Video))
                }}
                />
        ];

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <RecordList
                    onSelect={this.props.onSelect}
                    recordid={(this.props.record) ? this.props.record.RecordID : 0}
                    records={this.state.Records}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component to add/edit peer records.
 */
class ConfigPanelPeers extends React.PureComponent<any, {
    Records:Array<PeerRecord>,
    Peers:any
}> {
    readonly state = {
        Records:DataController.getPeers(true),
        Peers:{}
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Listener for peer server
     * - Helps with displaying connection status
     */
    protected remoteServer:Function|null = null;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super( props );
        this.updateData = this.updateData.bind(this);
        this.updateLocalServer = this.updateLocalServer.bind(this);
    }

    /**
     * Updates the state to match the server controller.
     */
    updateLocalServer() {
        this.setState({
            Peers:Object.assign({}, window.LocalServer.getState().Peers)
        });
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        this.setState({Records:DataController.getPeers(true)});
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Wait for the local server to be ready, and then update the peer records.
     */
    componentDidMount() {
        this.remoteData = DataController.subscribe(this.updateData);
        let timer = window.setInterval(() => {
            if(window && window.LocalServer) {
                window.LocalServer.subscribe(this.updateLocalServer);
                this.updateData();
                clearInterval(timer);
            }
        }, 1000);
    }

    /**
     * Stop listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
        if(this.remoteServer !== null)
            this.remoteServer();
    }

    /**
     * Renders the component.
     */
    render() {
        let icons:Array<React.ReactElement> = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Peer))
                }}
                />
        ];

        let peers:Array<React.ReactElement> = [];
        this.state.Records.forEach((record) => {
            let iconConnection = IconOffline;
            let iconStream = IconStreamOff;
            let datatime = 0;
            if(this.state.Peers && record.PeerID !== undefined && this.state.Peers[record.PeerID]) {
                let peer = this.state.Peers[record.PeerID];
                datatime = peer.DataConnectionTime;
                if(peer.Connected)
                    iconConnection = IconOnline;
                if(peer.MediaConnected)
                    iconStream = IconStreamOn;
            }

            peers.push(
                <div 
                    key={`${record.RecordType}-${record.RecordID}`}
                    className="peer-item"
                    >
                    <Button
                        active={(this.props.record && this.props.record.RecordID === record.RecordID)}
                        onClick={() => {
                            this.props.onSelect(record);
                        }}
                        >{record.Name}</Button>
                    <Icon
                        src={iconConnection}
                        datatime={datatime}
                        onClick={() => {
                            if(record.Host !== '127.0.0.1') {
                                window.LocalServer.ConnectToPeer(record.PeerID);
                            }
                        }}
                        />
                    <Icon
                        src={iconStream}
                        onClick={() => {
                            if(record.Host !== '127.0.0.1') {
                                //window.LocalServer.ConnectToPeer(record.PeerID);
                            }
                        }}
                        />
                </div>
            )
        });

        return (
            <ConfigFormSection
                active={this.props.active}
                icon={this.props.icon}
                name={this.props.name}
                onClick={this.props.onClick}
                icons={icons}
            >
                <div className="record-list">
                    {peers}
                </div>
            </ConfigFormSection>
        )
    }
}