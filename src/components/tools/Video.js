import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars'

class Video extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Brush = null;
        //this.VideoElement = document.createElement('video');
        this.Canvas = React.createRef();
        this.VideoItem = React.createRef();
        this.TimeChanging = false;

        this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onError = this.onError.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPlaying = this.onPlaying.bind(this);
        this.onRateChange = this.onRateChange.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onVolumeChange = this.onVolumeChange.bind(this);
        this.onSeeking = this.onSeeking.bind(this);
        this.onSeeked = this.onSeeked.bind(this);
        this.onLoadedMetaData = this.onLoadedMetaData.bind(this);
        this.onWorkerMessage = this.onWorkerMessage.bind(this);

        //this.VideoElement.oncanplaythrough = this.onCanPlayThrough;
        //this.VideoElement.ondurationchange = this.onDurationChange;
        //this.VideoElement.onended = this.onEnded;
        //this.VideoElement.onerror = this.onError;
        //this.VideoElement.onpause = this.onPause;
        //this.VideoElement.onplay = this.onPlay;
        //this.VideoElement.onPlaying = this.onPlaying;
        //this.VideoElement.onratechange = this.onRateChange;
        //this.VideoElement.ontimeupdate = this.onTimeUpdate;
        //this.VideoElement.onloadedmetadata = this.onLoadedMetaData;

        //this.worker = new Worker('tools/Animator.js')
        //this.worker.onmessage = this.onWorkerMessage;
    }

    onCanPlayThrough() {
        if(Number.isNaN(this.props.volume) === true) {
            //this.VideoElement.volume = this.props.volume;
        }

        if(this.props.status === vars.Video.Status.Playing) {
            this.VideoItem.current.play();
        }

        //if(typeof(this.props.muted) === "boolean")
            //this.VideoElement.muted = this.props.muted;
        
        //if(Number.isNaN(this.props.rate) === true)
            //this.VideoElement.playbackRate = this.props.rate;

        if(this.props.onCanPlayThrough)
            this.props.onCanPlayThrough(this.VideoItem.current, this);
    }

    onDurationChange() {
        if(this.props.onDurationChange)
            this.props.onDurationChange(this.VideoItem.current, this);
    }

    onLoadedMetaData() {
        if(this.props.autoplay) {
            //this.play();
            this.VideoItem.current.play();
        }
    }

    onEnded() {
        if(this.props.loop) {
            this.stop();
            this.play();
        } else {
            if(this.props.onEnded)
                this.props.onEnded(this.VideoItem.current, this);
        }
    }

    onError() {
        if(this.props.onError)
            this.props.onError(this.VideoElement, this);
    }

    onPause() {
        if(this.props.status === vars.Video.Status.AutoPlay 
            && this.VideoItem.current.currentTime === this.VideoItem.current.duration) {
            this.start();
        }

        if(this.props.onPause)
            this.props.onPause(this.VideoItem.current, this);
    }

    onPlay() {
        if(this.props.onPlay)
            this.props.onPlay(this.VideoItem.current, this);
    }

    onPlaying() {
        if(this.props.onPlaying)
            this.props.onPlaying(this.VideoItem.current, this);
    }

    onRateChange() {
        if(this.props.onRateChange)
            this.props.onRateChange(this.VideoItem.current, this);
    }

    onTimeUpdate() {
        //if(this.props.status !== vars.Video.Status.Playing)
            //this.paint();

        if(this.props.onTimeUpdate)
            this.props.onTimeUpdate(this.VideoItem.current, this);
    }

    onVolumeChange() {
        if(this.props.onVolumeChange)
            this.props.onVolumeChange(this.VideoItem.current, this);
    }

    onSeeked() {
        //this.paint();
        this.TimeChanging = false;
    }

    onSeeking() {
        this.TimeChanging = true;
    }

    /**
     * Triggered when the web worker for animations responds.
     * @param {Object} response 
     */
    onWorkerMessage(response) {
        if(response.data === 'render')
            this.paint();
    }

    paint() {
        if(this.Brush === null)
            return;

        //paint the video on paused or playing
        if(this.props.status === vars.Video.Status.Playing
            || this.props.status === vars.Video.Status.Paused
            || this.props.status === vars.Video.Status.AutoPlay
            ) {
            var filters = [];

            //brightness
            if(!Number.isNaN(this.props.brightness) && this.props.brightness !== 100) {
                filters.push("brightness(" + this.props.brightness + "%)");
            }

            //contrast
            if(!Number.isNaN(this.props.contrast) && this.props.contrast !== 100) {
                filters.push("contrast(" + this.props.contrast + "%)");
            }

            //grayscale
            if(!Number.isNaN(this.props.grayscale) && this.props.grayscale > 0) {
                filters.push("grayscale(" + this.props.grayscale + "%)");
            }

            //inversion
            if(!Number.isNaN(this.props.inversion) && this.props.inversion > 0) {
                filters.push("invert(" + this.props.inversion + "%)");
            }

            //saturation
            if(!Number.isNaN(this.props.saturation) && this.props.saturation !== 100) {
                filters.push("saturate(" + this.props.saturation + "%)");
            }

            //sepia
            if(!Number.isNaN(this.props.sepia) && this.props.sepia > 0) {
                filters.push("sepia(" + this.props.sepia + "%)");
            }

            //blur
            if(!Number.isNaN(this.props.blur) && this.props.blur > 0) {
                filters.push("blur(" + this.props.blur + "px)");
            }

            if(filters.length >= 1) {
                this.Brush.filter = filters.join(' ');
            } else {
                this.Brush.filter = "none";
            }
            this.Brush.drawImage(this.VideoElement, 0, 0, this.props.width, this.props.height);

        } else {
            //clear the image
            this.Brush.clearRect(0, 0, this.props.width, this.props.height);
        }
    }

    /**
     * Stop video.
     */
    async stop() {
        this.pause();
        this.VideoItem.current.src = '';
        //this.VideoItem.current.currentTime = 0;
        //if(this.Brush) {
        //    this.Brush.clearRect(0, 0, this.props.width, this.props.height);
        //}
    }

    /**
     * Play video from beginning.
     */
    async start() {
        this.pause();
        this.VideoItem.current.currentTime = 0;
        this.play();
    }

    /**
     * Play from current position
     */
    play() {
        try {
            if(window && window.client)
                this.VideoItem.current.play();
        } catch(er) {

        }
        /*
        this.VideoItem.current.play().then(() => {
            //this.worker.postMessage('play');
        }).catch((er) => {
            console.log(er)
        });*/
    }

    /**
     * Pause video
     */
    async pause() {
        this.VideoItem.current.pause();
        //this.worker.postMessage('pause');
    }

    fadeVolume(value) {
        if(!this.VideoItem.current)
            return;
        try {clearInterval(this.FadeTimer);} catch(er) {}
        var diff = value - this.VideoItem.current.volume;
        var currentVolume = this.VideoItem.current.volume;
        if(!diff || value === 0 || this.props.status !== vars.Video.Status.Playing) {
            this.VideoItem.current.volume = value;
            return;
        }

        const ticks = 10;
        let tick = 1;
        this.FadeTimer = setInterval(() => {
            this.VideoItem.current.volume = currentVolume + ((tick / ticks) * diff);
            tick++;
            if(tick >= ticks) {
                clearInterval(this.FadeTimer);
            }
        }, 100);
    }

    setTime(value) {
        //this.VideoElement.currentTime = value;
        if(this.VideoItem.current && this.props.status !== vars.Video.Status.Playing)
            this.VideoItem.current.currentTime = value;
    }

    componentDidMount() {
        //this.Brush = this.Canvas.current.getContext('2d');

        //this.VideoElement.src = this.props.source;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.status !== this.props.status) {
            switch(this.props.status) {
                case vars.Video.Status.Ready :
                    //stop and reset
                    this.stop();
                break;
                
                case vars.Video.Status.AutoPlay :
                case vars.Video.Status.Playing :
                    //play from current position
                    this.play();
                break;

                case vars.Video.Status.Paused :
                    //pause video at current position
                    this.pause();
                break;

                case vars.Video.Status.Stopped :
                    //stop video 
                    this.stop();
                break;

                default :

                break;
            }
        }

        //volume changed
        if(prevProps.volume !== this.props.volume) {
            //this.VideoElement.volume = this.props.volume;
            this.fadeVolume(this.props.volume);
        }

        //rate changed
        if(prevProps.playbackRate !== this.props.rate) {
            if(this.VideoItem.current)
                this.VideoItem.current.playbackRate = this.props.rate;
        }

        //mute
        if(prevProps.muted !== this.props.muted && typeof(this.props.muted) === "boolean") {
            if(this.VideoItem.current)
                this.VideoItem.current.muted = this.props.muted;
        }

        //source changed
        if(prevProps.source !== this.props.source) {
            if(this.VideoItem.current)
                this.VideoItem.current.src = this.props.source;
        }

        //currentTime changed
        //if(prevProps.currentTime !== this.props.currentTime && this.props.status !== vars.Video.Status.Playing) {
        if(prevProps.currentTime !== this.props.currentTime) {
            //console.log("Changing time...")
            this.setTime(this.props.currentTime);
        }
    }

    render() {
        return (
            <video 
                className={cnames('video', this.props.className)}
                //ref={this.Canvas}
                ref={this.VideoItem}
                width={this.props.width}
                height={this.props.height}
                src={this.props.source}
                muted={this.props.muted}
                volume={this.props.volume}
                playbackrate={this.props.rate}
                onCanPlayThrough={this.onCanPlayThrough}
                onLoadedMetadata={this.onLoadedMetaData}
                onEnded={this.onEnded}
                onPlay={this.onPlay}
                onPause={this.onPause}
                onTimeUpdate={this.onTimeUpdate}
                ></video>
        )
    }
}

Video.STATUS_READY = 0;
Video.STATUS_PLAYING = 1;
Video.STATUS_STOPPED = 2;
Video.STATUS_PAUSED = 3;
Video.STATUS_AUTOPLAY = 4;

export default Video;