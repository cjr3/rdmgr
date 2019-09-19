import React from 'react'
import Video from 'components/tools/Video'
import cnames from 'classnames'
import VideoController, {SVideoController} from 'controllers/VideoController';
import './css/CaptureVideo.scss'
import vars from 'tools/vars';
import CaptureStatus from 'tools/CaptureStatus';

interface PCaptureVideo {
    shown?:boolean,
    className?:string
}

class CaptureVideo extends React.PureComponent<PCaptureVideo, SVideoController> {
    readonly state:SVideoController = VideoController.getState();
    VideoItem:React.RefObject<Video>
    remoteState:Function

    constructor(props) {
        super(props);
        this.VideoItem = React.createRef();
        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteState = VideoController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(VideoController.getState());
    }

    /**
     * Triggered when the video ends.
     */
    onEnded() {
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
    onTimeUpdate(video) {
        CaptureStatus.UpdateVideo(video.currentTime, video.duration);
        this.setState({
            CurrentTime:video.currentTime,
            Duration:video.duration
        });
    }

    /**
     * Triggered when the video plays.
     */
    onPlay() {
        CaptureStatus.UpdateVideoStatus(vars.Video.Status.Playing);
    }

    /**
     * Renders the component.
     */
    render() {
        var classNames = cnames('main-video', {shown:(this.props.shown)}, this.props.className);
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

export default CaptureVideo;