/**
 * Main component for the capture window.
 */

import React from 'react';
import CaptureScoreboard from './CaptureScoreboard';
import CaptureScorebanner from './CaptureScorebanner';
import CaptureJamClock from './CaptureJamClock';
import CaptureJamCounter from './CaptureJamCounter';
import CaptureCamera from './CaptureCamera';
import CaptureVideo from './CaptureVideo';
import CaptureSlideshow from './CaptureSlideshow'
import CapturePenaltyTracker from './CapturePenaltyTracker'
import CaptureAnthem from './CaptureAnthem'
import CaptureRaffle from './CaptureRaffle'
import CaptureScorekeeper from './CaptureScorekeeper'

import cnames from 'classnames'

import CaptureController, {CaptureControllerState} from 'controllers/CaptureController'
import IPCX from 'controllers/IPCX';
import './css/CaptureForm.scss';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureSponsor from './CaptureSponsor';
import vars from 'tools/vars';

import CaptureStatus from 'tools/CaptureStatus';
import CaptureAnnouncers from './CaptureAnnouncers';
import CaptureRoster from './CaptureRoster';
import VideoController from 'controllers/VideoController';
import SlideshowController from 'controllers/SlideshowController';
import PenaltyController from 'controllers/PenaltyController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import RaffleController from 'controllers/RaffleController';

interface SCaptureForm extends CaptureControllerState {
    JamState:number
}

class CaptureForm extends React.Component<any, SCaptureForm> {

    readonly state:SCaptureForm = Object.assign({}, 
        CaptureController.getState(),
        {JamState:ScoreboardController.getState().JamState}
        );

    remoteCapture:Function
    remoteScoreboard:Function
    remoteStatus?:Function

    constructor(props) {
        super(props);
        this.onPeerData = this.onPeerData.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateState);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(CaptureController.getState());
    }

    /**
     * Updates the scoreboard state to match the controller.
     */
    updateScoreboard() {
        this.setState({
            JamState:ScoreboardController.getState().JamState
        });
    }

    /**
     * Triggered when the capture status is updated, and sends it to the listening IPC.
     */
    updateStatus() {
        if(window && window.IPC) {
            window.IPC.send({
                type:'state',
                app:'CS',
                state:Object.assign({}, CaptureStatus.getState())
            })
        }
    }

    onPeerData(peer, data) {
        
    }

    /**
     * Triggered when the component is mounted.
     * - Position capture window to the secondary monitor, if available.
     */
    componentDidMount() {
        DataController.Init();
        
        if(window && window.RDMGR && window.RDMGR.captureWindow) {
            window.RDMGR.captureWindow.setTitle('RDMGR : Capture Window');
            const displays = window.require('electron').remote.screen.getAllDisplays();
            if(displays.length > 1) {
                const bounds = displays[1].bounds;
                window.RDMGR.captureWindow.setBounds({
                    x:bounds.x,
                    y:bounds.y,
                    width:1280,
                    height:720
                });
                window.RDMGR.captureWindow.setFullScreen(false);
            }

            this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);

            //load user config file
            DataController.loadConfig().then(() => {
                window.initCaptureServer(DataController);
                window.LocalServer.onDataReceived = this.onPeerData;
                
                window.IPC = new IPCX('captureMessage', 'controlMessage', window.RDMGR.mainWindow);
                //request states
                window.IPC.requestState(CaptureController.Key);
                window.IPC.requestState(ScoreboardController.Key);
                window.IPC.requestState(RaffleController.Key);
                window.IPC.requestState(VideoController.Key);
                window.IPC.requestState(SlideshowController.Key);
                window.IPC.requestState(PenaltyController.Key);
                window.IPC.requestState(ScorekeeperController.Key);
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var classScoreboard = cnames(this.state.Scoreboard.className, {
            light:this.state.Scoreboard.Light
        });

        var className = cnames('capture-form',
            `camera-${this.state.MainCamera.className}`,
            `video-${this.state.MainVideo.className}`,
            `scorebanner-${this.state.Scorebanner.className}-${(this.state.Scorebanner.Shown) ? 'shown' : 'hidden'}`,
            `roster-${(this.state.Roster.Shown) ? 'shown' : 'hidden'}`,
            this.state.className,
            {
                jamming:(this.state.JamState === vars.Clock.Status.Running)
            }
        );

        var style = {
            backgroundImage:`url('${DataController.mpath('/default/leaguebg.jpg')}')`
        };

        return (
            <div className={className} style={style}>
                <CaptureCamera shown={this.state.MainCamera.Shown} className={this.state.MainCamera.className}/>
                <CaptureVideo shown={this.state.MainVideo.Shown} className={this.state.MainVideo.className}/>
                <CaptureScoreboard shown={this.state.Scoreboard.Shown} className={classScoreboard}/>
                <CaptureSlideshow shown={this.state.MainSlideshow.Shown}/>
                <CaptureSponsor shown={this.state.SponsorSlideshow.Shown}/>
                <CaptureScorebanner 
                    shown={this.state.Scorebanner.Shown} 
                    className={this.state.Scorebanner.className}
                    clocks={this.state.Scorebanner.ClocksShown}
                    />
                <CapturePenaltyTracker
                    shown={this.state.PenaltyTracker.Shown}
                    className={this.state.PenaltyTracker.className}
                />
                <CaptureAnthem shown={this.state.NationalAnthem.Shown}/>
                <CaptureJamClock shown={this.state.Scoreboard.JamClockShown}/>
                <CaptureJamCounter shown={this.state.Scoreboard.JamCounterShown}/>
                <CaptureRaffle shown={this.state.Raffle.Shown}/>
                <CaptureScorekeeper shown={this.state.Scorekeeper.Shown}/>
                <CaptureAnnouncers shown={this.state.Announcers.Shown}/>
                <CaptureRoster shown={this.state.Roster.Shown}/>
            </div>
        );
    }
}

export default CaptureForm