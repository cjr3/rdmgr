import CameraController from 'controllers/CameraController';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureController from 'controllers/CaptureController';
import SlideshowController from 'controllers/SlideshowController';
import VideoController from './VideoController';
import RaffleController from './RaffleController';
import SponsorController from './SponsorController';
import PenaltyController from './PenaltyController';
import ScorekeeperController from './ScorekeeperController';
import CaptureStatus from 'tools/CaptureStatus';
import RosterController from './RosterController';
import ClockController from './ClockController';

//capture controllers
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import AnthemCaptureController from 'controllers/capture/Anthem';
import CameraCaptureController from 'controllers/capture/Camera';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import RaffleCaptureController from 'controllers/capture/Raffle';
import RosterCaptureController from 'controllers/capture/Roster';
import ScheduleCaptureController from 'controllers/capture/Schedule';
import ScoreboardCaptureController, {JamClockCaptureController, JamCounterCaptureController, ScorebannerCaptureController} from 'controllers/capture/Scoreboard';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import ScoresCaptureController from 'controllers/capture/Scores';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import SponsorCaptureController from 'controllers/capture/Sponsor';
import StandingsCaptureController from 'controllers/capture/Standings';
import VideoCaptureController from 'controllers/capture/Video';
import DataController from './DataController';

/**
 * Class for interprocess communication between the capture window
 * and the control window.
 */
class IPCX {

    protected SendKey:string
    protected Receiver:any
    protected ReceiveKey:string

    constructor(sendKey, receiveKey, receiver) {
        const ipc = window.require('electron').ipcRenderer;
        this.SendKey = sendKey;
        this.ReceiveKey = receiveKey;
        this.receive = this.receive.bind(this);
        this.send = this.send.bind(this);
        this.Receiver = receiver;
        ipc.on(receiveKey, this.receive);
    }

