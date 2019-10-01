import React from 'react';
import vars from 'tools/vars';
import CaptureStatus, {SCaptureStatus} from 'tools/CaptureStatus';
import { ProgressBar } from 'components/Elements';
import CaptureController, {CaptureStateBase, CaptureStateSponsor} from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import SlideshowController, {SSlideshowController} from 'controllers/SlideshowController';
import SponsorController, {SSponsorController} from 'controllers/SponsorController';
import VideoController, {SVideoController} from 'controllers/VideoController';

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
    CaptureVideo:CaptureStateBase;
    /**
     * CaptureController's Sponsor State
     */
    CaptureSponsor:CaptureStateSponsor;
    /**
     * CaptureController's slideshow state
     */
    CaptureSlideshow:CaptureStateBase;
}> {
    readonly state = {
        State:CaptureStatus.getState(),
        Video:VideoController.getState(),
        Slideshow:SlideshowController.getState(),
        Sponsors:SponsorController.getState(),
        CaptureVideo:CaptureController.getState().MainVideo,
        CaptureSponsor:CaptureController.getState().SponsorSlideshow,
        CaptureSlideshow:CaptureController.getState().MainSlideshow
    }

    /**
     * CaptureStatus listener
     */
    protected remoteStatus:Function|null = null;
    /**
     * CaptureController listener
     */
    protected remoteCapture:Function|null = null;
    /**
     * SlideshowController listener
     */
    protected remoteSlideshow:Function|null = null;
    /**
     * SponsorController listener
     */
    protected remoteSponsor:Function|null = null;
    /**
     * VideoController listener
     */
    protected remoteVideo:Function|null = null;

    constructor(props) {
        super(props);
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
     * Start listeners
     */
    componentDidMount() {
        this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteSlideshow = SlideshowController.subscribe(this.updateSlideshow);
        this.remoteSponsor = SponsorController.subscribe(this.updateSponsor);
        this.remoteVideo = VideoController.subscribe(this.updateVideo);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteStatus !== null)
            this.remoteStatus();
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteSlideshow !== null)
            this.remoteSlideshow();
        if(this.remoteSponsor !== null)
            this.remoteSponsor();
        if(this.remoteVideo !== null)
            this.remoteVideo();
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
            let str = this.state.Slideshow.Name + " - " + progress + " / " + max + " - " +
                this.state.Slideshow.Slides[this.state.Slideshow.Index].Name;
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