/**
 * Main component for the capture window.
 */

import React from 'react';
import CaptureScoreboard, { CaptureScoreboardBanner, CaptureJamClock, CaptureJamCounter } from './CaptureScoreboard';
import CaptureCamera from './CaptureCamera';
import CaptureVideo from './CaptureVideo';
import CaptureSlideshow from './CaptureSlideshow'
import CapturePenaltyTracker from './CapturePenaltyTracker'
import CaptureAnthem from './CaptureAnthem'
import CaptureRaffle from './CaptureRaffle'
import CaptureScorekeeper from './CaptureScorekeeper'

import cnames from 'classnames'

import CaptureController from 'controllers/CaptureController'
import IPCX from 'controllers/IPCX';
import './css/CaptureForm.scss';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import CaptureSponsor from './CaptureSponsor';
import vars from 'tools/vars';

import CaptureStatus from 'tools/CaptureStatus';
import CaptureAnnouncers from './CaptureAnnouncers';
import CaptureRoster from './CaptureRoster';

class CaptureForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, CaptureController.getState());
        this.state.JamState = vars.Clock.Status.Ready;

        this.onPeerData = this.onPeerData.bind(this);

        this.updateState = this.updateState.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.remote = CaptureController.subscribe(this.updateState);
        this.remoteScoreboard = ScoreboardController.subscribe(this.updateScoreboard);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState((state) => {
            var cstate = CaptureController.getState();
            var changes = {
                className:cstate.className
            };

            //Main Camera
            if(!DataController.compare(state.MainCamera, cstate.MainCamera))
                changes.MainCamera = Object.assign({}, cstate.MainCamera);

            //Main Video
            if(!DataController.compare(state.MainVideo, cstate.MainVideo))
                changes.MainVideo = Object.assign({}, cstate.MainVideo);

            //Scoreboard
            if(!DataController.compare(state.Scoreboard, cstate.Scoreboard))
                changes.Scoreboard = Object.assign({}, cstate.Scoreboard);

            //Scorebanner
            if(!DataController.compare(state.Scorebanner, cstate.Scorebanner))
                changes.Scorebanner = Object.assign({}, cstate.Scorebanner);

            //Main Slideshow
            if(!DataController.compare(state.MainSlideshow, cstate.MainSlideshow))
                changes.MainSlideshow = Object.assign({}, cstate.MainSlideshow);

            //Sponsor Slideshow
            if(!DataController.compare(state.SponsorSlideshow, cstate.SponsorSlideshow))
                changes.SponsorSlideshow = Object.assign({}, cstate.SponsorSlideshow);

            //National Anthem Singer
            if(!DataController.compare(state.NationalAnthem, cstate.NationalAnthem))
                changes.NationalAnthem = Object.assign({}, cstate.NationalAnthem);

            //Raffle
            if(!DataController.compare(state.Raffle, cstate.Raffle))
                changes.Raffle = Object.assign({}, cstate.Raffle);

            //Penalty Tracker
            if(!DataController.compare(state.PenaltyTracker, cstate.PenaltyTracker))
                changes.PenaltyTracker = Object.assign({}, cstate.PenaltyTracker);

            //Scorekeeper
            if(!DataController.compare(state.Scorekeeper, cstate.Scorekeeper))
                changes.Scorekeeper = Object.assign({}, cstate.Scorekeeper);

            //Announcers
            if(!DataController.compare(state.Announcers, cstate.Announcers))
                changes.Announcers = Object.assign({}, cstate.Announcers);

            //Monitor
            if(!DataController.compare(state.Monitor, cstate.Monitor))
                changes.Monitor = Object.assign({}, cstate.Monitor);

            //Roster
            if(!DataController.compare(state.Roster, cstate.Roster))
                changes.Roster = Object.assign({}, cstate.Roster);

            return changes;
        });
    }

    /**
     * Updates the scoreboard state to match the controller.
     */
    updateScoreboard() {
        var cstate = ScoreboardController.getState();
        if(cstate.JamState !== this.state.JamState) {
            this.setState({JamState:cstate.JamState});
        }
    }

    /**
     * Triggered when the capture status is updated, and sends it to the listening IPC.
     */
    updateStatus() {
        if(window.IPC) {
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
                //this.remoteServer = window.LocalServer.subscribe(this.updateNetwork);
                
                window.IPC = new IPCX('captureMessage', 'controlMessage', window.RDMGR.mainWindow);
                //request states
                window.IPC.requestState('CC');
                window.IPC.requestState('SB');
                window.IPC.requestState('RAF');
                window.IPC.requestState('VID');
                window.IPC.requestState('SS');
                window.IPC.requestState('PT');
                window.IPC.requestState('SK');
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
                <CaptureScoreboardBanner 
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