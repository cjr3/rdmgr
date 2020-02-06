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
import ClockController from 'controllers/ClockController';

//inter-process communication
import IPCX from 'controllers/IPCX';

//utilities
import vars from 'tools/vars';
import {IController } from './vars';
import keycodes from 'tools/keycodes';
import UIController from './UIController';
import { CreateController, BaseReducer } from './functions.controllers';
import ScoreboardCaptureController, { ScorebannerCaptureController, JamClockCaptureController, JamCounterCaptureController } from './capture/Scoreboard';
import PenaltyCaptureController from './capture/Penalty';
import ScorekeeperCaptureController from './capture/Scorekeeper';
import RosterCaptureController from './capture/Roster';
import PeersController from './PeersController';
import SkatersController from './SkatersController';
import TeamsController from './TeamsController';
import PhasesController from './PhasesController';
import PenaltiesController from './PenaltiesController';
import AnthemsController from './AnthemsController';
import AnnouncerCaptureController from './capture/Announcer';
import AnthemCaptureController from './capture/Anthem';
import CameraCaptureController from './capture/Camera';
import RaffleCaptureController from './capture/Raffle';
import ScheduleCaptureController from './capture/Schedule';
import ScoresCaptureController from './capture/Scores';
import SlideshowCaptureController from './capture/Slideshow';
import SponsorCaptureController from './capture/Sponsor';
import StandingsCaptureController from './capture/Standings';
import VideoCaptureController from './capture/Video';
import { SetEndpoint } from './api/functions';

interface SClientController {
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
    RecordUpdateTypes:any;
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
    /**
     * Determines if the configuration panel is open or not
     */
    ConfigShown:boolean;
    /**
     * Determines if the display panel is open or not
     */
    DisplayShown:boolean;
    /**
     * Determines if the display panel is open or not
     */
    ChatShown:boolean;

    /**
     * Determines if the file browser is open or not
     */
    FileBrowserShown:boolean;
    /**
     * Determines if the dialog is open or not
     */
    DialogShown:boolean;
    /**
     * Determines if the dialog is open or not
     */
    RecordUpdateShown:boolean;
    /**
     * Message to display in the dialog
     */
    DialogMessage:string;
    RaffleTicketNumber:string;
};

interface IClientController extends IController {
    SetApplication:Function;
    ShowDialog:Function;
    HideDialog:Function;
    HidePeerRequest:Function;
    HidePanels:Function;
    Exit:Function;
    ConnectPeers:Function;
    ToggleConfiguration:Function;
    ToggleDisplay:Function;
    ToggleChat:Function;
    ToggleFileBrowser:Function;
    AddRaffleTicketCharacter:{(value:string)};
    RemoveRaffleTicketCharacter:Function;
    SetRaffleTicketNumber:{(value:string)};
    onKeyUp:any;
    onPeerdata:Function;
    onSelectFile:Function;
    onExit:Function;
    updateServer:Function;
    updateData:Function;
    updateChat:Function;
    updateScoreboard:Function;
    updateCapture:Function;
    updateSlideshow:Function;
    updateVideo:Function;
    updateRaffle:Function;
    updateSponsor:Function;
    updatePenalty:Function;
    updateScorekeeper:Function;
    updateRoster:Function;
    updateCamera:Function;
    updateMediaQueue:Function;
    updateCaptureAnnouncer:Function;
    updateCaptureAnthem:Function;
    updateCaptureCamera:Function;
    updateCapturePenalty:Function;
    updateCaptureRaffle:Function;
    updateCaptureRoster:Function;
    updateCaptureSchedule:Function;
    updateCaptureScoreboard:Function;
    updateCaptureScorebanner:Function;
    updateCaptureJamClock:Function;
    updateCaptureJamCounter:Function;
    updateCaptureScorekeeper:Function;
    updateCaptureScores:Function;
    updateCaptureSlideshow:Function;
    updateCaptureSponsor:Function;
    updateCaptureStandings:Function;
    updateCaptureVideo:Function;
    updateClocks:Function;
};

