import {createStore, Store, Unsubscribe} from 'redux';

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

//inter-process communication
import IPCX from 'controllers/IPCX';

//utilities
import vars, {IController} from 'tools/vars';
import keycodes from 'tools/keycodes';

export interface SClientController {
    /**
     * Current main application
     */
    CurrentApplication:string;
    /**
     * ID of peer wishing to send record updates
     */
    RecordUpdatePeerID:string;
    /**
     * Array of record type codes to request / send
     */
    RecordUpdateTypes:Array<string>;
    /**
     * Number of unread messages in chat
     */
    UnreadMessageCount:number;
    /**
     * Applications controlled by peers
     */
    PeerApplications:any;
    /**
     * Number of currently connected peers
     */
    ConnectedPeers:number;
};

interface IClientController extends IController {

    /**
     * Sets the client's application
     */
    SetApplication:Function;
    /**
     * Exits the application, attempting to
     * close any connections and I/O operations
     * before attempting to
     */
    Exit:Function;

    /**
     * Attempts to connect to known remote peers.
     */
    ConnectPeers:Function;

    /**
     * Handles global keyboard commands
     */
    onKeyUp:any;

    /**
     * Triggered when a peer sends data
     */
    onPeerdata:Function;

    /**
     * Triggered when the client selects a file
     */
    onSelectFile:Function;

    /**
     * Triggered when the user reloads or exits the main window
     */
    onExit:Function;

    /**
     * Triggered when LocalServer is updated
     */
    updateServer:Function;

    /**
     * Triggered when the data controller updates
     */
    updateData:Function;

    /**
     * Triggered when the ChatController is updated
     */
    updateChat:Function;

    /**
     * Triggered when the ScoreboardController updates
     */
    updateScoreboard:Function;

    /**
     * Triggered when the CaptureController updates
     */
    updateCapture:Function;

    /**
     * Triggered when the SlideshowController updates
     */
    updateSlideshow:Function;

    /**
     * Triggered when the VideoController updates
     */
    updateVideo:Function;

    /**
     * Triggered when the RaffleController updates
     */
    updateRaffle:Function;

    /**
     * Triggered when the SponsorController updates
     */
    updateSponsor:Function;

    /**
     * Triggered when the PenaltyController updates
     */
    updatePenalty:Function;

    /**
     * Triggered when the ScorekeeperController updates
     */
    updateScorekeeper:Function;

    /**
     * Triggered when the RosterController updates
     */
    updateRoster:Function;

    /**
     * Triggered when the CameraController updates
     */
    updateCamera:Function;

    /**
     * Triggered when the MediaQueueController updates
     */
    updateMediaQueue:Function;
};

export enum Actions {
    SET_APPLICATION,
    SET_RECORD_UPDATE_REQUEST,
    SET_PEERS,
    SET_UNREAD_MESSAGE_COUNT
};

const InitState:SClientController = {
    CurrentApplication:ScoreboardController.Key,
    RecordUpdatePeerID:'',
    RecordUpdateTypes:[],
    UnreadMessageCount:0,
    PeerApplications:{
        [CaptureController.Key]:null,
        [MediaQueueController.Key]:null,
        [ScoreboardController.Key]:null,
        [ScorekeeperController.Key]:null,
        [PenaltyController.Key]:null,
        [RaffleController.Key]:null,
        [RosterController.Key]:null,
        [SlideshowController.Key]:null,
        [SponsorController.Key]:null,
        [VideoController.Key]:null
    },
    ConnectedPeers:0
};

const Controllers:any = {
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
};

let Subscriptions:any = {
    [CaptureController.Key]:null,
    [MediaQueueController.Key]:null,
    [ScoreboardController.Key]:null,
    [ScorekeeperController.Key]:null,
    [PenaltyController.Key]:null,
    [RaffleController.Key]:null,
    [RosterController.Key]:null,
    [SlideshowController.Key]:null,
    [SponsorController.Key]:null,
    [VideoController.Key]:null,
    [CameraController.Key]:null
};

/**
 * Redux reducer for Client
 * @param state SClientController
 * @param action any
 */
