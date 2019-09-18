import React from 'react'
import Video from 'components/tools/Video'
import cnames from 'classnames'
import VideoController from 'controllers/VideoController';
import './css/CaptureVideo.scss'
import vars from 'tools/vars';
import CaptureStatus from 'tools/CaptureStatus';

class CaptureVideo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, VideoController.getState());
        this.VideoItem = React.createRef();

        this.onEnded = this.onEnded.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.updateState = this.updateState.bind(this);

        this.remote = VideoController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState(() => {
            return Object.assign({}, VideoController.getState());
        });
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
        //console.log(`Time: ${this.state.CurrentTime}/${this.state.Duration}`);
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
                brightness={this.state.Brightness}
                contrast={this.state.Contrast}
                grayscale={this.state.Grayscale}
                inversion={this.state.Inversion}
                saturation={this.state.Saturation}
                sepia={this.state.Sepia}
                blur={this.state.Blur}
                autoplay={this.state.AutoPlay}
                loop={this.state.Loop}
                width="1280"
                height="720"
                onEnded={this.onEnded}
                onTimeUpdate={this.onTimeUpdate}
                onPlay={this.onPlay}
                />
        )
    }
}

export default CaptureVideo;