enum Actions {
    SET_APPLICATION = 'SET_APPLICATION',
    SET_RECORD_UPDATE_REQUEST = 'SET_RECORD_UPDATE_REQUEST',
    SET_PEERS = 'SET_PEERS',
    SET_UNREAD_MESSAGE_COUNT = 'SET_UNREAD_MESSAGE_COUNT',
    TOGGLE_CONFIG = 'TOGGLE_CONFIG',
    TOGGLE_DISPLAY = 'TOGGLE_DISPLAY',
    TOGGLE_CHAT = 'TOGGLE_CHAT',
    TOGGLE_FILE_BROWSER = 'TOGGLE_FILE_BROWSER',
    SET_DIALOG = 'SET_DIALOG',
    SET_STATE = 'SET_STATE',
    HIDE_PANELS = 'HIDE_PANELS',
    SET_RAFFLE_NUMBER = 'SET_RAFFLE_NUMBER',
    ADD_RAFFLE_TICKET_CHAR = 'ADD_RAFFLE_TICKET_CHAR',
    REMOVE_RAFFLE_TICKET_CHAR = 'REMOVE_RAFFLE_TICKET_CHAR',
};

const InitState:SClientController = {
    CurrentApplication:ScoreboardController.Key,
    RecordUpdatePeerID:'',
    RecordUpdateTypes:{},
    RecordUpdateShown:false,
    UnreadMessageCount:0,
    PeerApplications:{
        //[CaptureController.Key]:null,
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
    ConnectedPeers:0,
    ConfigShown:false,
    DisplayShown:false,
    ChatShown:false,
    FileBrowserShown:false,
    DialogShown:false,
    DialogMessage:'',
    RaffleTicketNumber:''
};

const Controllers:any = {
    //[CaptureController.Key]:CaptureController,
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
    //[CaptureController.Key]:null,
    [MediaQueueController.Key]:null,
    [ScoreboardController.Key]:null,
    [ScorekeeperController.Key]:null,
    [PenaltyController.Key]:null,
    [RaffleController.Key]:null,
    [RosterController.Key]:null,
    [SlideshowController.Key]:null,
    [SponsorController.Key]:null,
    [VideoController.Key]:null,
    [CameraController.Key]:null,
    [AnnouncerCaptureController.Key]:null,
    [AnthemCaptureController.Key]:null,
    [CameraCaptureController.Key]:null,
    [PenaltyCaptureController.Key]:null,
    [RaffleCaptureController.Key]:null,
    [RosterCaptureController.Key]:null,
    [ScheduleCaptureController.Key]:null,
    [ScoreboardCaptureController.Key]:null,
    [ScorebannerCaptureController.Key]:null,
    [JamClockCaptureController.Key]:null,
    [JamCounterCaptureController.Key]:null,
    [ScorekeeperCaptureController.Key]:null,
    [ScoresCaptureController.Key]:null,
    [SlideshowCaptureController.Key]:null,
    [SponsorCaptureController.Key]:null,
    [StandingsCaptureController.Key]:null,
    [VideoCaptureController.Key]:null,
};

const SetApplication = (state:SClientController, key:string) => {
    return {...state, CurrentApplication:key};
};

const SetRecordUpdateRequest = (state:SClientController, peerid:string, types:any) => {
    return {...state, 
        RecordUpdatePeerID:peerid,
        RecordUpdateTypes:{...types},
        RecordUpdateShown:true
    };
};

const SetPeers = (state:SClientController, peers:any) => {
    //copy and reset applications
    let applications:any = {...state.PeerApplications};
    let c:number = 0;
    window.remoteApps.SB = false;
    window.remoteApps.ROS = false;
    for(let key in applications) {
        applications[key] = null;
    }

    //assign connected peer IDs to applications
    for(let key in peers) {
        let peer:any = peers[key];
        c++;
        if(peer.ControlledApps && peer.ControlledApps.forEach) {
            peer.ControlledApps.forEach((code) => {
                if(applications[code] === null) {
                    applications[code] = peer.ID;
                    if(code === ScoreboardController.Key)
                        window.remoteApps.SB = true;
                    else if(code === RosterController.Key)
                        window.remoteApps.ROS = true;
                }
            });
        }
    }

    return {...state, PeerApplications:applications, ConnectedPeers:c};
};

const SetUnreadMessageCount = (state:SClientController, amount:number) => {
    return {...state, UnreadMessageCount:amount};
};

const ToggleConfig = (state:SClientController) => {
    return {...state, ConfigShown:!state.ConfigShown};
};

const ToggleDisplay = (state:SClientController) => {
    return {...state, DisplayShown:!state.DisplayShown};
};

const ToggleChat = (state:SClientController) => {
    return {...state, ChatShown:!state.ChatShown};
};

const ToggleFileBrowser = (state:SClientController) => {
    return {...state, FileBrowserShown:!state.FileBrowserShown};
};

const SetDialogMessage = (state:SClientController, message:string, shown:boolean) => {
    return {...state, DialogShown:shown, DialogMessage:message};
};

const HidePanels = (state:SClientController) => {
    return {...state,
        ConfigShown:false,
        DisplayShown:false,
        ChatShown:false,
        FileBrowserShown:false,
        DialogShown:false,
        RecordUpdatesShow:false
    };
};

const SetRaffleNumber = (state:SClientController, value:string) => {
    return {...state, RaffleTicketNumber:value};
};

const AddRaffleTicketCharacter = (state:SClientController, value:string) => {
    if(!value || (state.RaffleTicketNumber && state.RaffleTicketNumber.length >= 8))
        return state;
    return {...state, RaffleTicketNumber:state.RaffleTicketNumber + value};
};

const RemoveRaffleTicketCharacter = (state:SClientController) => {
    if(state.RaffleTicketNumber && state.RaffleTicketNumber.length >= 1)
        return {...state, RaffleTicketNumber:state.RaffleTicketNumber.substring(0, state.RaffleTicketNumber.length - 1)};
    return state;
};

/**
 * Redux reducer for Client
 * @param state SClientController
 * @param action any
 */
const ClientReducer = (state:SClientController = InitState, action) => {
    try {
        switch(action.type) {
            //set the current application
            case Actions.SET_APPLICATION :
                return SetApplication(state, action.key);

            case Actions.SET_RECORD_UPDATE_REQUEST :
                return SetRecordUpdateRequest(state, action.ID, action.RecordTypes);

            //updates the connected peers
            case Actions.SET_PEERS :
                return SetPeers(state, action.peers);

            //Set the unread message count
            case Actions.SET_UNREAD_MESSAGE_COUNT :
                return SetUnreadMessageCount(state, action.amount);

            //Toggle configuration
            case Actions.TOGGLE_CONFIG :
                return ToggleConfig(state);

            //Toggle Display
            case Actions.TOGGLE_DISPLAY :
                return ToggleDisplay(state);

            //Toggle Chat
            case Actions.TOGGLE_CHAT :
                return ToggleChat(state);

            //Toggle FileBrowser
            case Actions.TOGGLE_FILE_BROWSER :
                return ToggleFileBrowser(state);

            case Actions.SET_DIALOG :
                return SetDialogMessage(state, action.message, action.shown);

            case Actions.HIDE_PANELS :
                return HidePanels(state);

            case Actions.SET_RAFFLE_NUMBER :
                return SetRaffleNumber(state, action.value);

            case Actions.ADD_RAFFLE_TICKET_CHAR :
                return AddRaffleTicketCharacter(state, action.value);

            case Actions.REMOVE_RAFFLE_TICKET_CHAR :
                return RemoveRaffleTicketCharacter(state);

            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

/**
 * Interprocess communication between mainWindow and captureWindow
 */
let IPC:any = {
    send:function() {}
};

const ClientController:IClientController = CreateController('CLN', ClientReducer);
ClientController.Init = () => {


    if(window && window.RDMGR) {
        //set title and body class name
        if(window.RDMGR.mainWindow) {
            window.RDMGR.mainWindow.setTitle('RDMGR : Control Window');
            document.body.className = 'client';

            window.RDMGR.mainWindow.on('close', ClientController.onExit);
        }

        //setup IPC renderer if there is a capture window.
        if(window.RDMGR.captureWindow) {
            IPC = new IPCX('controlMessage', 'captureMessage', window.RDMGR.captureWindow);
        }
    }

    //subscribe to controllers
    Subscriptions[DataController.Key] = DataController.Subscribe(ClientController.updateData);
    Subscriptions[ChatController.Key] = ChatController.Subscribe(ClientController.updateChat);
    Subscriptions[CameraController.Key] = CameraController.Subscribe(ClientController.updateCamera);
    Subscriptions[CaptureController.Key] = CaptureController.Subscribe(ClientController.updateCapture);
    Subscriptions[MediaQueueController.Key] = MediaQueueController.Subscribe(ClientController.updateMediaQueue);
    Subscriptions[PenaltyController.Key] = PenaltyController.Subscribe(ClientController.updatePenalty);
    Subscriptions[RaffleController.Key] = RaffleController.Subscribe(ClientController.updateRaffle);
    Subscriptions[RosterController.Key] = RosterController.Subscribe(ClientController.updateRoster);
    Subscriptions[ScoreboardController.Key] = ScoreboardController.Subscribe(ClientController.updateScoreboard);
    Subscriptions[ScorekeeperController.Key] = ScorekeeperController.Subscribe(ClientController.updateScorekeeper);
    Subscriptions[SlideshowController.Key] = SlideshowController.Subscribe(ClientController.updateSlideshow);
    Subscriptions[SponsorController.Key] = SponsorController.Subscribe(ClientController.updateSponsor);
    Subscriptions[VideoController.Key] = VideoController.Subscribe(ClientController.updateVideo);

    //capture controllers
    Subscriptions[AnnouncerCaptureController.Key] = AnnouncerCaptureController.Subscribe(ClientController.updateCaptureAnnouncer);
    Subscriptions[AnthemCaptureController.Key] = AnthemCaptureController.Subscribe(ClientController.updateCaptureAnthem);
    Subscriptions[CameraCaptureController.Key] = CameraCaptureController.Subscribe(ClientController.updateCaptureCamera);
    Subscriptions[PenaltyCaptureController.Key] = PenaltyCaptureController.Subscribe(ClientController.updateCapturePenalty);
    Subscriptions[RaffleCaptureController.Key] = RaffleCaptureController.Subscribe(ClientController.updateCaptureRaffle);
    Subscriptions[RosterCaptureController.Key] = RosterCaptureController.Subscribe(ClientController.updateCaptureRoster);
    Subscriptions[ScheduleCaptureController.Key] = ScheduleCaptureController.Subscribe(ClientController.updateCaptureSchedule);
    Subscriptions[ScoreboardCaptureController.Key] = ScoreboardCaptureController.Subscribe(ClientController.updateCaptureScoreboard);
    Subscriptions[ScorebannerCaptureController.Key] = ScorebannerCaptureController.Subscribe(ClientController.updateCaptureScorebanner);
    Subscriptions[JamClockCaptureController.Key] = JamClockCaptureController.Subscribe(ClientController.updateCaptureJamClock);
    Subscriptions[JamCounterCaptureController.Key] = JamCounterCaptureController.Subscribe(ClientController.updateCaptureJamCounter);
    Subscriptions[ScorekeeperCaptureController.Key] = ScorekeeperCaptureController.Subscribe(ClientController.updateCaptureScorekeeper);
    Subscriptions[ScoresCaptureController.Key] = ScoresCaptureController.Subscribe(ClientController.updateCaptureScores);
    Subscriptions[SlideshowCaptureController.Key] = SlideshowCaptureController.Subscribe(ClientController.updateCaptureSlideshow);
    Subscriptions[SponsorCaptureController.Key] = SponsorCaptureController.Subscribe(ClientController.updateCaptureSponsor);
    Subscriptions[StandingsCaptureController.Key] = StandingsCaptureController.Subscribe(ClientController.updateCaptureStandings);
    Subscriptions[VideoCaptureController.Key] = VideoCaptureController.Subscribe(ClientController.updateCaptureVideo);

    Subscriptions[ClockController.Key] = ClockController.Subscribe(ClientController.updateClocks);

    ScoreboardController.Init();

    if(window) {
        //global keyboard control
        window.addEventListener('keyup', ClientController.onKeyUp);

        //local server
        if(window.initControlServer) {
            window.initControlServer(DataController);
            if(window.LocalServer) {
                window.LocalServer.onDataReceived = ClientController.onPeerdata;
                SlideshowController.BuildAPI();
                //CaptureController.BuildAPI();
                RaffleController.BuildAPI();
                RosterController.BuildAPI();
                ScoreboardController.BuildAPI();
                VideoController.BuildAPI();
                DataController.BuildAPI();
                if(MediaQueueController.BuildAPI)
                    MediaQueueController.BuildAPI();
                window.LocalServer.subscribe(ClientController.updateServer);
                window.LocalServer.PeersController = PeersController;
            }
        }
    }

    SetEndpoint(DataController.GetMiscRecord('APIEndpoint'));

    ClientController.SetApplication(DataController.GetMiscRecord('DefaultApp'));
};

/**
 * Sets the current main application for the client
 * @param key string
 */
ClientController.SetApplication = async (key:string) => {
    let state = ClientController.GetState();
    if(state.CurrentApplication != key) {
        ClientController.Dispatch({
            type:Actions.SET_APPLICATION,
            key:key
        });
        DataController.SaveMiscRecord('DefaultApp', key);

        switch(key) {
            case ScoreboardController.Key : {
                UIController.ShowScoreboard();
            }
            break;

            case 'CC' : {
                UIController.ShowCaptureController();
            }
            break;

            case PenaltyController.Key : {
                UIController.ShowPenaltyTracker();
            }
            break;

            case ScorekeeperController.Key : {
                UIController.ShowScorekeeper();
            }
            break;

            case RosterController.Key : {
                UIController.ShowRoster();
            }
            break;

            case MediaQueueController.Key : {
                UIController.ShowMediaQueue();
            }
            break;
            default : 
                UIController.ShowScoreboard();
            break;
        }
    }
};

ClientController.ShowDialog = async () => {
    ClientController.SetState({
        DialogShown:true
    });
};

ClientController.HideDialog = async () => {
    ClientController.SetState({
        DialogShown:false
    });
};

/**
 * Hides the currently visible peer request
 */
ClientController.HidePeerRequest = async () => {
    ClientController.SetState({
        RecordUpdateShown:false
    });
};

/**
 * Attempts to exit the application
 */
ClientController.Exit = () => {
    ClientController.onExit();
    if(window && window.close) {
        try {
            window.close();
        } catch(er) {

        }
    }
};

/**
 * Instructs the local server/peer to connect to available peers.
 */
ClientController.ConnectPeers = async () => {
    if(window && window.LocalServer && window.LocalServer.connectPeers) {
        window.LocalServer.connectPeers();
    }
};

/**
 * Toggles the configuration panel.
 */
ClientController.ToggleConfiguration = async () => {
    ClientController.Dispatch({
        type:Actions.TOGGLE_CONFIG
    });
};

/**
 * Toggle the display panel
 */
ClientController.ToggleDisplay = async () => {
    ClientController.Dispatch({
        type:Actions.TOGGLE_DISPLAY
    });
};

/**
 * Toggle chat visibility
 */
ClientController.ToggleChat = async () => {
    ClientController.Dispatch({
        type:Actions.TOGGLE_CHAT
    });
};

/**
 * Toggles file browser visibility
 */
ClientController.ToggleFileBrowser = async () => {
    ClientController.Dispatch({
        type:Actions.TOGGLE_FILE_BROWSER
    });
};

/**
 * Handles keyboard events
 */
ClientController.onKeyUp = (ev:any) => {

    let state:SClientController = ClientController.GetState();
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
                    ScoreboardCaptureController.Toggle();
                }
                break;

                //Scorebanner
                case 'CC' : {
                    if(ev.ctrlKey)
                        ScoreboardCaptureController.Toggle();
                    else
                        ScorebannerCaptureController.Toggle();
                }
                break;

                //Penalty Tracker
                case PenaltyController.Key : {
                    PenaltyCaptureController.Toggle();
                }
                break;

                //Scorekeeper
                case ScorekeeperController.Key : {
                    ScorekeeperCaptureController.Toggle();
                }
                break;

                //Roster
                case RosterController.Key : {
                    RosterCaptureController.Toggle();
                }
                break;

                default : break;
            }
            return;
        }
        break;

        //Main Scoreboard
        case keycodes.F1 : {
            ClientController.SetApplication(ScoreboardController.Key);
            return;
        }
        break;

        //Capture Controller
        case keycodes.F2 : {
            ClientController.SetApplication('CC');
            return;
        }
        break;

        //Penalty Tracker 
        case keycodes.F3 : {
            ClientController.SetApplication(PenaltyController.Key);
            return;
        }
        break;

        //Scorekeeper 
        case keycodes.F4 : {
            ClientController.SetApplication(ScorekeeperController.Key);
            return;
        }
        break;

        //Roster
        case keycodes.F5 : {
            ClientController.SetApplication(RosterController.Key);
            return;
        }
        break;

        //Media Queue
        case keycodes.F6 : {
            ClientController.SetApplication(MediaQueueController.Key);
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
            ClientController.ToggleChat();
            return;
        }
        break;

        case keycodes.SUBTRACT :
            RaffleCaptureController.Toggle();
            return;

        default :
        
            if(RaffleCaptureController.GetState().Shown) {
                let ticket:string = ClientController.GetState().RaffleTicketNumber;
                switch(ev.keyCode) {
                    case keycodes.NUM0 :
                        ClientController.AddRaffleTicketCharacter('0');
                        return;
                    case keycodes.NUM1 :
                        ClientController.AddRaffleTicketCharacter('1');
                        return;
                    case keycodes.NUM2 :
                        ClientController.AddRaffleTicketCharacter('2');
                        return;
                    case keycodes.NUM3 :
                        ClientController.AddRaffleTicketCharacter('3');
                        return;
                    case keycodes.NUM4 :
                        ClientController.AddRaffleTicketCharacter('4');
                        return;
                    case keycodes.NUM5 :
                        ClientController.AddRaffleTicketCharacter('5');
                        return;
                    case keycodes.NUM6 :
                        ClientController.AddRaffleTicketCharacter('6');
                        return;
                    case keycodes.NUM7 :
                        ClientController.AddRaffleTicketCharacter('7');
                        return;
                    case keycodes.NUM8 :
                        ClientController.AddRaffleTicketCharacter('8');
                        return;
                    case keycodes.NUM9 :
                        ClientController.AddRaffleTicketCharacter('9');
                        return;
                    case keycodes.SPACEBAR :
                    case keycodes.ENTER :
                        if(ticket) {
                            RaffleController.Add(ticket);
                            ClientController.SetRaffleTicketNumber('');
                        }
                        return;
            
                    case keycodes.ADD :
                        if(!ticket) {
                            RaffleController.Remove();
                        } else {
                            ClientController.RemoveRaffleTicketCharacter();
                        }
                        return;
                    break;

                    case keycodes.BACKSPACE :
                    case keycodes.DELETE :
                        ClientController.RemoveRaffleTicketCharacter();
                        return;

                    case keycodes.MULTIPLY :
                        RaffleCaptureController.Hide();
                        ClientController.SetRaffleTicketNumber('');
                        RaffleController.Clear();
                    return;

                    case keycodes.DIVIDE :
                        RaffleController.Remove();
                    return;

                    default :

                    break;
                }

                return;
            }
        
        break;
    }
    
    //send keyboard commands to the current application's controller
    let app:any = Controllers[state.CurrentApplication];
    if(app !== null && typeof(app) == "object" && app.onKeyUp && typeof(app.onKeyUp) === 'function')
        app.onKeyUp(ev);
    else if(state.CurrentApplication !== 'MEQ') {
        if(Controllers.SB && Controllers.SB.onKeyUp && typeof(Controllers.SB.onKeyUp) === 'function')
            Controllers.SB.onKeyUp(ev);
    }
};

