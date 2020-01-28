import {CreateController, BaseReducer } from './functions.controllers';
import { IController } from './vars';
import CameraCaptureController from './capture/Camera';
import VideoCaptureController from './capture/Video';
import ScoreboardCaptureController, { ScorebannerCaptureController, JamClockCaptureController, JamCounterCaptureController } from './capture/Scoreboard';
import AnthemCaptureController from './capture/Anthem';
import SponsorCaptureController from './capture/Sponsor';
import RaffleCaptureController from './capture/Raffle';
import PenaltyCaptureController from './capture/Penalty';
import { PrepareObjectForSending } from './functions';
import { Unsubscribe } from 'redux';
import CaptureStatus from 'tools/CaptureStatus';
import DataController from './DataController';
import IPCX from 'controllers/IPCX';
import ScoreboardController from './ScoreboardController';
import RaffleController from './RaffleController';
import VideoController from './VideoController';
import SlideshowController from './SlideshowController';
import PenaltyController from './PenaltyController';
import ScorekeeperController from './ScorekeeperController';
import AnnouncerCaptureController from './capture/Announcer';
import RosterCaptureController from './capture/Roster';
import ScheduleCaptureController from './capture/Schedule';
import ScorekeeperCaptureController from './capture/Scorekeeper';
import ScoresCaptureController from './capture/Scores';
import SlideshowCaptureController from './capture/Slideshow';
import StandingsCaptureController from './capture/Standings';

interface ICaptureController extends IController {
    RequestStates:Function;
    updateStatus:Function;
    remoteStatus:Unsubscribe;
};

export enum Actions {
    SET_MONITOR = 'SET_MONITOR',
    SET_CLASS_NAME = 'SET_CLASS_NAME'
}

export interface SCaptureController {
    className:string;
    BackgroundImage:string;
    Monitor:{
        ID:any;
        Width:number;
        Height:number;
    }
}

export const InitState:SCaptureController = {
    className:'',
    BackgroundImage:'',
    Monitor:{
        ID:'',
        Width:1280,
        Height:720
    }
};

const SetMonitor = (state:SCaptureController, id:any, width:number, height:number) => {
    return {...state, Monitor:{
        ...state.Monitor,
        ID:id,
        Width:width,
        Height:height
    }};
};

const SetClassName = (state:SCaptureController, name:string) => {
    return {...state, className:name};
};