function ClientReducer(state:SClientController = InitState, action) {
    try {
        switch(action.type) {
            //set the current application
            case Actions.SET_APPLICATION : {
                return Object.assign({}, state, {
                    CurrentApplication:action.key
                });
            }
            break;

            case Actions.SET_RECORD_UPDATE_REQUEST : {
                return  Object.assign({}, state, {
                    RecordUpdatePeerID:action.ID,
                    RecordUpdateTypes:Object.assign({}, action.RecordTypes)
                });
            }
            break;

            //updates the connected peers
            case Actions.SET_PEERS : {
                //copy and reset applications
                let applications:any = Object.assign({}, state.PeerApplications);
                let c:number = 0;
                for(let key in applications) {
                    applications[key] = null;
                }

                //assign connected peer IDs to applications
                for(let key in action.peers) {
                    let peer:any = action.peers[key];
                    c++;
                    if(peer.ControlledApps && peer.ControlledApps.forEach) {
                        peer.ControlledApps.forEach((code) => {
                            if(applications[code] === null) {
                                applications[code] = peer.ID;
                            }
                        });
                    }
                }

                return Object.assign({}, state, {
                    PeerApplications:applications,
                    ConnectedPeers:c
                });
            }
            break;

            //Set the unread message count
            case Actions.SET_UNREAD_MESSAGE_COUNT : {
                return Object.assign({}, state, {
                    UnreadMessageCount:action.amount
                });
            }
            break;

            default : {
                return state;
            }
            break;
        }
    } catch(er) {
        return state;
    }
}

const ClientStore = createStore(ClientReducer);

/**
 * Interprocess communication between mainWindow and captureWindow
 */
let IPC:any = {
    send:function() {}
}

