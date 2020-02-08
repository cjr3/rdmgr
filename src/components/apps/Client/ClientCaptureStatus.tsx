import React from 'react';
import vars from 'tools/vars';
import CaptureStatus, {SCaptureStatus} from 'tools/CaptureStatus';
import {SCaptureControllerState} from 'controllers/capture/vars';
import { ProgressBar } from 'components/Elements';
import {SCaptureController} from 'controllers/CaptureController';
import SlideshowController, {SSlideshowController} from 'controllers/SlideshowController';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import VideoController, {SVideoController} from 'controllers/VideoController';
import VideoCaptureController from 'controllers/capture/Video';
import SponsorCaptureController from 'controllers/capture/Sponsor';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import { Unsubscribe } from 'redux';
import { Basename } from 'controllers/functions.io';
import { SecondsToTime } from 'controllers/functions';

/**
 * Component for displaying the status of the capture window.
 */
export default class ClientCaptureStatus extends React.PureComponent<any, {
    /**
     * CaptureStatus state
     */
    State:SCaptureStatus;
    /**
     * VideoController State
     */
    Video:SVideoController;
    /**
     * SlideshowController state
     */
    Slideshow:SSlideshowController;
    /**
     * SponsorController state
     */
    Sponsors:SSponsorController;
    /**
     * CaptureController's Video State
     */
    CaptureVideo:SCaptureControllerState;
    /**
     * CaptureController's Sponsor State
     */
    CaptureSponsor:SCaptureControllerState;
    /**
     * CaptureController's slideshow state
     */
    CaptureSlideshow:SCaptureControllerState;
}> {
    readonly state = {
        State:CaptureStatus.getState(),
        Video:VideoController.GetState(),
        Slideshow:SlideshowController.GetState(),
        Sponsors:SponsorController.GetState(),
        CaptureVideo:VideoCaptureController.GetState(),
        CaptureSponsor:SponsorCaptureController.GetState(),
        CaptureSlideshow:SlideshowCaptureController.GetState()
    }

    protected remoteStatus?:Unsubscribe;
    protected remoteSlideshow?:Unsubscribe;
    protected remoteSponsor?:Unsubscribe;
    protected remoteVideo?:Unsubscribe;
    protected remoteSlideshowCapture?:Unsubscribe;
    protected remoteSponsorCapture?:Unsubscribe;
    protected remoteVideoCapture?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateStatus = this.updateStatus.bind(this);
        this.updateSlideshow = this.updateSlideshow.bind(this);
        this.updateSponsor = this.updateSponsor.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.updateSlideshowCapture = this.updateSlideshowCapture.bind(this);
        this.updateSponsorCapture = this.updateSponsorCapture.bind(this);
        this.updateVideoCapture = this.updateVideoCapture.bind(this);
    }

    /**
     * Updates the capture status to match the capture status response.
     */
    protected updateStatus() {
        this.setState({State:CaptureStatus.getState()});
    }
    
    protected updateSlideshowCapture() {
        this.setState({CaptureSlideshow:SlideshowCaptureController.GetState()});
    }

    /**
     * Updates the slideshow status
     */
    protected updateSlideshow() {
        this.setState({Slideshow:SlideshowController.GetState()});
    }

    protected updateSponsorCapture() {
        this.setState({CaptureSponsor:SponsorCaptureController.GetState()});
    }

    /**
     * Updates the state to match the sponsor controller.
     */
    protected updateSponsor() {
        this.setState({Sponsors:SponsorController.GetState()});
    }

    protected updateVideoCapture() {
        this.setState({CaptureVideo:VideoCaptureController.GetState()});
    }

    /**
     * Updates the state to match the video controller.
     */
    protected updateVideo() {
        this.setState({Video:VideoController.GetState()});
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
        this.remoteSlideshow = SlideshowController.Subscribe(this.updateSlideshow);
        this.remoteSponsor = SponsorController.Subscribe(this.updateSponsor);
        this.remoteVideo = VideoController.Subscribe(this.updateVideo);
        this.remoteSlideshowCapture = SlideshowCaptureController.Subscribe(this.updateSlideshowCapture);
        this.remoteSponsorCapture = SponsorCaptureController.Subscribe(this.updateSponsorCapture);
        this.remoteVideoCapture = VideoCaptureController.Subscribe(this.updateVideoCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteStatus)
            this.remoteStatus();
        if(this.remoteSlideshow)
            this.remoteSlideshow();
        if(this.remoteSponsor)
            this.remoteSponsor();
        if(this.remoteVideo)
            this.remoteVideo();
        if(this.remoteSlideshowCapture)
            this.remoteSlideshowCapture();
        if(this.remoteSponsorCapture)
            this.remoteSponsorCapture();
        if(this.remoteVideoCapture)
            this.remoteVideoCapture();
    }

    /**
     * Renders the component
     * - Displays different text and progress based on 
     */
    render() {
        let children:React.ReactElement|null = null;
        let max:number = 100;
        let progress:number = 0;

        //Video
        if(this.state.CaptureVideo.Shown && this.state.Video.Status === vars.Video.Status.Playing) {
            progress = this.state.State.Video.CurrentTime;
            max = this.state.State.Video.Duration;
            if(!Number.isNaN(progress) && !Number.isNaN(max)) {
                let str = 
                    Basename(this.state.Video.Source) + " - " +
                    SecondsToTime(progress) + " / " + 
                    SecondsToTime(max);
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
            let str = this.state.Slideshow.Name + " - " + progress + " / " + max;
            if(this.state.Slideshow.Slides[this.state.Slideshow.Index])
                str += " " + this.state.Slideshow.Slides[this.state.Slideshow.Index].Name;
            children = <React.Fragment>
                <div className="text">{str}</div>
            </React.Fragment>
        }
        //Sponsor - Always last
        else if(this.state.CaptureSponsor.Shown && this.state.Sponsors.Slides.length) {
            progress = Math.min(this.state.Sponsors.Index + 1, this.state.Sponsors.Slides.length);
            max = this.state.Sponsors.Slides.length;
            let str = "Sponsor Slide: " + progress + " / " + max;
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