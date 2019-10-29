/**
 * Client/control form.
 */

import React from 'react'
import Panel from 'components/Panel'
import {
    Icon, 
    IconSkate,
    IconAV,
    IconWhistle,
    IconClipboard,
    IconTeam,
    IconChat,
    IconMonitor,
    IconSettings,
    IconShown,
    IconCapture,
    IconController,
    IconOffline,
    IconOnline
} from 'components/Elements';
import ClientScorebanner from './ClientScorebanner';
import cnames from 'classnames'

//controllers
import ClientController from 'controllers/ClientController';
import CameraController from 'controllers/CameraController';
import CaptureController from 'controllers/CaptureController';
import ChatController from 'controllers/ChatController';
import DataController from 'controllers/DataController';
import MediaQueueController from 'controllers/MediaQueueController';
import PenaltyController from 'controllers/PenaltyController';
import RaffleController from 'controllers/RaffleController';
import RosterController from 'controllers/RosterController';
import ScoreboardController from 'controllers/ScoreboardController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import SlideshowController from 'controllers/SlideshowController';
import SponsorController from 'controllers/SponsorController';
import VideoController from 'controllers/VideoController';

import GameController from 'controllers/GameController';

//inter-process communication
import IPCX from 'controllers/IPCX';

//components
import CaptureControl from 'components/apps/CaptureControl/CaptureControl';
import ChatForm from 'components/apps/ChatForm/ChatForm';
import ConfigForm from 'components/data/ConfigForm';
import MediaQueue from 'components/apps/MediaQueue/MediaQueue';
import PenaltyTracker from 'components/apps/PenaltyTracker/PenaltyTracker';
import Roster from 'components/apps/Roster/Roster';
import Scoreboard from 'components/apps/Scoreboard/Scoreboard';
import Scorekeeper from 'components/apps/Scorekeeper/Scorekeeper';
import ClientCaptureStatus from './ClientCaptureStatus';
import ClientDialog from './ClientDialog';
import CaptureDisplayButtons from 'components/apps/CaptureControl/CaptureDisplayButtons';

//style
import './css/Client.scss';

//utilities
import FileBrowser from 'components/tools/FileBrowser';
import {PeerRecordRequest} from 'components/data/PeerEditor';
import vars from 'tools/vars';
import keycodes from 'tools/keycodes';


/**
 * Component for the client control form.
 */
