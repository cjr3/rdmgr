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
    IconCapture
} from 'components/Elements';
import ClientScorebanner from './ClientScorebanner';
import cnames from 'classnames'

//controllers
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

//applications
import CaptureControl from 'components/apps/CaptureControl/CaptureControl';
import ChatForm from 'components/apps/ChatForm/ChatForm';
import ConfigForm from 'components/data/ConfigForm';
import MediaQueue from 'components/apps/MediaQueue/MediaQueue';
import PenaltyTracker from 'components/apps/PenaltyTracker/PenaltyTracker';
import Roster from 'components/apps/Roster/Roster';
import Scoreboard from 'components/apps/Scoreboard/Scoreboard';
import Scorekeeper from 'components/apps/Scorekeeper/Scorekeeper';
import ClientCaptureStatus from './ClientCaptureStatus';

//style
import './css/Client.scss';

//utilities
import FileBrowser from 'components/tools/FileBrowser';
import ClientDialog from './ClientDialog';
import {PeerRecordRequest} from 'components/data/PeerEditor';
import vars from 'tools/vars';
import CaptureDisplayButtons from 'components/apps/CaptureControl/CaptureDisplayButtons';
import keycodes from 'tools/keycodes';

interface SClient {
    currentApp:any,
    visible:boolean,
    ConfigShown:boolean,
    ChatShown:boolean,
    FileBrowserShown:boolean,
    DisplayShown:boolean,
    RecordUpdateShown:boolean,
    RecordUpdatePeerID:string,
    RecordUpdatePeerName:string,
    RecordUpdateTypes:any,
    UnreadMessageCount:number,
    Peers:any
}

/**
 * Component for the client control form.
 */
class Client extends React.PureComponent<any, SClient> {

    readonly state:SClient = {
        currentApp:{},
        visible:false,
        ConfigShown:false,
        ChatShown:false,
        FileBrowserShown:false,
        DisplayShown:false,
        RecordUpdateShown:false,
        RecordUpdatePeerID:'',
        RecordUpdatePeerName:'',
        RecordUpdateTypes:{},
        UnreadMessageCount:0,
        Peers:DataController.getPeers()
    }

    Controllers:any
    Applications:any
    FileBrowserItem:React.RefObject<FileBrowser>
    DialogItem:React.RefObject<ClientDialog>

    remoteData:Function
    remoteChat?:Function

    constructor(props) {
        super(props);

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

        this.state.currentApp = this.Applications[ScoreboardController.Key];

        let defaultApp = DataController.GetMiscRecord('DefaultApp');
        if(defaultApp !== null && this.Applications[defaultApp]) {
            this.state.currentApp = this.Applications[defaultApp];
        }

        this.FileBrowserItem = React.createRef();
        this.DialogItem = React.createRef();

        //bindings
        this.setApplication = this.setApplication.bind(this);
        this.showFileBrowser = this.showFileBrowser.bind(this);
        this.hideFileBrowser = this.hideFileBrowser.bind(this);
        this.exit = this.exit.bind(this);
        this.showDialog = this.showDialog.bind(this);
        
        //events
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onPeerData = this.onPeerData.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);

        //subscribers
        this.updateData = this.updateData.bind(this);
        this.updateChat = this.updateChat.bind(this);

        this.remoteData = DataController.subscribe(this.updateData);

