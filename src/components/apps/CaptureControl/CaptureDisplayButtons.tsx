import React from 'react';
import {
    IconButton, 
    IconMic, 
    IconFlag, 
    IconStreamOff, 
    IconStopwatch, 
    IconPlus, 
    IconWhistle, 
    IconTicket, 
    IconSkate, 
    IconSlideshow, 
    IconMovie,
    IconTeam,
    IconClipboard
} from 'components/Elements';
import AnnouncerCaptureController from 'controllers/capture/Announcer';
import CameraCaptureController from 'controllers/capture/Camera';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import VideoCaptureController from 'controllers/capture/Video';
import AnthemCaptureController from 'controllers/capture/Anthem';
import PenaltyCaptureController from 'controllers/capture/Penalty';
import ScoreboardCaptureController, { ScorebannerCaptureController, JamClockCaptureController, JamCounterCaptureController } from 'controllers/capture/Scoreboard';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import SponsorCaptureController from 'controllers/capture/Sponsor';
import RaffleCaptureController from 'controllers/capture/Raffle';
import RosterCaptureController from 'controllers/capture/Roster';
import { Unsubscribe } from 'redux';


/**
 * A component for buttons that control what is visible on the capture window.
 */
export default class CaptureDisplayButtons extends React.PureComponent<any, {
    /**
     * Determines if the scoreboard is visible or not
     */
    Scoreboard:boolean;
    /**
     * Determines if the main camera is visible or not.
     */
    MainCamera:boolean;
    /**
     * Determines if the main video is displayed or not.
     */
    MainVideo:boolean;
    /**
     * Determines if the scorebanner is displayed or not
     */
    Scorebanner:boolean;
    /**
     * Determines if the national anthem singer is displayed or not
     */
    Anthem:boolean;
    /**
     * Determines if the sponsor slideshow is displayed or not
     */
    SponsorSlideshow:boolean;
    /**
     * Determines if the main slideshow is visible or not
     */
    MainSlideshow:boolean;
    /**
     * Determines if the announcer is visible or not
     */
    Announcers:boolean;
    /**
     * Determines if the penalty tracker is shown or not
     */
    PenaltyTracker:boolean;
    /**
     * Determines if the full-screen jam clock is shown
     */
    JamClock:boolean;
    /**
     * Determines if the full-screen jam counter is shown
     */
    JamCounter:boolean;
    /**
     * Determines if the raffle screen is shown
     */
    Raffle:boolean;
    /**
     * Determines if the roster is displayed
     */
    Roster:boolean;
    /**
     * Determines if the Scorekeeper is displayed
     */
    Scorekeeper:boolean;
}> {
    readonly state = {
        Announcers:AnnouncerCaptureController.GetState().Shown,
        MainCamera:CameraCaptureController.GetState().Shown,
        MainVideo:VideoCaptureController.GetState().Shown,
        Anthem:AnthemCaptureController.GetState().Shown,
        PenaltyTracker:PenaltyCaptureController.GetState().Shown,
        Scoreboard:ScoreboardCaptureController.GetState().Shown,
        Scorebanner:ScorebannerCaptureController.GetState().Shown,
        Scorekeeper:ScorekeeperCaptureController.GetState().Shown,
        Roster:RosterCaptureController.GetState().Shown,
        JamClock:JamClockCaptureController.GetState().Shown,
        JamCounter:JamCounterCaptureController.GetState().Shown,
        MainSlideshow:SlideshowCaptureController.GetState().Shown,
        SponsorSlideshow:SponsorCaptureController.GetState().Shown,
        Raffle:RaffleCaptureController.GetState().Shown
    };

    /**
     * Listener for capture controller
     */
    protected remoteCapture?:Unsubscribe;
    protected remoteAnnouncers?:Unsubscribe;
    protected remoteAnthem?:Unsubscribe;
    protected remoteCamera?:Unsubscribe;
    protected remotePenalty?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;
    protected remoteJamClock?:Unsubscribe;
    protected remoteJamCounter?:Unsubscribe;
    protected remoteSlideshow?:Unsubscribe;
    protected remoteSponsors?:Unsubscribe;
    protected remoteScorebanner?:Unsubscribe;
    protected remoteRaffle?:Unsubscribe;
    protected remoteRoster?:Unsubscribe;
    protected remoteVideo?:Unsubscribe;

    /**
     * 
     * @param props any
     */
    constructor(props) {
        super(props);
        this.updateAnnouncers = this.updateAnnouncers.bind(this);
        this.updateAnthem = this.updateAnthem.bind(this);
        this.updateCamera = this.updateCamera.bind(this);
        this.updatePenaltyTracker = this.updatePenaltyTracker.bind(this);
        this.updateJamClock = this.updateJamClock.bind(this);
        this.updateJamCounter = this.updateJamCounter.bind(this);
        this.updateRaffle = this.updateRaffle.bind(this);
        this.updateRoster = this.updateRoster.bind(this);
        this.updateScorebanner = this.updateScorebanner.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateScorekeper = this.updateScorekeper.bind(this);
        this.updateSlideshow = this.updateSlideshow.bind(this);
        this.updateSponsor = this.updateSponsor.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
    }

    protected updateAnnouncers() {
        this.setState({Announcers:AnnouncerCaptureController.GetState().Shown});
    }

    protected updateAnthem() {
        this.setState({Anthem:AnthemCaptureController.GetState().Shown});
    }

    protected updateCamera() {
        this.setState({MainCamera:CameraCaptureController.GetState().Shown});
    }

    protected updateJamClock() {
        this.setState({JamClock:JamClockCaptureController.GetState().Shown});
    }

    protected updateJamCounter() {
        this.setState({JamCounter:JamCounterCaptureController.GetState().Shown});
    }

    protected updatePenaltyTracker() {
        this.setState({PenaltyTracker:PenaltyCaptureController.GetState().Shown});
    }

    protected updateScorekeper() {
        this.setState({Scorekeeper:ScorekeeperCaptureController.GetState().Shown});
    }
    
    protected updateScorebanner() {
        this.setState({Scorebanner:ScorebannerCaptureController.GetState().Shown});
    }

    protected updateScoreboard() {
        this.setState({Scoreboard:ScoreboardCaptureController.GetState().Shown});
    }

    protected updateSlideshow() {
        this.setState({MainSlideshow:SlideshowCaptureController.GetState().Shown});
    }

    protected updateSponsor() {
        this.setState({SponsorSlideshow:SponsorCaptureController.GetState().Shown});
    }

    protected updateRaffle() {
        this.setState({Raffle:RaffleCaptureController.GetState().Shown});
    }
    
    protected updateRoster() {
        this.setState({Roster:RosterCaptureController.GetState().Shown});
    }

    protected updateVideo() {
        this.setState({MainVideo:VideoCaptureController.GetState().Shown});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteAnnouncers = AnnouncerCaptureController.Subscribe(this.updateAnnouncers);
        this.remoteAnthem = AnthemCaptureController.Subscribe(this.updateAnthem);
        this.remoteCamera = CameraCaptureController.Subscribe(this.updateCamera);
        this.remoteJamClock = JamClockCaptureController.Subscribe(this.updateJamClock);
        this.remoteJamCounter = JamCounterCaptureController.Subscribe(this.updateJamCounter);
        this.remotePenalty = PenaltyCaptureController.Subscribe(this.updatePenaltyTracker);
        this.remoteScorebanner = ScorebannerCaptureController.Subscribe(this.updateScorebanner);
        this.remoteScoreboard = ScoreboardCaptureController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperCaptureController.Subscribe(this.updateScorekeper);
        this.remoteSlideshow = SlideshowCaptureController.Subscribe(this.updateSlideshow);
        this.remoteSponsors = SponsorCaptureController.Subscribe(this.updateSponsor);
        this.remoteRaffle = RaffleCaptureController.Subscribe(this.updateRaffle);
        this.remoteRoster = RosterCaptureController.Subscribe(this.updateRoster);
        this.remoteVideo = VideoCaptureController.Subscribe(this.updateVideo);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteAnnouncers)
            this.remoteAnnouncers();
        if(this.remoteAnthem)
            this.remoteAnthem();
        if(this.remoteCamera)
            this.remoteCamera();
        if(this.remotePenalty)
            this.remotePenalty();
        if(this.remoteJamClock)
            this.remoteJamClock();
        if(this.remoteJamCounter)
            this.remoteJamCounter();
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteScorebanner)
            this.remoteScorebanner();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
        if(this.remoteSlideshow)
            this.remoteSlideshow();
        if(this.remoteSponsors)
            this.remoteSponsors();
        if(this.remoteRaffle)
            this.remoteRaffle();
        if(this.remoteRoster)
            this.remoteRoster();
        if(this.remoteVideo)
            this.remoteVideo();
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <React.Fragment>
                <IconButton
                    src={IconMic}
                    active={this.state.Announcers}
                    onClick={AnnouncerCaptureController.Toggle}>
                        Announcers
                </IconButton>
                <IconButton
                    src={IconFlag}
                    active={this.state.Anthem}
                    onClick={AnthemCaptureController.Toggle}>
                        Anthem
                </IconButton>
                <IconButton
                    src={IconStreamOff}
                    active={this.state.MainCamera}
                    onClick={CameraCaptureController.Toggle}>
                        Camera
                </IconButton>
                <IconButton
                    src={IconStopwatch}
                    active={this.state.JamClock}
                    onClick={JamClockCaptureController.Toggle}>
                        Jam Clock
                </IconButton>
                <IconButton
                    src={IconPlus}
                    active={this.state.JamCounter}
                    onClick={JamCounterCaptureController.Toggle}>
                        Jam Counter
                </IconButton>
                <IconButton
                    src={IconClipboard}
                    active={this.state.Scorekeeper}
                    onClick={ScorekeeperCaptureController.Toggle}>
                        Jammers
                </IconButton>
                <IconButton
                    src={IconWhistle}
                    active={this.state.PenaltyTracker}
                    onClick={PenaltyCaptureController.Toggle}>
                        Penalties
                </IconButton>
                <IconButton
                    src={IconTicket}
                    active={this.state.Raffle}
                    onClick={RaffleCaptureController.Toggle}>Raffle</IconButton>
                <IconButton
                    src={IconSkate}
                    active={this.state.Scorebanner}
                    onClick={ScorebannerCaptureController.Toggle}>
                        Score Banner
                </IconButton>
                <IconButton
                    src={IconSkate}
                    active={this.state.Scoreboard}
                    onClick={ScoreboardCaptureController.Toggle}>
                        Scoreboard
                </IconButton>
                <IconButton
                    src={IconSlideshow}
                    active={this.state.MainSlideshow}
                    onClick={SlideshowCaptureController.Toggle}>
                        Slideshow
                </IconButton>
                <IconButton
                    src={IconSlideshow}
                    active={this.state.SponsorSlideshow}
                    onClick={SponsorCaptureController.Toggle}>
                        Sponsors
                </IconButton>
                <IconButton
                    src={IconTeam}
                    active={this.state.Roster}
                    onClick={RosterCaptureController.Toggle}>
                        Roster
                </IconButton>
                <IconButton
                    src={IconMovie}
                    active={this.state.MainVideo}
                    onClick={VideoCaptureController.Toggle}>
                        Video
                </IconButton>
            </React.Fragment>
        )
    }
}