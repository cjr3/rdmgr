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
};

/**
 * A component for buttons that control what is visible on the capture window.
 */
class CaptureDisplayButtons extends React.PureComponent<any, CaptureDisplayButtonState> {
    /**
     * State object
     */
    readonly state:CaptureDisplayButtonState = {
        Announcers:false,
        MainCamera:false,
        MainSlideshow:false,
        MainVideo:false,
        NationalAnthem:false,
        PenaltyTracker:false,
        Scorebanner:false,
        Scoreboard:false,
        SponsorSlideshow:false,
        JamClock:false,
        JamCounter:false
    };

    /**
     * Subscriber for redux store
     */
    remote:Function

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
                SponsorSlideshow:cstate.SponsorSlideshow.Shown
            };
        });
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    active={this.state.Scoreboard}
                    onClick={CaptureController.ToggleScoreboard}>
                        Board
                </Button>
                <Button
                    active={this.state.Scorebanner}
                    onClick={CaptureController.ToggleScorebanner}>
                        Banner
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
                    active={this.state.MainCamera}
                    onClick={CaptureController.ToggleMainCamera}>
                        Camera
                </Button>
                <Button
                    active={this.state.MainVideo}
                    onClick={CaptureController.ToggleMainVideo}>
                        Video
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
                    active={this.state.PenaltyTracker}
                    onClick={CaptureController.TogglePenaltyTracker}>
                        Penalties
                </Button>
                <Button
                    active={this.state.NationalAnthem}
                    onClick={CaptureController.ToggleNationalAnthem}>
                        Anthem
                </Button>
            </React.Fragment>
        )
    }
}

export default CaptureDisplayButtons;