const ClientController:IClientController = {
    /**
     * Unique key to identify the ClientController
     */
    Key:'CLN',
    /**
     * Initializes the application
     */
    Init() {

        if(window && window.RDMGR) {
            //set title and body class name
            if(window.RDMGR.mainWindow) {
                window.RDMGR.mainWindow.setTitle('RDMGR : Control Window');
                document.body.className = 'client';

                window.RDMGR.mainWindow.on('close', () => {
                    ClientController.onExit();
                });
            }

            //setup IPC renderer if there is a capture window.
            if(window.RDMGR.captureWindow) {
                IPC = new IPCX('controlMessage', 'captureMessage', window.RDMGR.captureWindow);
            }
        }

        //subscribe to controllers
        Subscriptions[ScoreboardController.Key] = ScoreboardController.subscribe(ClientController.updateScoreboard);
        Subscriptions[CaptureController.Key] = CaptureController.subscribe(ClientController.updateCapture);
        Subscriptions[MediaQueueController.Key] = MediaQueueController.subscribe(ClientController.updateMediaQueue);
        Subscriptions[ScorekeeperController.Key] = ScorekeeperController.subscribe(ClientController.updateScorekeeper);
        Subscriptions[PenaltyController.Key] = PenaltyController.subscribe(ClientController.updatePenalty);
        Subscriptions[RaffleController.Key] = RaffleController.subscribe(ClientController.updateRaffle);
        Subscriptions[RosterController.Key] = RosterController.subscribe(ClientController.updateRoster);
        Subscriptions[SlideshowController.Key] = SlideshowController.subscribe(ClientController.updateSlideshow);
        Subscriptions[SponsorController.Key] = SponsorController.subscribe(ClientController.updateSponsor);
        Subscriptions[VideoController.Key] = VideoController.subscribe(ClientController.updateVideo);
        Subscriptions[CameraController.Key] = CameraController.subscribe(ClientController.updateCamera);

        if(window) {
            //global keyboard control
            window.addEventListener('keyup', ClientController.onKeyUp);

            //local server
            if(window.initControlServer) {
                window.initControlServer(DataController);
                if(window.LocalServer) {
                    window.LocalServer.onDataReceived = ClientController.onPeerdata;
                    SlideshowController.buildAPI();
                    CaptureController.buildAPI();
                    RaffleController.buildAPI();
                    RosterController.buildAPI();
                    ScoreboardController.buildAPI();
                    VideoController.buildAPI();
                    DataController.buildAPI();
                    MediaQueueController.buildAPI();
                    window.LocalServer.subscribe(ClientController.updateServer);
                }
            }
        }

        ClientController.SetApplication(DataController.GetMiscRecord('DefaultApp'));
    },

    /**
     * Sets the current main application for the client
     * @param key string
     */
    SetApplication(key:string) {
        ClientController.getStore().dispatch({
            type:Actions.SET_APPLICATION,
            key:key
        });
        DataController.SaveMiscRecord('DefaultApp', key);
    },

    /**
     * Attempts to exit the application
     */
    Exit() {
        ClientController.onExit();
        if(window && window.close) {

            try {
                window.close();
            } catch(er) {

            }
        }
    },

    /**
     * Instructs the local server/peer to connect to available peers.
     */
    ConnectPeers() {
        if(window && window.LocalServer && window.LocalServer.connectPeers) {
            window.LocalServer.connectPeers();
        }
    },

    /**
     * Triggered when the user exits / reloads the main window
     */
    onExit() {
        //close data and IO operations
        try {
            DataController.UnregisterSaveStates();
        } catch(er) {

        }

        //close network connections gracefully
        if(window && window.LocalServer) {
            window.LocalServer.onExit();
        }
    },

    /**
     * Triggered on keyUp from connected keyboards
     * @param ev KeyEvent
     */
    onKeyUp(ev) {
        let state:SClientController = ClientController.getState();
        let name:string = ev.target.tagName.toLowerCase();
        
        //ignore any and all keyboard events when the user has
        //focus on an input element
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
                switch(state.CurrentApplication) {
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
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:ScoreboardController.Key
                });
                return;
            }
            break;

            //Capture Controller
            case keycodes.F2 : {
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:CaptureController.Key
                });
                return;
            }
            break;

            //Penalty Tracker 
            case keycodes.F3 : {
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:PenaltyController.Key
                });
                return;
            }
            break;

            //Scorekeeper 
            case keycodes.F4 : {
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:ScorekeeperController.Key
                });
                return;
            }
            break;

            //Roster
            case keycodes.F5 : {
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:RosterController.Key
                });
                return;
            }
            break;

            //Media Queue
            case keycodes.F6 : {
                ClientController.getStore().dispatch({
                    type:Actions.SET_APPLICATION,
                    key:MediaQueueController.Key
                });
                return;
            }
            break;

            //fullscreen - ignore
            case keycodes.F11 : {
                return;
            }
            break;

            //Open Chat
            case keycodes.F12 : {
                //this.setState({ChatShown:true});
                return;
            }
            break;

            default : break;
        }

        //send keyboard commands to the current application's controller
        let app:any = Controllers[state.CurrentApplication];
        if(app !== null && typeof(app) == "object" && app.onKeyUp)
            app.onKeyUp(ev);
    },

    /**
     * Triggered when a peer sends data.
     * @param peer any
     * @param data any
     */
    onPeerdata(peer:any, data:any) {
        switch(data.type) {
            //update the state of a controller
            case 'state' :
                let record = DataController.getPeer(peer.ID);
                if(record && record.ControlledApps && record.ControlledApps.indexOf(data.app) >= 0) {
                    if(Controllers[data.app] && Controllers[data.app].SetState) {
                        Controllers[data.app].SetState(data.state);
                    }
                }
            break;

            //Send state to peer.
            case 'request-state' :
                if(Controllers[data.app] && Controllers[data.app].getState) {
                    window.LocalServer.SendState(peer.ID, Controllers[data.app].getState);
                }
            break;

            //Disconnect peer
            case 'disconnect' :
                window.LocalServer.LocalPeer.disconnectPeer(peer.ID);
            break;

            //Show request to update local peer's records with remote peer's records.
            case 'set-record-request' :
                ClientController.getStore().dispatch({
                    type:Actions.SET_RECORD_UPDATE_REQUEST,
                    ID:peer.ID,
                    RecordTypes:data.types
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
                //data.message.read = this.state.ChatShown;
                ChatController.AddMessage(data.message);
            break;

            default :
            break;
        }
    },

    /**
     * Triggered when the user selects a file from the FileBrowser
     * - Assign a function to window.onSelectFile, which will receive the
     *   filename as its only parameter.
     * @param filename string
     */
    onSelectFile(filename?:string) {
        if(window && window.onSelectFile && typeof(window.onSelectFile) === 'function') {
            window.onSelectFile(filename);
        }
    },

    /**
     * Triggered when the local server / peers update
     * - When a peer connects or disconnects
     */
    updateServer() {
        let wstate:any = window.LocalServer.getState();
        let connected:any = {};
        let records:any = DataController.getPeers();
        let peers:any = wstate.Peers;
        if(peers && typeof(peers) === "object") {
            for(let key in peers) {
                let peer:any = peers[key];
                if(peer.Connected) {
                    connected[peer.ID] = Object.assign({}, peer, {
                        ControlledApps:[]
                    });
                    for(let pkey in records) {
                        if(records[pkey].PeerID == peer.ID) {
                            connected[peer.ID].ControlledApps = records[pkey].ControlledApps;
                        }
                    }
                }
            }
        }
        
        ClientController.getStore().dispatch({
            type:Actions.SET_PEERS,
            peers:connected
        });
    },

    /**
     * Triggered when the ChatController state is updated
     */
    updateChat() {
        ClientController.getStore().dispatch({
            types:Actions.SET_UNREAD_MESSAGE_COUNT,
            amount:ChatController.GetUnreadMessageCount()
        });
    },

    updateCamera() {
        IPC.send({
            type:'state',
            app:CameraController.Key,
            state:CameraController.getState()
        });
    },

    updateRoster() {
        let cstate = RosterController.getState();
        IPC.send({
            type:'state',
            app:RosterController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(RosterController.Key, Object.assign({}, cstate));
        }
    },

    updateCapture() {
        let state = CaptureController.getState();
        IPC.send({
            type:'state',
            app:CaptureController.Key,
            state:state
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(CaptureController.Key, Object.assign({}, state));
        }
    },

    updatePenalty() {
        let cstate = PenaltyController.getState();
        IPC.send({
            type:'state',
            app:PenaltyController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(PenaltyController.Key, Object.assign({}, cstate));
        }
    },

    updateRaffle() {
        let cstate = RaffleController.getState();
        IPC.send({
            type:'state',
            app:RaffleController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(RaffleController.Key, Object.assign({}, cstate));
        }
    },

    updateScoreboard() {
        let cstate = ScoreboardController.getState();
        IPC.send({
            type:'state',
            app:ScoreboardController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(ScoreboardController.Key, Object.assign({}, cstate));
        }
    },

    updateScorekeeper() {
        let cstate = ScorekeeperController.getState();
        IPC.send({
            type:'state',
            app:ScorekeeperController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(ScorekeeperController.Key, Object.assign({}, cstate));
        }
    },

    updateSlideshow() {
        let cstate = SlideshowController.getState();
        IPC.send({
            type:'state',
            app:SlideshowController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(SlideshowController.Key, Object.assign({}, cstate));
        }
    },

    updateSponsor() {
        let cstate = SponsorController.getState();
        IPC.send({
            type:'state',
            app:SponsorController.Key,
            state:cstate
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(SponsorController.Key, Object.assign({}, cstate));
        }
    },

    updateVideo() {
        let state = VideoController.getState();
        IPC.send({
            type:'state',
            app:VideoController.Key,
            state:state
        });

        if(window && window.LocalServer) {
            window.LocalServer.SendState(VideoController.Key, Object.assign({}, state));
        }
    },

    updateMediaQueue() {

    },

    updateData() {
        let peers = DataController.getPeers();
        let state = ClientController.getState();

    },

    /**
     * Gets the Store for the controller
     */
    getStore() : Store<SClientController, any> {
        return ClientStore;
    },
    /**
     * Gets the current state for the controller
     */
    getState() : any {
        return ClientController.getStore().getState();
    },
    /**
     * Subscribes to the redux store
     * @param f Function
     */
    subscribe(f:Function) : Unsubscribe {
        return ClientController.getStore().subscribe(f);
    }
};

export default ClientController;