import React from 'react';
import vars from 'tools/vars';
import CaptureStatus, {SCaptureStatus} from 'tools/CaptureStatus';
import { ProgressBar } from 'components/Elements';

import CaptureController, {CaptureStateBase, CaptureStateSponsor} from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import SlideshowController, {SSlideshowController} from 'controllers/SlideshowController';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import VideoController, {SVideoController} from 'controllers/VideoController';

interface SClientCaptureStatus {
    State:SCaptureStatus,
    Video:SVideoController,
    Slideshow:SSlideshowController,
    Sponsors:SSponsorController,
    CaptureVideo:CaptureStateBase,
    CaptureSponsor:CaptureStateSponsor,
    CaptureSlideshow:CaptureStateBase
}

/**
 * Component for displaying the status of the capture window.
 */
class ClientCaptureStatus extends React.PureComponent<any, SClientCaptureStatus> {
    readonly state:SClientCaptureStatus = {
        State:CaptureStatus.getState(),
        Video:VideoController.getState(),
        Slideshow:SlideshowController.getState(),
        Sponsors:SponsorController.getState(),
        CaptureVideo:CaptureController.getState().MainVideo,
        CaptureSponsor:CaptureController.getState().SponsorSlideshow,
        CaptureSlideshow:CaptureController.getState().MainSlideshow
    }

    remoteStatus:Function
    remoteCapture:Function
    remoteSlideshow:Function
    remoteSponsor:Function
    remoteVideo:Function

    constructor(props) {
        super(props);
        var cstate = CaptureController.getState();
        this.state = {
            State:Object.assign({}, CaptureStatus.getState()),
            Video:Object.assign({}, VideoController.getState()),
            Slideshow:Object.assign({}, SlideshowController.getState()),
            Sponsors:Object.assign({}, SponsorController.getState()),
            CaptureVideo:Object.assign({}, cstate.MainVideo),
            CaptureSponsor:Object.assign({}, cstate.SponsorSlideshow),
            CaptureSlideshow:Object.assign({}, cstate.MainSlideshow)
        };
        
        this.updateStatus = this.updateStatus.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateSlideshow = this.updateSlideshow.bind(this);
        this.updateSponsor = this.updateSponsor.bind(this);
        this.updateVideo = this.updateVideo.bind(this);

        this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteSlideshow = SlideshowController.subscribe(this.updateSlideshow);
        this.remoteSponsor = SponsorController.subscribe(this.updateSponsor);
        this.remoteVideo = VideoController.subscribe(this.updateVideo);
    }

    /**
     * Updates the capture status to match the capture status response.
     */
    updateStatus() {
        this.setState({State:CaptureStatus.getState()});
    }

    /**
     * 
     */
    updateCapture() {
        this.setState({
            CaptureVideo:CaptureController.getState().MainVideo,
            CaptureSlideshow:CaptureController.getState().MainSlideshow,
            CaptureSponsor:CaptureController.getState().SponsorSlideshow
        });
    }

    /**
     * Updates the slideshow status
     */
    updateSlideshow() {
        this.setState({Slideshow:SlideshowController.getState()});
    }

    /**
     * Updates the state to match the sponsor controller.
     */
    updateSponsor() {
        this.setState({Sponsors:SponsorController.getState()});
    }

    /**
     * Updates the state to match the video controller.
     */
    updateVideo() {
        this.setState({Video:VideoController.getState()});
    }

    /**
     * Renders the component
     * - Displays different text and progress based on 
     */
    render() {
        var children:React.ReactElement|null = null;
        var max = 100;
        var progress = 0;

        //Video
        if(this.state.CaptureVideo.Shown && this.state.Video.Status == vars.Video.Status.Playing) {
            progress = this.state.State.Video.CurrentTime;
            max = this.state.State.Video.Duration;
            if(!Number.isNaN(progress) && !Number.isNaN(max)) {
                var str = 
                    DataController.basename(this.state.Video.Source) + " - " +
                    DataController.secondsToTime(progress) + " / " + 
                    DataController.secondsToTime(max);
                children = <React.Fragment>
                    <div className="text">{str}</div>
                </React.Fragment>
            }
        }
        //Slideshow
        else if(this.state.CaptureSlideshow.Shown && this.state.Slideshow.Slides.length) {
            progress = this.state.Slideshow.Index + 1;
            max = this.state.Slideshow.Slides.length;
            if(progress > max)
                progress = max;
            var str = this.state.Slideshow.Name + " - " + progress + " / " + max + " - " +
                this.state.Slideshow.Slides[this.state.Slideshow.Index].Name;
            children = <React.Fragment>
                <div className="text">{str}</div>
            </React.Fragment>
        }
        //Sponsor - Always last
        else if(this.state.CaptureSponsor.Shown && this.state.Sponsors.Slides.length) {
            progress = Math.min(this.state.Sponsors.Index + 1, this.state.Sponsors.Slides.length);
            max = this.state.Sponsors.Slides.length;
            var str = "Sponsor Slide: " + progress + " / " + max;
            children = <React.Fragment>
                <div className="text">{str}</div>
            </React.Fragment>
        }

        return (
            <div className="capture-status">
                <ProgressBar value={progress} max={max}/>
                <div className="capture-content">{children}</div>
            </div>
        );
    }
}

export default ClientCaptureStatus;