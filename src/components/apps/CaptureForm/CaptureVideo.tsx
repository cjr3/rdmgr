import React from 'react'
import Video from 'components/tools/Video'
import cnames from 'classnames'
import VideoController from 'controllers/VideoController';
import vars from 'tools/vars';
import CaptureStatus from 'tools/CaptureStatus';
import './css/CaptureVideo.scss'
import VideoCaptureController from 'controllers/capture/Video';
import { Unsubscribe } from 'redux';

export default class CaptureVideo extends React.PureComponent<any,{
    Status:number;
    Loop:boolean;
    AutoPlay:boolean;
    Source:string;
    Volume:number;
    Rate:number;
    Duration:number;
    CurrentTime:number;
    Muted:boolean;
    Shown:boolean;
    className:string;
}> {
    readonly state = {
        Status:VideoController.GetState().Status,
        Loop:VideoController.GetState().Loop,
        AutoPlay:VideoController.GetState().AutoPlay,
        Source:VideoController.GetState().Source,
        Volume:VideoController.GetState().Volume,
        Rate:VideoController.GetState().Rate,
        Duration:VideoController.GetState().Duration,
        CurrentTime:VideoController.GetState().CurrentTime,
        Muted:VideoController.GetState().Muted,
        Shown:VideoCaptureController.GetState().Shown,
        className:VideoCaptureController.GetState().className
    }
    /**
     * Video reference
     */
    protected VideoItem:React.RefObject<Video> = React.createRef();
    /**
     * VideoController remote
     */
    protected remoteState?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
    }

    /**
     * Updates the state to match the controller.
     */
    protected updateState() {
        this.setState({
            Status:VideoController.GetState().Status,
            Loop:VideoController.GetState().Loop,
            AutoPlay:VideoController.GetState().AutoPlay,
            Source:VideoController.GetState().Source,
            Volume:VideoController.GetState().Volume,
            Rate:VideoController.GetState().Rate,
            Duration:VideoController.GetState().Duration,
            CurrentTime:VideoController.GetState().CurrentTime,
            Muted:VideoController.GetState().Muted
        });
    }

    protected updateCapture() {
        this.setState({
            Shown:VideoCaptureController.GetState().Shown,
            className:VideoCaptureController.GetState().className
        });
    }

    /**
     * Triggered when the video ends.
     */
    protected onEnded() {
        this.setState({
            Source:'',
            CurrentTime:0,
            Status:vars.Video.Status.Stopped
        }, () => {
            CaptureStatus.UpdateVideoStatus(vars.Video.Status.Stopped);
        });
    }

    /**
     * Triggered when the video time elapses (usually every 1 second).
     * @param {HTMLVideoElement} video 
     */
    protected onTimeUpdate(video) {
        CaptureStatus.UpdateVideo(video.currentTime, video.duration);
        this.setState({
            CurrentTime:video.currentTime,
            Duration:video.duration
        });
    }

    /**
     * Triggered when the video plays.
     */
    protected onPlay() {
        CaptureStatus.UpdateVideoStatus(vars.Video.Status.Playing);
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteState = VideoController.Subscribe(this.updateState);
        this.remoteCapture = VideoCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteState)
            this.remoteState();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component.
     */
    render() {
        let classNames:string = cnames('main-video', {shown:(this.state.Shown)}, this.state.className);
        return (
            <Video
                className={classNames}
                status={this.state.Status}
                source={this.state.Source}
                volume={this.state.Volume}
                muted={this.state.Muted}
                rate={this.state.Rate}
                currentTime={this.state.CurrentTime}
                ref={this.VideoItem}
                autoplay={this.state.AutoPlay}
                loop={this.state.Loop}
                width={1280}
                height={720}
                onEnded={this.onEnded}
                onTimeUpdate={this.onTimeUpdate}
                onPlay={this.onPlay}
                />
        )
    }
}