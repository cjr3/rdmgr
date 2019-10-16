import React, { CSSProperties } from 'react';
import CaptureScoreboard from './CaptureScoreboard';
import CaptureScorebanner from './CaptureScorebanner';
import CaptureJamClock from './CaptureJamClock';
import CaptureJamCounter from './CaptureJamCounter';
import CaptureCamera from './CaptureCamera';
import CaptureCameraPeer from './CaptureCameraPeer';
import CaptureVideo from './CaptureVideo';
import CaptureSlideshow from './CaptureSlideshow'
import CapturePenaltyTracker from './CapturePenaltyTracker'
import CaptureAnthem from './CaptureAnthem'
import CaptureRaffle from './CaptureRaffle'
import CaptureScorekeeper from './CaptureScorekeeper'

import cnames from 'classnames'

import CaptureController from 'controllers/CaptureController'
import IPCX from 'controllers/IPCX';
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

import './css/CaptureForm.scss';

/**
 * Main component for the capture window.
 */
export default class CaptureForm extends React.Component {

    readonly state = Object.assign({}, 
        CaptureController.getState(),
        {
            JamState:ScoreboardController.getState().JamState,
            TeamA:ScoreboardController.getState().TeamA,
            TeamB:ScoreboardController.getState().TeamB
        }
    );

    /**
     * CaptureController remote
     */
    protected remoteCapture:Function|null = null;
    /**
     * ScoreboardController remote
     */
    protected remoteScoreboard:Function|null = null;
    /**
     * CaptureStatus remote
     */
    protected remoteStatus:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onPeerData = this.onPeerData.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
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

    /**
     * Triggered when a peer sends data to the capture window's server
     * @param peer 
     * @param data 
     */
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
            document.body.className = 'capture';

            this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
            this.remoteCapture = CaptureController.subscribe(this.updateState);
            this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);

            //load user config file
            DataController.loadConfig().then(() => {
                //window.initCaptureServer(DataController);
                //window.LocalServer.onDataReceived = this.onPeerData;
                
                window.IPC = new IPCX('captureMessage', 'controlMessage', window.RDMGR.mainWindow);
                //request states
                window.IPC.requestState(CaptureController.Key);
                window.IPC.requestState(ScoreboardController.Key);
                window.IPC.requestState(RaffleController.Key);
                window.IPC.requestState(VideoController.Key);
                window.IPC.requestState(SlideshowController.Key);
                window.IPC.requestState(PenaltyController.Key);
                window.IPC.requestState(ScorekeeperController.Key);
                window.RDMGR.mainWindow.focus();

                //window.onPeerStream = this.onPeerStream;
            });
        }
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteScoreboard !== null)
            this.remoteScoreboard();
        if(this.remoteStatus !== null)
            this.remoteStatus();
    }

    /**
     * Renders the component.
     */
    render() {
        let classScoreboard:string = cnames(this.state.Scoreboard.className, {
            light:this.state.Scoreboard.Light
        });

        let className:string = cnames('capture-form',
            `camera-${this.state.MainCamera.className}`,
            `pcamera-${this.state.PeerCamera.className}`,
            `video-${this.state.MainVideo.className}`,
            `scorebanner-${this.state.Scorebanner.className}-${(this.state.Scorebanner.Shown) ? 'shown' : 'hidden'}`,
            `scoreboard-${(this.state.Scoreboard.Shown) ? 'shown' : 'hidden'}`,
            `roster-${(this.state.Roster.Shown) ? 'shown' : 'hidden'}`,
            this.state.className,
            {
                jamming:(this.state.JamState === vars.Clock.Status.Running)
            }
        );

        let style:CSSProperties = {
            backgroundImage:`url('${DataController.mpath('/default/leaguebg.jpg')}')`
        };

        return (
            <div className={className} style={style}>
                <CaptureCamera shown={this.state.MainCamera.Shown} className={this.state.MainCamera.className}/>
                <CaptureCameraPeer shown={this.state.PeerCamera.Shown} className={this.state.PeerCamera.className}/>
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
                <CaptureScorekeeper 
                    shown={this.state.Scorekeeper.Shown}
                    TeamA={this.state.TeamA}
                    TeamB={this.state.TeamB}
                    />
                <CaptureAnnouncers shown={this.state.Announcers.Shown}/>
                <CaptureRoster shown={this.state.Roster.Shown}/>
            </div>
        );
    }
}