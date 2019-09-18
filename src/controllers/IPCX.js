import CameraController from 'controllers/CameraController';
import DataController from 'controllers/DataController';
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

/**
 * Class for interprocess communication between the capture window
 * and the control window.
 */
class IPCX {
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
                    case 'SB' :
                        ScoreboardController.SetState(data.state);
                    break;
                    //capture control
                    case 'CC' :
                        //if(data.state.Source == this.ReceiveKey) {
                            CaptureController.SetState(data.state);
                        //}
                    break;

                    //capture status
                    case 'CS' :
                        CaptureStatus.SetState(data.state);
                    break;

                    //slideshow
                    case 'SS' :
                        SlideshowController.SetState(data.state);
                    break;

                    //Video
                    case 'VID' :
                        VideoController.SetState(data.state);
                    break;

                    //Raffle
                    case 'RAF' :
                        RaffleController.SetState(data.state);
                    break;

                    //Sponsor Slideshow
                    case 'SPN' :
                        SponsorController.SetState(data.state);
                    break;

                    //Penalty Tracker
                    case 'PT' :
                        PenaltyController.SetState(data.state);
                    break;

                    //Scorekeeper
                    case 'SK' :
                        ScorekeeperController.SetState(data.state);
                    break;

                    //Main Camera
                    case 'CAM' :
                        CameraController.SetState(data.state);
                    break;

                    //Roster
                    case RosterController.Key :
                        RosterController.SetState(data.state);
                    break;

                    default :
                    break;
                }
            break;

            //respond to a state request
            case 'request-state' :
                var state = null;
                switch(data.app) {
                    //scoreboard
                    case 'SB' :
                        state = Object.assign({}, ScoreboardController.getState());
                    break;
                    //capture controler
                    case 'CC' :
                        state = Object.assign({}, CaptureController.getState());
                    break;

                    //capture status
                    case 'CS' :
                        state = Object.assign({}, CaptureStatus.getState());
                    break;

                    //slideshow
                    case 'SS' :
                        state = Object.assign({}, SlideshowController.getState());
                    break;
                    //Video
                    case 'VID' :
                        state = Object.assign({}, VideoController.getState());
                    break;
                    //slideshow
                    case 'RAF' :
                        state = Object.assign({}, RaffleController.getState());
                    break;
                    //sponsor slideshow
                    case 'SPN' :
                        state = Object.assign({}, SponsorController.getState());
                    break;
                    //penalty tracker
                    case 'PT' :
                        state = Object.assign({}, PenaltyController.getState());
                    break;
                    //scorekeeper
                    case 'SK' :
                        state = Object.assign({}, ScorekeeperController.getState());
                    break;
                    //Camera
                    case 'CAM' :
                        state = Object.assign({}, CameraController.getState());
                    break;
                    //Roster
                    case RosterController.Key :
                        state = Object.assign({}, RosterController.getState());
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
                window.LocalServer.LocalPeer.setPeerMediaStatus(data.connected);
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
    send(data) {
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
    requestState(app) {
        this.send({
            type:'request-state',
            app:app
        });
    }
}

export default IPCX;