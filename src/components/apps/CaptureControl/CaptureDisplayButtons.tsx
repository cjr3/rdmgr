import React from 'react';
import CaptureController from 'controllers/CaptureController';
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
    IconMovie
} from 'components/Elements';


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
    NationalAnthem:boolean;
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
}> {
    readonly state = {
        Announcers:CaptureController.getState().Announcers.Shown,
        MainCamera:CaptureController.getState().MainCamera.Shown,
        MainSlideshow:CaptureController.getState().MainSlideshow.Shown,
        MainVideo:CaptureController.getState().MainVideo.Shown,
        NationalAnthem:CaptureController.getState().NationalAnthem.Shown,
        PenaltyTracker:CaptureController.getState().PenaltyTracker.Shown,
        Scorebanner:CaptureController.getState().Scorebanner.Shown,
        Scoreboard:CaptureController.getState().Scoreboard.Shown,
        SponsorSlideshow:CaptureController.getState().SponsorSlideshow.Shown,
        JamClock:CaptureController.getState().Scoreboard.JamClockShown,
        JamCounter:CaptureController.getState().Scoreboard.JamCounterShown,
        Raffle:CaptureController.getState().Raffle.Shown
    };

    /**
     * Listener for capture controller
     */
    protected remoteCapture:Function|null = null;

    /**
     * 
     * @param props any
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Updates the state to match the Capture Controller
     */
    updateState() {
        this.setState(() => {
            var cstate = CaptureController.getState();
            return {
                Announcers:cstate.Announcers.Shown,
                MainCamera:cstate.MainCamera.Shown,
                MainSlideshow:cstate.MainSlideshow.Shown,
                MainVideo:cstate.MainVideo.Shown,
                NationalAnthem:cstate.NationalAnthem.Shown,
                PenaltyTracker:cstate.PenaltyTracker.Shown,
                Scorebanner:cstate.Scorebanner.Shown,
                Scoreboard:cstate.Scoreboard.Shown,
                SponsorSlideshow:cstate.SponsorSlideshow.Shown,
                JamClock:cstate.Scoreboard.JamClockShown,
                JamCounter:cstate.Scoreboard.JamCounterShown,
                Raffle:cstate.Raffle.Shown
            };
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateState);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
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
                    onClick={CaptureController.ToggleAnnouncers}>
                        Announcers
                </IconButton>
                <IconButton
                    src={IconFlag}
                    active={this.state.NationalAnthem}
                    onClick={CaptureController.ToggleNationalAnthem}>
                        Anthem
                </IconButton>
                <IconButton
                    src={IconStreamOff}
                    active={this.state.MainCamera}
                    onClick={CaptureController.ToggleMainCamera}>
                        Camera
                </IconButton>
                <IconButton
                    src={IconStopwatch}
                    active={this.state.JamClock}
                    onClick={CaptureController.ToggleJamClock}>
                        Jam Clock
                </IconButton>
                <IconButton
                    src={IconPlus}
                    active={this.state.JamCounter}
                    onClick={CaptureController.ToggleJamCounter}>
                        Jam #
                </IconButton>
                <IconButton
                    src={IconWhistle}
                    active={this.state.PenaltyTracker}
                    onClick={CaptureController.TogglePenaltyTracker}>
                        Penalties
                </IconButton>
                <IconButton
                    src={IconTicket}
                    active={this.state.Raffle}
                    onClick={CaptureController.ToggleRaffle}>Raffle</IconButton>
                <IconButton
                    src={IconSkate}
                    active={this.state.Scorebanner}
                    onClick={CaptureController.ToggleScorebanner}>
                        Score Banner
                </IconButton>
                <IconButton
                    src={IconSkate}
                    active={this.state.Scoreboard}
                    onClick={CaptureController.ToggleScoreboard}>
                        Scoreboard
                </IconButton>
                <IconButton
                    src={IconSlideshow}
                    active={this.state.MainSlideshow}
                    onClick={CaptureController.ToggleSlideshow}>
                        Slideshow
                </IconButton>
                <IconButton
                    src={IconSlideshow}
                    active={this.state.SponsorSlideshow}
                    onClick={CaptureController.ToggleSponsors}>
                        Sponsors
                </IconButton>
                <IconButton
                    src={IconMovie}
                    active={this.state.MainVideo}
                    onClick={CaptureController.ToggleMainVideo}>
                        Video
                </IconButton>
            </React.Fragment>
        )
    }
}