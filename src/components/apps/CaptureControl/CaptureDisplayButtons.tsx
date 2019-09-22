import React from 'react';
import CaptureController from 'controllers/CaptureController';

import {Button} from 'components/Elements';

/**
 * Interface for the state of the CaptureDisplayButtons component
 */
interface CaptureDisplayButtonState {
    /**
     * Determines if the scoreboard is visible or not
     */
    Scoreboard:boolean,
    /**
     * Determines if the main camera is visible or not.
     */
    MainCamera:boolean,
    /**
     * Determines if the main video is displayed or not.
     */
    MainVideo:boolean,
    /**
     * Determines if the scorebanner is displayed or not
     */
    Scorebanner:boolean,
    /**
     * Determines if the national anthem singer is displayed or not
     */
    NationalAnthem:boolean,
    /**
     * Determines if the sponsor slideshow is displayed or not
     */
    SponsorSlideshow:boolean,
    /**
     * Determines if the main slideshow is visible or not
     */
    MainSlideshow:boolean,
    /**
     * Determines if the announcer is visible or not
     */
    Announcers:boolean,
    /**
     * Determines if the penalty tracker is shown or not
     */
    PenaltyTracker:boolean,
    /**
     * Determines if the full-screen jam clock is shown
     */
    JamClock:boolean,
    /**
     * Determines if the full-screen jam counter is shown
     */
    JamCounter:boolean
    /**
     * Determines if the raffle screen is shown
     */
    Raffle:boolean
};

/**
 * A component for buttons that control what is visible on the capture window.
 */
class CaptureDisplayButtons extends React.PureComponent<any, CaptureDisplayButtonState> {
    /**
     * State object
     */
    readonly state:CaptureDisplayButtonState = {
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
    protected remote:Function

    /**
     * 
     * @param props any
     */
    constructor(props) {
        super(props);
        this.updateState = this.updateState.bind(this);
        this.remote = CaptureController.subscribe(this.updateState);
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
     * Renders the component
     */
    render() {
        return (
            <React.Fragment>
                <Button
                    active={this.state.NationalAnthem}
                    onClick={CaptureController.ToggleNationalAnthem}>
                        Anthem
                </Button>
                <Button
                    active={this.state.MainCamera}
                    onClick={CaptureController.ToggleMainCamera}>
                        Camera
                </Button>
                <Button
                    active={this.state.JamClock}
                    onClick={CaptureController.ToggleJamClock}>
                        Jam Clock
                </Button>
                <Button
                    active={this.state.JamCounter}
                    onClick={CaptureController.ToggleJamCounter}>
                        Jam #
                </Button>
                <Button
                    active={this.state.PenaltyTracker}
                    onClick={CaptureController.TogglePenaltyTracker}>
                        Penalties
                </Button>
                <Button
                    active={this.state.Raffle}
                    onClick={CaptureController.ToggleRaffle}>Raffle</Button>
                <Button
                    active={this.state.Scorebanner}
                    onClick={CaptureController.ToggleScorebanner}>
                        Scorebanner
                </Button>
                <Button
                    active={this.state.Scoreboard}
                    onClick={CaptureController.ToggleScoreboard}>
                        Scoreboard
                </Button>
                <Button
                    active={this.state.MainSlideshow}
                    onClick={CaptureController.ToggleSlideshow}>
                        Slideshow
                </Button>
                <Button
                    active={this.state.SponsorSlideshow}
                    onClick={CaptureController.ToggleSponsors}>
                        Sponsors
                </Button>
                <Button
                    active={this.state.MainVideo}
                    onClick={CaptureController.ToggleMainVideo}>
                        Video
                </Button>
            </React.Fragment>
        )
    }
}

export default CaptureDisplayButtons;