/**
 * Triggered when a peer sends data
 */
ClientController.onPeerdata = async (peer:any, data:any) => {

    switch(data.type) {
        //update the state of a controller
        case 'state' :
            let record = PeersController.Get().find(p => p.PeerID === peer.ID);
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
            ClientController.Dispatch({
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
                    records[vars.RecordType.Skater] = SkatersController.Get();
                    
                //Teams
                if(data.types[vars.RecordType.Team])
                    records[vars.RecordType.Team] = TeamsController.Get();

                //Phases
                if(data.types[vars.RecordType.Phase])
                    records[vars.RecordType.Phase] = PhasesController.Get();

                //Penalties
                if(data.types[vars.RecordType.Penalty])
                    records[vars.RecordType.Penalty] = PenaltiesController.Get();

                //Anthem Singers
                if(data.types[vars.RecordType.Anthem])
                    records[vars.RecordType.Anthem] = AnthemsController.Get();

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
                    //DataController.UpdateRecords(vars.RecordType.Skater, data.records[vars.RecordType.Skater]);
                }
                
                //teams
                if(data.records[vars.RecordType.Team]) {
                    //DataController.UpdateRecords(vars.RecordType.Team, data.records[vars.RecordType.Team]);
                }

                //penalties
                if(data.records[vars.RecordType.Penalty]) {
                    //DataController.UpdateRecords(vars.RecordType.Penalty, data.records[vars.RecordType.Penalty]);
                }

                //phases
                if(data.records[vars.RecordType.Phase]) {
                    //DataController.UpdateRecords(vars.RecordType.Phase, data.records[vars.RecordType.Phase]);
                }

                //anthem singers
                if(data.records[vars.RecordType.Anthem]) {
                    //DataController.UpdateRecords(vars.RecordType.Anthem, data.records[vars.RecordType.Anthem]);
                }
            }
        break;

        //Chat Message
        case 'chat-message' :
            data.message.self = false;
            data.message.read = false;
            ChatController.AddMessage(data.message);
        break;

        default :
        break;
    }
};