class Client extends React.PureComponent<any, {
    /**
     * Key code for current application
     */
    CurrentApplication:string;
    /**
     * Collection of applications controlled by peers
     */
    PeerApplications:any;
    ConnectedPeers:number;
    currentApp:any;
    /**
     * Determines if the client's panel is visible or not
     */
    shown:boolean;
    ConfigShown:boolean;
    ChatShown:boolean;
    FileBrowserShown:boolean;
    DisplayShown:boolean;
    ControlShown:boolean;
    RecordUpdateShown:boolean;
    RecordUpdatePeerID:string;
    RecordUpdatePeerName:string;
    RecordUpdateTypes:any;
    UnreadMessageCount:number;
    Peers:any;
}> {

    readonly state = {
        CurrentApplication:ClientController.getState().CurrentApplication,
        PeerApplications:{},
        ConnectedPeers:0,
        currentApp:{},
        shown:false,
        ConfigShown:false,
        ChatShown:false,
        FileBrowserShown:false,
        DisplayShown:false,
        ControlShown:false,
        RecordUpdateShown:false,
        RecordUpdatePeerID:'',
        RecordUpdatePeerName:'',
        RecordUpdateTypes:{},
        UnreadMessageCount:ClientController.getState().UnreadMessageCount,
        Peers:DataController.getPeers()
    }

    //Controllers:any
    Applications:any
    protected FileBrowserItem:React.RefObject<FileBrowser> = React.createRef();

    //remoteData:Function
    //remoteChat?:Function
    protected remoteClient:Function|null = null;

    constructor(props) {
        super(props);

        /*
        this.Controllers = {
            [CaptureController.Key]:CaptureController,
            [MediaQueueController.Key]:MediaQueueController,
            [ScoreboardController.Key]:ScoreboardController,
            [ScorekeeperController.Key]:ScorekeeperController,
            [PenaltyController.Key]:PenaltyController,
            [RaffleController.Key]:RaffleController,
            [RosterController.Key]:RosterController,
            [SlideshowController.Key]:SlideshowController,
            [SponsorController.Key]:SponsorController,
            [VideoController.Key]:VideoController
        }
        */

        this.Applications = {
            [ScoreboardController.Key]:{
                name:"Scoreboard",
                icon:IconSkate,
                type:Scoreboard,
                controller:ScoreboardController,
                key:ScoreboardController.Key,
                remote:'',
                ref:React.createRef()
            },
            [CaptureController.Key]:{
                name:"Capture Control",
                icon:IconMonitor,
                type:CaptureControl,
                controller:CaptureController,
                key:CaptureController.Key,
                remote:'',
                ref:React.createRef()
            },
            [PenaltyController.Key]:{
                name:'Penalty Tracker',
                icon:IconWhistle,
                type:PenaltyTracker,
                controller:PenaltyController,
                key:PenaltyController.Key,
                remote:'',
                ref:React.createRef()
            },
            [ScorekeeperController.Key]:{
                name:'Scorekeeper',
                icon:IconClipboard,
                type:Scorekeeper,
                controller:ScorekeeperController,
                key:ScorekeeperController.Key,
                remote:'',
                ref:React.createRef()
            },
            [RosterController.Key]:{
                name:'Roster',
                icon:IconTeam,
                type:Roster,
                controller:RosterController,
                key:RosterController.Key,
                remote:'',
                ref:React.createRef()
            },
            [MediaQueueController.Key]:{
                name:'Media Queue',
                icon:IconAV,
                type:MediaQueue,
                controller:MediaQueueController,
                key:MediaQueueController.Key,
                remote:'',
                ref:React.createRef()
            }
        };

        //this.state.currentApp = this.Applications[ScoreboardController.Key];

        // let defaultApp = DataController.GetMiscRecord('DefaultApp');
        // if(defaultApp !== null && this.Applications[defaultApp]) {
        //     this.state.currentApp = this.Applications[defaultApp];
        // }

        //this.FileBrowserItem = React.createRef();
        //this.DialogItem = React.createRef();

        //bindings
        //this.setApplication = this.setApplication.bind(this);
        this.showFileBrowser = this.showFileBrowser.bind(this);
        this.hideFileBrowser = this.hideFileBrowser.bind(this);
        //this.exit = this.exit.bind(this);
        //this.showDialog = this.showDialog.bind(this);
        
        //events
        this.onSelectFile = this.onSelectFile.bind(this);
        this.updateClient = this.updateClient.bind(this);
    }

    /**
     * Triggered when the user clicks the close button on the main window.
     */
    exit() {
        window.close();
    }

    /**
     * Displays a dialog to the user.
     * @param {Mixed} message 
     * @param {Function} confirm 
     * @param {Function} cancel 
     */
    showDialog(message, confirm, cancel) {
        //if(this.DialogItem && this.DialogItem.current) {
        //    this.DialogItem.current.show(message, confirm, cancel);
        //}
    }

    /**
     * Triggered when a peer sends data.
     * @param {RemotePeer} peer 
     * @param {Object} data 
     */
    onPeerData(peer, data) {
        /*
        switch(data.type) {
            //update the state of a controller
            case 'state' :
                let record = DataController.getPeer(peer.ID);
                if(record && record.ControlledApps && record.ControlledApps.indexOf(data.app) >= 0) {
                    if(this.Controllers[data.app] && this.Controllers[data.app].SetState) {
                        this.Controllers[data.app].SetState(data.state);
                    }
                }
            break;

            //Send state to peer.
            case 'request-state' :
                if(this.Controllers[data.app] && this.Controllers[data.app].getState) {
                    window.LocalServer.SendState(peer.ID, this.Controllers[data.app].getState);
                }
            break;

            //Disconnect peer
            case 'disconnect' :
                window.LocalServer.LocalPeer.disconnectPeer(peer.ID);
            break;

            //Show request to update local peer's records with remote peer's records.
            case 'set-record-request' :
                this.setState(() => {
                    return {
                        RecordUpdateShown:true,
                        RecordUpdatePeerID:peer.ID,
                        RecordUpdateTypes:Object.assign({}, data.types)
                    }
                });
            break;

            //Send records back to the peer.
            case 'get-records' :
                if(data.types) {
                    let records = {};

                    //Skaters
                    if(data.types[vars.RecordType.Skater])
                        records[vars.RecordType.Skater] = DataController.getSkaters(true);
                        
                    //Teams
                    if(data.types[vars.RecordType.Team])
                        records[vars.RecordType.Team] = DataController.getTeams(true);

                    //Phases
                    if(data.types[vars.RecordType.Phase])
                        records[vars.RecordType.Phase] = DataController.getPhases();

                    //Penalties
                    if(data.types[vars.RecordType.Penalty])
                        records[vars.RecordType.Penalty] = DataController.getPenalties(true);

                    //Anthem Singers
                    if(data.types[vars.RecordType.Anthem])
                        records[vars.RecordType.Anthem] = DataController.getAnthemSingers(true);

                    window.LocalServer.SendData(peer.ID, {
                        type:'set-records',
                        records:records
                    });
                }
            break;

            //receive records from the peer
            case 'set-records' :
                if(data.records) {
                    //skaters
                    if(data.records[vars.RecordType.Skater]) {
                        DataController.UpdateRecords(vars.RecordType.Skater, data.records[vars.RecordType.Skater]);
                    }
                    
                    //teams
                    if(data.records[vars.RecordType.Team]) {
                        DataController.UpdateRecords(vars.RecordType.Team, data.records[vars.RecordType.Team]);
                    }
    
                    //penalties
                    if(data.records[vars.RecordType.Penalty]) {
                        DataController.UpdateRecords(vars.RecordType.Penalty, data.records[vars.RecordType.Penalty]);
                    }
    
                    //phases
                    if(data.records[vars.RecordType.Phase]) {
                        DataController.UpdateRecords(vars.RecordType.Phase, data.records[vars.RecordType.Phase]);
                    }
    
                    //anthem singers
                    if(data.records[vars.RecordType.Anthem]) {
                        DataController.UpdateRecords(vars.RecordType.Anthem, data.records[vars.RecordType.Anthem]);
                    }
                }
            break;

            //Chat Message
            case 'chat-message' :
                data.message.self = false;
                data.message.read = this.state.ChatShown;
                ChatController.AddMessage(data.message);
            break;

            default :
            break;
        }
        */
    }

    /**
     * Updates the state to match the chat controller.
     */
    updateChat() {
        // this.setState(() => {
        //     return {UnreadMessageCount:ChatController.GetUnreadMessageCount()};
        // });
    }

    /**
     * Updates the
     */
    updateData() {
        /*
        let peers = DataController.getPeers();
        if(!DataController.compare(peers, this.state.Peers)) {
            for(let akey in this.Applications) {
                let app = this.Applications[akey];
                app.remote = '';
                for(let pkey in peers) {
                    let peer = peers[pkey];
                    if(peer.Host === '127.0.0.1')
                        continue;
                    if(app.remote === '' && peer.ControlledApps && peer.ControlledApps.indexOf(akey) >= 0) {
                        app.remote = peer.PeerID;
                        console.log(`change: ${akey}:${peer.PeerID}`);
                    }
                }
            }

            this.setState(() => {
                return {Peers:Object.assign({}, peers)};
            });
        }
        */
    }

    /**
     * Triggered when the ClientController updates
     * - 
     */
    updateClient() {
        let state = ClientController.getState();
        //return;
        this.setState(() => {
            return {
                CurrentApplication:state.CurrentApplication,
                UnreadMessageCount:state.UnreadMessageCount,
                PeerApplications:state.PeerApplications,
                //ConnectedPeers:state.ConnectedPeers
            }
        });
    }

    /**
     * Triggered when a user selects a file from the file browser.
     * @param {String} filename 
     */
    onSelectFile(filename) {
        this.hideFileBrowser();
        if(window.onSelectFile && typeof(window.onSelectFile) === "function") {
            window.onSelectFile(filename);
        }
    }

    /**
     * Shows the file browser.
     */
    showFileBrowser() {
        //this.setState(() => {return {FileBrowserShown:true}});
    }

    /**
     * Hides the file browser.
     */
    hideFileBrowser() {
        //this.setState(() => {return {FileBrowserShown:false}});
    }

    /**
     * Triggered when the component mounts to the DOM
     * - Load the data files.
     * - Add global event listeners for keyup, gamepad
     */
    componentDidMount() {
        if(ClientController.Init !== undefined) {
            ClientController.Init();
            this.remoteClient = ClientController.subscribe(this.updateClient);
        }

        //Show the component
        this.setState(() => {
            return {
                shown:true,
                CurrentApplication:ClientController.getState().CurrentApplication
            };
        }, () => {
            CaptureController.Init();
            GameController.Init();
        });
    }

    /**
     * Triggered when the component will unmount from the DOM
     */
    componentWillUnmount() {
        if(this.remoteClient !== null) {
            this.remoteClient();
        }
    }

    /**
     * Renders the component.
     */
    render() {
        const appicons:Array<React.ReactElement> = [];
        const apps:Array<React.ReactElement> = [];
        for(let key in this.Applications) {
            let app = this.Applications[key];
            let remote = '';
            let title:string = app.name;
            if(this.state.PeerApplications && this.state.PeerApplications[key]) {
                remote = this.state.PeerApplications[key];
                title = `${app.name} (${remote})`;
            }
            let panel = <app.type 
                key={key} 
                opened={(this.state.CurrentApplication === key)}
                ref={app.ref}
                remote={remote}
                apps={(app === this.Applications.NET) ? this.Applications : []}
                />
            apps.push(panel);
            appicons.push(
                <Icon
                    src={app.icon}
                    key={`${key}-app`}
                    className={cnames({active:(key === this.state.CurrentApplication)})}
                    title={title}
                    onClick={() => {
                        ClientController.SetApplication(key);
                        this.setState({ConfigShown:false});
                    }}
                    />
            );
        }

        let iconConnection = IconOffline;
        if(this.state.ConnectedPeers > 0)
            iconConnection = IconOnline;

        const recordicons = [
            <Icon
                src={iconConnection}
                key="btn-network"
                title="Connect"
                onClick={ClientController.ConnectPeers}/>,
            <Icon
                src={IconCapture}
                key="btn-display"
                title="Display Options"
                onClick={() => {
                    this.setState((state) => {
                        return {DisplayShown:!state.DisplayShown}
                    });
                }}/>,
            <Icon
                src={IconChat}
                key="btn-chat"
                attention={(this.state.UnreadMessageCount >= 1)}
                title={`${this.state.UnreadMessageCount} unread messages.`}
                onClick={() => {
                    this.setState((state) => {
                        return {ChatShown:!state.ChatShown}
                    });
                }}/>,
            <Icon
                src={IconSettings}
                key="btn-settings"
                title="Configuration"
                onClick={() => {
                    this.setState({ConfigShown:!this.state.ConfigShown})
                }}
            />
        ];

        const buttons = [
            <div className="app-buttons" key="app-buttons">{appicons}</div>,
            <ClientCaptureStatus key="capture-status"/>,
            <div className="record-buttons" key="record-buttons">{recordicons}</div>
        ];
    
        return (
          <Panel
            buttons={buttons}
            className="client"
            contentName="control-app"
            title={<ClientScorebanner/>}
            opened={this.state.shown}
            onClose={ClientController.Exit}
            >
                {apps}
                <ChatForm
                    opened={this.state.ChatShown}
                    onClose={() => {this.setState({ChatShown:false});}}
                    />
                <FileBrowser
                    opened={this.state.FileBrowserShown}
                    ref={this.FileBrowserItem}
                    onSelect={this.onSelectFile}
                    onClose={() => {
                        this.setState({FileBrowserShown:false});
                    }}
                    />
                <ConfigForm 
                    opened={this.state.ConfigShown}
                    onClose={() => {this.setState({ConfigShown:false});}}
                    />
                <PeerRecordRequest
                    name={this.state.RecordUpdatePeerName}
                    opened={this.state.RecordUpdateShown}
                    id={this.state.RecordUpdatePeerID}
                    message={`${this.state.RecordUpdatePeerID} wants to update your records. 
                        Choose which records to update, or click Cancel to ignore the request.`}
                    types={this.state.RecordUpdateTypes}
                    method='get-records'
                    onClose={() => {
                        this.setState({RecordUpdateShown:false});
                    }}
                />
                <Panel 
                    popup={true} 
                    opened={this.state.DisplayShown} 
                    title="Display Options"
                    className="display-options"
                    onClose={() => {this.setState({DisplayShown:false})}}
                    >
                    <div className="record-list">
                        <CaptureDisplayButtons/>
                    </div>
                </Panel>
          </Panel>
        );
    }
}

export default Client;