const CaptureReducer = (state:SCaptureController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_CLASS_NAME :
                return SetClassName(state, action.name);
            
            case Actions.SET_MONITOR :
                return SetMonitor(state, action.id, action.width, action.height);
    
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const CaptureController:ICaptureController = CreateController("CC", CaptureReducer);

/**
 * Sets the window title, subscribes for changes to the status controller,
 * and loads the states from the main window
 */
CaptureController.Init = (repeat:boolean = false) => {
    if(window && window.RDMGR && window.RDMGR.captureWindow) {
        window.RDMGR.captureWindow.setTitle('RDMGR : Capture Window');
        document.body.className = 'capture';

        CaptureController.remoteStatus = CaptureStatus.subscribe(CaptureController.updateStatus);

        //load user config file
        DataController.LoadConfig().then(() => {
            window.IPC = new IPCX('captureMessage', 'controlMessage', window.RDMGR.mainWindow);
            //request states
            CaptureController.RequestStates();
            window.RDMGR.mainWindow.focus();
        }).catch((er) => {

        });
    } else if(repeat) {
        setTimeout(() => {
            CaptureController.Init(true)
        }, 200);
    }
};

/**
 * Request states from the main window's controllers
 */
CaptureController.RequestStates = () => {
    if(window && window.IPC && window.IPC.requestState) {

        window.IPC.requestState(ScoreboardController.Key);
        window.IPC.requestState(RaffleController.Key);
        window.IPC.requestState(VideoController.Key);
        window.IPC.requestState(SlideshowController.Key);
        window.IPC.requestState(PenaltyController.Key);
        window.IPC.requestState(ScorekeeperController.Key);

        //capture
        window.IPC.requestState(AnnouncerCaptureController.Key);
        window.IPC.requestState(AnthemCaptureController.Key);
        window.IPC.requestState(CameraCaptureController.Key);
        window.IPC.requestState(PenaltyCaptureController.Key);
        window.IPC.requestState(RaffleCaptureController.Key);
        window.IPC.requestState(RosterCaptureController.Key);
        window.IPC.requestState(ScheduleCaptureController.Key);
        window.IPC.requestState(ScoreboardCaptureController.Key);
        window.IPC.requestState(JamClockCaptureController.Key);
        window.IPC.requestState(JamCounterCaptureController.Key);
        window.IPC.requestState(ScorebannerCaptureController.Key);
        window.IPC.requestState(ScorekeeperCaptureController.Key);
        window.IPC.requestState(ScoresCaptureController.Key);
        window.IPC.requestState(SlideshowCaptureController.Key);
        window.IPC.requestState(SponsorCaptureController.Key);
        window.IPC.requestState(StandingsCaptureController.Key);
        window.IPC.requestState(VideoCaptureController.Key);
    }
};

/**
 * Send the status of the capture controller to the main window
 */
CaptureController.updateStatus = () => {
    if(window && window.IPC && window.IPC.send) {
        window.IPC.send({
            type:'state',
            app:'CS',
            state:{...CaptureStatus.getState()}
        });
    }
};

/**
 * Builds the API for the capture controller
 */
CaptureController.BuildAPI = async () => {

    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/capture(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(CaptureController.GetState())));
        res.end();
    });

    //request to show / hide an element
    //path: /api/capture/[show|hide]/[name]
    exp.get(/^\/api\/capture\/(hide|show|toggle{1})\/([A-Z]{1,30})\/?$/i, (req, res) => {
        if(req.params[0] && req.params[1]) {

            if(req.params[0] === 'toggle') {
                switch(req.params[1].toString().toLowerCase()) {
                    //main camera
                    case 'camera' :
                        CameraCaptureController.Toggle();
                    break;
                    //video
                    case 'video' :
                        VideoCaptureController.Toggle();
                    break;
                    //scoreboard
                    case 'scoreboard' :
                        ScoreboardCaptureController.Toggle();
                    break;
                    //Scorebanner
                    case 'scorebanner' :
                        ScorebannerCaptureController.Toggle();
                    break;
                    //Jam Clock
                    case 'jamclock' :
                        JamClockCaptureController.Toggle();
                    break;
                    //Jam Counter
                    case 'jamcounter' :
                        JamCounterCaptureController.Toggle();
                    break;
                    //National Anthem
                    case 'anthem' :
                        AnthemCaptureController.Toggle();
                    break;
                    //Sponsor Slideshow
                    case 'sponsor' :
                        SponsorCaptureController.Toggle();
                    break;
                    //Raffle
                    case 'raffle' :
                        RaffleCaptureController.Toggle();
                    break;
                    //Penalties
                    case 'penalty' :
                        PenaltyCaptureController.Toggle();
                    break;

                    default :
                    break;
                }
            } else {
                var shown = (req.params[0] === 'show') ? true : false;
                switch(req.params[1].toString().toLowerCase()) {
                    //main camera
                    case 'camera' :
                        CameraCaptureController.SetVisibility(shown);
                    break;
                    //video
                    case 'video' :
                        VideoCaptureController.SetVisibility(shown);
                    break;
                    //scoreboard
                    case 'scoreboard' :
                        ScoreboardCaptureController.SetVisibility(shown);
                    break;
                    //Scorebanner
                    case 'scorebanner' :
                        ScorebannerCaptureController.SetVisibility(shown);
                    break;
                    //Jam Clock
                    case 'jamclock' :
                        JamClockCaptureController.SetVisibility(shown);
                    break;
                    //Jam Counter
                    case 'jamcounter' :
                        JamCounterCaptureController.SetVisibility(shown);
                    break;
                    //National Anthem
                    case 'anthem' :
                        AnthemCaptureController.SetVisibility(shown);
                    break;
                    //Sponsor Slideshow
                    case 'sponsor' :
                        SponsorCaptureController.SetVisibility(shown);
                    break;
                    //Raffle
                    case 'raffle' :
                        RaffleCaptureController.SetVisibility(shown);
                    break;
                    //Penalties
                    case 'penalty' :
                        PenaltyCaptureController.SetVisibility(shown);
                    break;

                    default :
                    break;
                }
            }

            res.send(req.params[0] + "-" + req.params[1]);
        } else {
            res.send("Request not recognized.");
        }
        res.end();
    });
};

export default CaptureController;