/**
 * Triggered when the user selects a file from the FileBrowser
 * - Assign a function to window.onSelectFile, which will receive the
 *   filename as its only parameter.
 * @param filename string
 */
ClientController.onSelectFile = async (filename?:string) => {
    if(window && window.onSelectFile && typeof(window.onSelectFile) === 'function') {
        window.onSelectFile(filename);
    }
};

ClientController.onExit = () => {
    //close data and IO operations
    try {
        DataController.UnregisterSaveStates();
    } catch(er) {

    }

    //close network connections gracefully
    if(window && window.LocalServer) {
        window.LocalServer.onExit();
    }

    if(window && window.RDMGR && window.RDMGR.mainWindow) {
        window.RDMGR.mainWindow.off('close', ClientController.onExit);
    }
};

/**
 * Triggered when the local server / peers update
 * - When a peer connects or disconnects
 */
ClientController.updateServer = async () => {
    let wstate:any = window.LocalServer.getState();
    let connected:any = {};
    //records stored
    let records:any = PeersController.Get();
    //peers registered to the server
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
    
    ClientController.Dispatch({
        type:Actions.SET_PEERS,
        peers:connected
    });
};

ClientController.HidePanels = async () => {
    ClientController.Dispatch({
        type:Actions.HIDE_PANELS
    });
};