        for(let akey in this.Applications) {
            let app = this.Applications[akey];
            app.remote = '';
            for(let pkey in this.state.Peers) {
                let peer = this.state.Peers[pkey];
                if(peer.Host === '127.0.0.1')
                    continue;
                if(app.remote === '' && peer.ControlledApps && peer.ControlledApps.indexOf(akey) >= 0) {
                    app.remote = peer.PeerID;
                }
            }
        }
    }

    /**
     * Sets the current application.
     * @param {Object} app 
     */
    setApplication(app) {
        this.setState(() => {
          return {currentApp:app};
        }, () => {
            DataController.SaveMiscRecord('DefaultApp', this.state.currentApp.key);
            GameController.Receiver = this.state.currentApp;
        });
    }

    /**
     * Handles keyboard events for the client / control window.
     * 
     * Input is passed to the current app's controller, unless
     * the cursor is focused on a text entry field.
     * @param {KeyEvent} ev 
     */
    onKeyUp(ev) {
        var name = ev.target.tagName.toLowerCase();
        switch(name) {
            case 'input' :
                if(ev.target.type === 'text' || ev.target.type === 'password' || ev.target.type === 'number') {

                    return;
                }
                break;

            case 'textarea' :
            case 'select' :
                return true;

            default :

            break;
        }
        
        //global keyup options - do not map these to controllers
        switch(ev.keyCode) {
            //ignore when windows/super/meta key is held down
            case keycodes.RWINDOW :
            case keycodes.LWINDOW : {
                return;
            }
            break;

            //toggle current applications display
            case keycodes.ESCAPE : {
                switch(this.state.currentApp.key) {
                    //Main Scoreboard
                    case ScoreboardController.Key : {
                        CaptureController.ToggleScoreboard();
                    }
                    break;

                    //Scorebanner
                    case CaptureController.Key : {
                        if(ev.ctrlKey)
                            CaptureController.ToggleScoreboard();
                        else
                            CaptureController.ToggleScorebanner();
                    }
                    break;

                    //Penalty Tracker
                    case PenaltyController.Key : {
                        CaptureController.TogglePenaltyTracker();
                    }
                    break;

                    //Scorekeeper
                    case ScorekeeperController.Key : {
                        CaptureController.ToggleScorekeeper();
                    }
                    break;

                    //Roster
                    case RosterController.Key : {
                        CaptureController.ToggleRoster();
                    }
                    break;

                    default : break;
                }
                return;
            }
            break;

            //Main Scoreboard
            case keycodes.F1 : {
                this.setState({
                    currentApp:this.Applications[ScoreboardController.Key]
                });
                return;
            }
            break;

            //Capture Controller
            case keycodes.F2 : {
                this.setState({
                    currentApp:this.Applications[CaptureController.Key]
                });
                return;
            }
            break;

            //Penalty Tracker 
            case keycodes.F3 : {
                this.setState({
                    currentApp:this.Applications[PenaltyController.Key]
                });
                return;
            }
            break;

            //Scorekeeper 
            case keycodes.F4 : {
                this.setState({
                    currentApp:this.Applications[ScorekeeperController.Key]
                });
                return;
            }
            break;

            //Roster
            case keycodes.F5 : {
                this.setState({
                    currentApp:this.Applications[RosterController.Key]
                });
                return;
            }
            break;

            //Media Queue
            case keycodes.F6 : {
                this.setState({
                    currentApp:this.Applications[MediaQueueController.Key]
                });
                return;
            }
            break;

            case keycodes.F12 : {
                let state = CaptureController.getState();
                if(state.Raffle.Shown) {
                    CaptureController.ToggleRaffle();
                } else {
                    this.setState({
                        currentApp:this.Applications[MediaQueueController.Key]
                    }, () => {
                        CaptureController.ToggleRaffle();
                        if(this.Applications[MediaQueueController.Key].ref !== null 
                            && this.Applications[MediaQueueController.Key].ref.current !== null ) {
                            this.Applications[MediaQueueController.Key].ref.current.setState({
                                recordset:''
                            }, () => {
                                this.Applications[MediaQueueController.Key].ref.current.RaffleItem.current.TicketItem.current.focus();
                            });
                        }
                    });
                }
                return;
            }
            break;

            //fullscreen - ignore
            case keycodes.F11 : {
                return;
            }
            break;

            //Open Chat
            case keycodes.F9 : {
                this.setState({ChatShown:true});
                return;
            }
            break;

            default : break;
        }

        //send key commands to the active application
        if(this.state.currentApp.controller && this.state.currentApp.controller.onKeyUp)
            this.state.currentApp.controller.onKeyUp(ev);
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
        if(this.DialogItem && this.DialogItem.current) {
            this.DialogItem.current.show(message, confirm, cancel);
        }
    }

    /**
     * Triggered when a peer sends data.
     * @param {RemotePeer} peer 
     * @param {Object} data 
     */
    onPeerData(peer, data) {
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
    }

    /**
     * Updates the state to match the chat controller.
     */
    updateChat() {
        this.setState(() => {
            return {UnreadMessageCount:ChatController.GetUnreadMessageCount()};
        });
    }

    /**
     * Updates the
     */
    updateData() {
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
        this.setState(() => {return {FileBrowserShown:true}});
    }

    /**
     * Hides the file browser.
     */
    hideFileBrowser() {
        this.setState(() => {return {FileBrowserShown:false}});
    }

    /**
     * Triggered when the component mounts to the DOM
     * - Load the data files.
     * - Add global event listeners for keyup, gamepad
     */
    componentDidMount() {
        if(window) {
            window.client = this;
        }

        if(window && window.RDMGR && window.RDMGR.mainWindow) {
            window.RDMGR.mainWindow.setTitle('RDMGR : Control Window');
            document.body.className = 'client';

            //setup IPC renderer if there is a capture window.
            if(window.RDMGR.captureWindow) {
                window.IPC = new IPCX('controlMessage', 'captureMessage', window.RDMGR.captureWindow);
            }
        }

        ScoreboardController.subscribe(() => {
            var cstate = Object.assign({}, ScoreboardController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:ScoreboardController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(ScoreboardController.Key, cstate);
            }
        });
        
        //Capture Controller
        CaptureController.subscribe(() => {
            var state = Object.assign({}, CaptureController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:CaptureController.Key,
                    state:state
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(CaptureController.Key, state);
            }
        });

        //Slideshow Controller
        SlideshowController.subscribe(() => {
            var cstate = Object.assign({}, SlideshowController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:SlideshowController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(SlideshowController.Key, cstate);
            }
        });

        //Video Controller
        VideoController.subscribe(() => {
            var state = Object.assign({}, VideoController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:VideoController.Key,
                    state:state
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(VideoController.Key, state);
            }
        });

        //Raffle
        RaffleController.subscribe(() => {
            var cstate = Object.assign({}, RaffleController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:RaffleController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(RaffleController.Key, cstate);
            }
        });

        //Sponsor Controller
        SponsorController.subscribe(() => {
            var cstate = Object.assign({}, SponsorController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:SponsorController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(SponsorController.Key, cstate);
            }
        });
        
        //Penalty Tracker
        PenaltyController.subscribe(() => {
            var cstate = Object.assign({}, PenaltyController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:PenaltyController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(PenaltyController.Key, cstate);
            }
        });
        
        //Scorekeeper
        ScorekeeperController.subscribe(() => {
            var cstate = Object.assign({}, ScorekeeperController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:ScorekeeperController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(ScorekeeperController.Key, cstate);
            }
        });

        //Roster Controller
        RosterController.subscribe(() => {
            var cstate = Object.assign({}, RosterController.getState());
            if(window && window.IPC) {
                window.IPC.send({
                    type:'state',
                    app:RosterController.Key,
                    state:cstate
                });
            }

            if(window && window.LocalServer) {
                window.LocalServer.SendState(RosterController.Key, cstate);
            }
        });

        //Camera Controller
        if(window && window.IPC) {
            CameraController.subscribe(() => {
                window.IPC.send({
                    type:'state',
                    app:CameraController.Key,
                    state:CameraController.getState()
                });
            });
        }

        //subscribe to chat
        this.remoteChat = ChatController.subscribe(this.updateChat);

        window.addEventListener('keyup', this.onKeyUp);
        window.initControlServer(DataController);
        if(window.LocalServer) {
            window.LocalServer.onDataReceived = this.onPeerData;

            //attach APIs from other controllers
            SlideshowController.buildAPI();
            CaptureController.buildAPI();
            RaffleController.buildAPI();
            RosterController.buildAPI();
            ScoreboardController.buildAPI();
            VideoController.buildAPI();
            DataController.buildAPI();
            MediaQueueController.buildAPI();
        }

        //Show the component
        this.setState(() => {
            return {visible:true};
        }, () => {
            CaptureController.Init();
            GameController.Init();
            if(this.state.currentApp)
                GameController.Receiver = this.state.currentApp;
        });
    }

    /**
     * Renders the component.
     */
    render() {
        const appicons:Array<React.ReactElement> = [];
        const apps:Array<React.ReactElement> = [];
        for(let key in this.Applications) {
            let app = this.Applications[key];
            const opened = (this.state.currentApp === app) ? true : false;
            let panel = <app.type 
                key={key} 
                opened={opened}
                ref={app.ref}
                remote={app.remote}
                apps={(app === this.Applications.NET) ? this.Applications : []}
                />
            apps.push(panel);
            appicons.push(
                <Icon
                    src={app.icon}
                    key={`${key}-app`}
                    className={cnames({active:(app === this.state.currentApp)})}
                    title={app.name}
                    onClick={() => {
                        this.setApplication(app);
                        this.setState({ConfigShown:false});
                    }}
                    />
            );
        }

        const recordicons = [
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
            opened={this.state.visible}
            onClose={this.exit}
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
                <ClientDialog ref={this.DialogItem}/>
                <PeerRecordRequest
                    name={this.state.RecordUpdatePeerName}
                    opened={this.state.RecordUpdateShown}
                    id={this.state.RecordUpdatePeerID}
                    message={`${this.state.RecordUpdatePeerName} wishes to update the following records. 
                        Choose which records to update, or click cancel to ignore the request.`}
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
                    className="display-options">
                    <div className="record-list">
                        <CaptureDisplayButtons/>
                    </div>
                </Panel>
          </Panel>
        );
    }
}

export default Client;