    /**
     * Triggered when the window receives a message.
     * @param {Event} ev 
     * @param {Object} data 
     */
    async receive(ev, data) {
        switch(data.type) {
            case 'state' :
                switch(data.app) {
                    //scoreboard
                    case ScoreboardController.Key :
                        ScoreboardController.SetState(data.state);
                    break;

                    case CaptureController.Key :
                        CaptureController.SetState(data.state);
                    break;

                    //capture status
                    case 'CS' :
                        CaptureStatus.SetState(data.state);
                    break;

                    //slideshow
                    case SlideshowController.Key :
                        SlideshowController.SetState(data.state);
                    break;

                    //Video
                    case VideoController.Key :
                        VideoController.SetState(data.state);
                    break;

                    //Raffle
                    case RaffleController.Key :
                        RaffleController.SetState(data.state);
                    break;

                    //Sponsor Slideshow
                    case SponsorController.Key :
                        SponsorController.SetState(data.state);
                    break;

                    //Penalty Tracker
                    case PenaltyController.Key :
                        PenaltyController.SetState(data.state);
                    break;

                    //Scorekeeper
                    case ScorekeeperController.Key :
                        ScorekeeperController.SetState(data.state);
                    break;

                    //Main Camera
                    case CameraController.Key :
                        CameraController.SetState(data.state);
                    break;

                    //Roster
                    case RosterController.Key :
                        RosterController.SetState(data.state);
                    break;

                    //Capture : Announcer
                    case AnnouncerCaptureController.Key :
                        AnnouncerCaptureController.SetState(data.state);
                    break;

                    //Capture : Anthem
                    case AnthemCaptureController.Key :
                        AnthemCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Main Camera
                    case CameraCaptureController.Key :
                        CameraCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Penalty Tracker
                    case PenaltyCaptureController.Key :
                        PenaltyCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Raffle
                    case RaffleCaptureController.Key :
                        RaffleCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Roster
                    case RosterCaptureController.Key :
                        RosterCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Schedule
                    case ScheduleCaptureController.Key :
                        ScheduleCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Scoreboard
                    case ScoreboardCaptureController.Key :
                        ScoreboardCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Scorebanner
                    case ScorebannerCaptureController.Key :
                        ScorebannerCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Jam Clock
                    case JamClockCaptureController.Key :
                        JamClockCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Jam Counter
                    case JamCounterCaptureController.Key :
                        JamCounterCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Scorekeeper
                    case ScorekeeperCaptureController.Key :
                        ScorekeeperCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Scores
                    case ScoresCaptureController.Key :
                        ScoresCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Slideshow
                    case SlideshowCaptureController.Key :
                        SlideshowCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Sponsor
                    case SponsorCaptureController.Key :
                        SponsorCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Standings
                    case StandingsCaptureController.Key :
                        StandingsCaptureController.SetState(data.state);
                    break;
                    
                    //Capture : Videos
                    case VideoCaptureController.Key :
                        VideoCaptureController.SetState(data.state);
                    break;

                    case ClockController.Key :
                        ClockController.SetState(data.state);
                    break;

                    case DataController.Key :
                        DataController.SetState(data.state);
                    break;

                    default :
                    break;
                }
            break;

            //respond to a state request
            case 'request-state' :
                var state:any = null;
                switch(data.app) {
                    //scoreboard
                    case ScoreboardController.Key :
                        state = Object.assign({}, ScoreboardController.GetState());
                    break;

                    //capture status
                    case 'CS' :
                        state = Object.assign({}, CaptureStatus.getState());
                    break;

                    //slideshow
                    case SlideshowController.Key :
                        state = Object.assign({}, SlideshowController.GetState());
                    break;
                    //Video
                    case VideoController.Key :
                        state = Object.assign({}, VideoController.GetState());
                    break;
                    //slideshow
                    case RaffleController.Key :
                        state = Object.assign({}, RaffleController.GetState());
                    break;
                    //sponsor slideshow
                    case SponsorController.Key :
                        state = Object.assign({}, SponsorController.GetState());
                    break;
                    //penalty tracker
                    case PenaltyController.Key :
                        state = Object.assign({}, PenaltyController.GetState());
                    break;
                    //scorekeeper
                    case ScorekeeperController.Key :
                        state = Object.assign({}, ScorekeeperController.GetState());
                    break;

                    //Camera
                    case CameraController.Key :
                        state = Object.assign({}, CameraController.GetState());
                    break;

                    //Roster
                    case RosterController.Key :
                        state = {...RosterController.GetState()};
                    break;
                    
                    //Capture : Announcer
                    case AnnouncerCaptureController.Key :
                        state = {...AnnouncerCaptureController.GetState()};
                    break;

                    //Capture : Anthem
                    case AnthemCaptureController.Key :
                        state = {...AnthemCaptureController.GetState()};
                    break;
                    
                    //Capture : Main Camera
                    case CameraCaptureController.Key :
                        state = {...CameraCaptureController.GetState()};
                    break;
                    
                    //Capture : Penalty Tracker
                    case PenaltyCaptureController.Key :
                        state = {...PenaltyCaptureController.GetState()};
                    break;
                    
                    //Capture : Raffle
                    case RaffleCaptureController.Key :
                        state = {...RaffleCaptureController.GetState()};
                    break;
                    
                    //Capture : Roster
                    case RosterCaptureController.Key :
                        state = {...RosterCaptureController.GetState()};
                    break;
                    
                    //Capture : Schedule
                    case ScheduleCaptureController.Key :
                        state = {...ScheduleCaptureController.GetState()};
                    break;
                    
                    //Capture : Scoreboard
                    case ScoreboardCaptureController.Key :
                        state = {...ScoreboardCaptureController.GetState()};
                    break;
                    
                    //Capture : Scorebanner
                    case ScorebannerCaptureController.Key :
                        state = {...ScorebannerCaptureController.GetState()};
                    break;
                    
                    //Capture : Jam Clock
                    case JamClockCaptureController.Key :
                        state = {...JamClockCaptureController.GetState()};
                    break;
                    
                    //Capture : Jam Counter
                    case JamCounterCaptureController.Key :
                        state = {...JamCounterCaptureController.GetState()};
                    break;
                    
                    //Capture : Scorekeeper
                    case ScorekeeperCaptureController.Key :
                        state = {...ScorekeeperCaptureController.GetState()};
                    break;
                    
                    //Capture : Scores
                    case ScoresCaptureController.Key :
                        state = {...ScoresCaptureController.GetState()};
                    break;
                    
                    //Capture : Slideshow
                    case SlideshowCaptureController.Key :
                        state = {...SlideshowCaptureController.GetState()};
                    break;
                    
                    //Capture : Sponsor
                    case SponsorCaptureController.Key :
                        state = {...SponsorCaptureController.GetState()};
                    break;
                    
                    //Capture : Standings
                    case StandingsCaptureController.Key :
                        state = {...StandingsCaptureController.GetState()};
                    break;
                    
                    //Capture : Videos
                    case VideoCaptureController.Key :
                        state = {...VideoCaptureController.GetState()};
                    break;

                    case DataController.Key :
                        state = {...DataController.GetState()};
                    break;

                    default :
                    break;
                }

                if(state !== null) {
                    this.send({
                        type:'state',
                        app:data.app,
                        state:state
                    });
                }
            break;

            //send a request to a given peer for their stream
            case 'peer-media-request' :
                if(window && window.LocalServer) {
                    window.LocalServer.LocalPeer.requestCall(data.id);
                }
            break;

            //send a media stream to a peer
            case 'peer-media-stream' :
                switch(data.source) {
                    //send current camera
                    case 'camera' :
                        window.LocalServer.LocalPeer.callPeer(data.id);
                    break;

                    //send current video
                    case 'video' :
                        
                    break;

                    default :
                    break;
                }
            break;

            //update peer media connection status
            case 'peer-media-status' :
                //window.LocalServer.LocalServer.UpdatePeerMediaStatus(data.connected);
            break;

            //media data from current video
            case 'media-data' :
                VideoController.SetState({
                    CurrentTime:data.currentTime
                });
            break;

            default :
            break;
        }
    }

    /**
     * Sends data to the listening window.
     * @param {Object} data 
     */
    async send(data) {
        if(this.Receiver) {
            switch(data.type) {
                case 'state' :
                    if(data.app === 'CC') {
                        data.state.Source = this.SendKey;
                    }
                    this.Receiver.webContents.send(this.SendKey, data);
                break;
                default :
                    this.Receiver.webContents.send(this.SendKey, data);
                break;
            }
        }
    }

    /**
     * Sends a request for the state of a given controller.
     * @param {string} app 
     */
    async requestState(app) {
        this.send({
            type:'request-state',
            app:app
        });
    }
}

export default IPCX;