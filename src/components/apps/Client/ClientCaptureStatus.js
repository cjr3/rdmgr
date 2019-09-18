import React from 'react';
import vars from 'tools/vars';
import CaptureStatus from 'tools/CaptureStatus';
import { ProgressBar } from 'components/Elements';

import CaptureController from 'controllers/CaptureController';
import DataController from 'controllers/DataController';
import SlideshowController from 'controllers/SlideshowController';
import SponsorController from 'controllers/SponsorController';
import VideoController from 'controllers/VideoController';

/**
 * Component for displaying the status of the capture window.
 */
class ClientCaptureStatus extends React.PureComponent {
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

        this.remoteCaptureStatus = CaptureStatus.subscribe(this.updateStatus);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteSlideshow = SlideshowController.subscribe(this.updateSlideshow);
        this.remoteSponsor = SponsorController.subscribe(this.updateSponsor);
        this.remoteVideo = VideoController.subscribe(this.updateVideo);
    }

    /**
     * Updates the capture status to match the capture status response.
     */
    updateStatus() {
        var cstate = CaptureStatus.getState();
        if(!DataController.compare(cstate, this.state.State)) {
            this.setState(() => {
                return {State:Object.assign({}, cstate)};
            });
        }
    }

    /**
     * 
     */
    updateCapture() {
        var cstate = CaptureController.getState();
        //Video
        if(!DataController.compare(cstate.MainVideo, this.state.CaptureVideo)) {
            this.setState({CaptureVideo:Object.assign({}, cstate.MainVideo)});
        }

        //Slideshow
        if(!DataController.compare(cstate.MainSlideshow, this.state.CaptureSlideshow)) {
            this.setState({CaptureSlideshow:Object.assign({}, cstate.MainSlideshow)});
        }

        //Sponsors
        if(!DataController.compare(cstate.SponsorSlideshow, this.state.CaptureSponsor)) {
            this.setState({CaptureSponsor:Object.assign({}, cstate.SponsorSlideshow)});
        }
    }

    /**
     * Updates the slideshow status
     */
    updateSlideshow() {
        var cstate = SlideshowController.getState();
        if(!DataController.compare(cstate, this.state.Slideshow)) {
            this.setState(() => {
                return {Slideshow:Object.assign({}, cstate)};
            })
        }
    }

    /**
     * Updates the state to match the sponsor controller.
     */
    updateSponsor() {
        var cstate = SponsorController.getState();
        if(!DataController.compare(cstate, this.state.Sponsors)) {
            this.setState(() => {
                return {Sponsors:Object.assign({}, cstate)};
            })
        }
    }

    /**
     * Updates the state to match the video controller.
     */
    updateVideo() {
        var cstate = VideoController.getState();
        if(!DataController.compare(cstate, this.state.Video)) {
            this.setState(() => {
                return {Video:Object.assign({}, cstate)};
            });
        }
    }

    /**
     * Renders the component
     * - Displays different text and progress based on 
     */
    render() {
        var children = null;
        var max = 100;
        var progress = 0;

        //Video
        if(this.state.CaptureVideo.Shown && this.state.Video.Status == vars.Video.Status.Playing) {
            progress = parseInt( this.state.State.Video.CurrentTime );
            max = parseInt( this.state.State.Video.Duration );
            if(!Number.isNaN(progress) && !Number.isNaN(max)) {
                var str = 
                    DataController.PATH.basename(this.state.Video.Source) + " - " +
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