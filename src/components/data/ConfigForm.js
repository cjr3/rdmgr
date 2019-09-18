import React from 'react';
import cnames from 'classnames';
import vars from 'tools/vars';
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

import './css/ConfigForm.scss';
import RecordList from './RecordList';

/**
 * Component for configuring network, accessing records,
 * and user settings.
 */
class ConfigForm extends React.PureComponent {
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
            /*
            [vars.RecordType.Sponsor]:{
                type:ConfigPanelSponsors,
                name:"Sponsors",
                icon:IconSlideshow
            },*/
            [vars.RecordType.Peer]:{
                type:ConfigPanelPeers,
                form:PeerEditor,
                icon:IconOffline,
                name:"Network",
                record:null
            }
        };

        this.state = {
            currentApp:this.Applications[vars.RecordType.Peer]
        };
    }

    /**
     * Triggered when the user cancels the editing of a record.
     */
    onCancelRecord() {
        if(this.state.currentApp)
            this.state.currentApp.record = null;
        this.forceUpdate();
    }

    /**
     * Renders the component.
     * - Left side: current panel
     * - Right side: list of sections, accordion
     */
    render() {
        var sections = [];
        var forms = [];
        for(let key in this.Applications) {
            let app = this.Applications[key];
            let current = (this.state.currentApp === app);
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
                        return {currentApp:app};
                    }, () => {
                        this.forceUpdate();
                    });
                }}
                onClick={() => {
                    this.setState(() => {
                        return {currentApp:app}
                    }, () => {
                        this.forceUpdate();
                    });
                }}
                />
            forms.push( form );
            sections.push( section );
        }

        return (
            <Panel
                opened={this.props.opened}
                contentName="CFG-app"
            >
                <div className="forms">{forms}</div>
                <div className="sections">{sections}</div>
            </Panel>
        );
    }
}

/**
 * Component to list options / records for a section.
 */
class ConfigFormSection extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    /**
     * Renders the component.
     * - Section
     * - Main Button
     * - Additional icons
     * - Children
     */
    render() {
        return (
            <div className={cnames('section', {
                shown:(this.props.active)
            })}>
                <div className="section-header">
                    <IconButton
                        src={this.props.icon}
                        active={this.props.active}
                        onClick={this.props.onClick}
                        >{this.props.name}</IconButton>
                    {this.props.icons}
                </div>
                {this.props.children}
            </div>
        )
    }
}

/**
 * Component for listing national anthem singer records.
 */
class ConfigPanelAnthem extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getAnthemSingers(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var singers = DataController.getAnthemSingers(true);
        if(!DataController.compare(singers, this.state.Records)) {
            this.setState(() => {
                return {Records:singers}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
class ConfigPanelPenalty extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getPenalties(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getPenalties(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
class ConfigPanelPhase extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getPhases()
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getPhases();
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
                    sortable={true}
                    />
            </ConfigFormSection>
        )
    }
}

/**
 * Component to select and create/edit skaters.
 */
class ConfigPanelSkaters extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getSkaters(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getSkaters(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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

class ConfigPanelTeams extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getTeams(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getTeams(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
class ConfigPanelSlideshows extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getSlideshows(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getSlideshows(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
class ConfigPanelVideos extends React.PureComponent {
    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getVideos(true)
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getVideos(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
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
class ConfigPanelPeers extends React.PureComponent {

    constructor(props) {
        super( props );
        this.state = {
            Records:DataController.getPeers(true),
            Peers:{}
        }

        this.updateData = this.updateData.bind(this);
        this.remoteData = DataController.subscribe(this.updateData);

        this.updateLocalServer = this.updateLocalServer.bind(this);
    }

    /**
     * Updates the state to match the server controller.
     */
    updateLocalServer() {
        this.setState(() => {
            return {
                Peers:Object.assign({}, window.LocalServer.getState().Peers)
            }
        });
    }

    /**
     * Updates the state to match the data controller.
     * - List national anthem singer records.
     */
    updateData() {
        var records = DataController.getPeers(true);
        if(!DataController.compare(records, this.state.Records)) {
            this.setState(() => {
                return {Records:records}
            });
        }
    }

    /**
     * Triggered when the component mounts to the DOM.
     * - Wait for the local server to be ready, and then update the peer records.
     */
    componentDidMount() {
        let timer = setInterval(() => {
            if(window && window.LocalServer) {
                window.LocalServer.subscribe(this.updateLocalServer);
                this.updateData();
                clearInterval(timer);
            }
        }, 1000);
    }

    /**
     * Renders the component.
     */
    render() {
        var icons = [
            <Icon
                key="btn-new"
                src={IconPlus}
                active={(this.props.record && this.props.record.RecordID === 0)}
                onClick={() => {
                    this.props.onSelect(DataController.getNewRecord(vars.RecordType.Peer))
                }}
                />
        ];

        var peers = [];
        this.state.Records.forEach((record) => {
            let iconConnection = IconOffline;
            let iconStream = IconStreamOff;
            let datatime = 0;
            if(this.state.Peers && this.state.Peers[record.PeerID]) {
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
                        active={(this.props.record && this.props.record.RecordID == record.RecordID)}
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

export default ConfigForm;