ClientController.SetRaffleTicketNumber = async (value:string) => {
    ClientController.Dispatch({
        type:Actions.SET_RAFFLE_NUMBER,
        value:value
    });
};

ClientController.AddRaffleTicketCharacter = async (value:string) => {
    ClientController.Dispatch({
        type:Actions.ADD_RAFFLE_TICKET_CHAR,
        value:value
    });
};

ClientController.RemoveRaffleTicketCharacter = async () => {
    ClientController.Dispatch({
        type:Actions.REMOVE_RAFFLE_TICKET_CHAR
    });
};

/**
 * State listeners - to send state to the capture window
 */

ClientController.updateData = () => {
    IPC.send({
        type:'state',
        app:DataController.Key,
        state:{...DataController.GetState()}
    });
};

ClientController.updateChat = async () => {
    ClientController.Dispatch({
        type:Actions.SET_UNREAD_MESSAGE_COUNT,
        amount:ChatController.GetUnreadMessageCount()
    });
};

ClientController.updateScoreboard = async () => {
    let cstate = ScoreboardController.GetState();
    IPC.send({
        type:'state',
        app:ScoreboardController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(ScoreboardController.Key, Object.assign({}, cstate));
    }
};

ClientController.updateCapture = async () => {

    let state = CaptureController.GetState();
    IPC.send({
        type:'state',
        app:CaptureController.Key,
        state:state
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(CaptureController.Key, Object.assign({}, state));
    }
};

ClientController.updateSlideshow = async () => {
    let cstate = SlideshowController.GetState();
    IPC.send({
        type:'state',
        app:SlideshowController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(SlideshowController.Key, Object.assign({}, cstate));
    }
};
ClientController.updateVideo = async () => {
    
    let state = VideoController.GetState();
    IPC.send({
        type:'state',
        app:VideoController.Key,
        state:state
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(VideoController.Key, VideoController.PrepareStateForSending());
    }
};
ClientController.updateRaffle = async () => {
    
    let cstate = RaffleController.GetState();
    IPC.send({
        type:'state',
        app:RaffleController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(RaffleController.Key, Object.assign({}, cstate));
    }
};

ClientController.updateSponsor = async () => {
    let cstate = SponsorController.GetState();
    IPC.send({
        type:'state',
        app:SponsorController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(SponsorController.Key, Object.assign({}, cstate));
    }
};
ClientController.updatePenalty = async () => {
    let cstate = PenaltyController.GetState();
    IPC.send({
        type:'state',
        app:PenaltyController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(PenaltyController.Key, Object.assign({}, cstate));
    }
};
ClientController.updateScorekeeper = async () => {
    let cstate = ScorekeeperController.GetState();
    IPC.send({
        type:'state',
        app:ScorekeeperController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(ScorekeeperController.Key, Object.assign({}, cstate));
    }
};
ClientController.updateRoster = async () => {
    let cstate = RosterController.GetState();
    IPC.send({
        type:'state',
        app:RosterController.Key,
        state:cstate
    });

    if(window && window.LocalServer) {
        window.LocalServer.SendState(RosterController.Key, {...cstate});
    }
};

ClientController.updateCamera = async () => {
    IPC.send({
        type:'state',
        app:CameraController.Key,
        state:CameraController.GetState()
    });
};

ClientController.updateMediaQueue = () => {};

ClientController.updateCaptureAnnouncer = async () => {
    IPC.send({
        type:'state',
        app:AnnouncerCaptureController.Key,
        state:AnnouncerCaptureController.GetState()
    });
};

ClientController.updateCaptureAnthem = async () => {
    IPC.send({
        type:'state',
        app:AnthemCaptureController.Key,
        state:AnthemCaptureController.GetState()
    });
};

ClientController.updateCaptureCamera = async () => {
    IPC.send({
        type:'state',
        app:CameraCaptureController.Key,
        state:CameraCaptureController.GetState()
    });
};

ClientController.updateCapturePenalty = async () => {
    IPC.send({
        type:'state',
        app:PenaltyCaptureController.Key,
        state:PenaltyCaptureController.GetState()
    });
};

ClientController.updateCaptureRaffle = async () => {
    IPC.send({
        type:'state',
        app:RaffleCaptureController.Key,
        state:RaffleCaptureController.GetState()
    });
};

ClientController.updateCaptureRoster = async () => {
    IPC.send({
        type:'state',
        app:RosterCaptureController.Key,
        state:RosterCaptureController.GetState()
    });
};

ClientController.updateCaptureSchedule = async () => {
    IPC.send({
        type:'state',
        app:ScheduleCaptureController.Key,
        state:ScheduleCaptureController.GetState()
    });
};

ClientController.updateCaptureScoreboard = async () => {
    IPC.send({
        type:'state',
        app:ScoreboardCaptureController.Key,
        state:ScoreboardCaptureController.GetState()
    });
};

ClientController.updateCaptureScorebanner = async () => {
    IPC.send({
        type:'state',
        app:ScorebannerCaptureController.Key,
        state:ScorebannerCaptureController.GetState()
    });
};

ClientController.updateCaptureJamClock = async () => {
    IPC.send({
        type:'state',
        app:JamClockCaptureController.Key,
        state:JamClockCaptureController.GetState()
    });
};

ClientController.updateCaptureJamCounter = async () => {
    IPC.send({
        type:'state',
        app:JamCounterCaptureController.Key,
        state:JamCounterCaptureController.GetState()
    });
};

ClientController.updateCaptureScores = async () => {
    IPC.send({
        type:'state',
        app:ScoresCaptureController.Key,
        state:ScoresCaptureController.GetState()
    });
};

ClientController.updateCaptureScorekeeper = async () => {
    IPC.send({
        type:'state',
        app:ScorekeeperCaptureController.Key,
        state:ScorekeeperCaptureController.GetState()
    });
};

ClientController.updateCaptureSlideshow = async () => {
    IPC.send({
        type:'state',
        app:SlideshowCaptureController.Key,
        state:SlideshowCaptureController.GetState()
    });
};

ClientController.updateCaptureSponsor = async () => {
    IPC.send({
        type:'state',
        app:SponsorCaptureController.Key,
        state:SponsorCaptureController.GetState()
    });
};

ClientController.updateCaptureStandings = async () => {
    IPC.send({
        type:'state',
        app:StandingsCaptureController.Key,
        state:StandingsCaptureController.GetState()
    });
};

ClientController.updateCaptureVideo = async () => {
    IPC.send({
        type:'state',
        app:VideoCaptureController.Key,
        state:VideoCaptureController.GetState()
    });
};

ClientController.updateClocks = async () => {
    IPC.send({
        type:'state',
        app:ClockController.Key,
        state:ClockController.GetState()
    });
}

export default ClientController;