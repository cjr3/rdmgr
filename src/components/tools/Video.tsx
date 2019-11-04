import React from 'react'
import cnames from 'classnames'
import vars from 'tools/vars'

interface PVideo {
    source:string,
    width:number,
    height:number,
    currentTime?:number,
    muted?:boolean,
    rate?:number,
    volume?:number,
    status?:number,
    autoplay?:boolean,
    className?:string,
    loop?:boolean,
    onCanPlayThrough?:Function,
    onDurationChange?:Function,
    onEnded?:Function,
    onError?:Function,
    onPause?:Function,
    onPlay?:Function,
    onPlaying?:Function,
    onRateChange?:Function,
    onTimeUpdate?:Function,
    onVolumeChange?:Function
}

/**
 * Component for displaying and controlling a video
 */
export default class Video extends React.PureComponent<{
    /**
     * Current source URL
     */
    source:string;
    /**
     * width of the video element
     */
    width:number;
    /**
     * height of the video element
     */
    height:number;
    /**
     * current playback time
     */
    currentTime?:number;
    /**
     * true to mute, false to not mute
     */
    muted?:boolean;
    /**
     * Playback rate, between 0.5 and 16
     */
    rate?:number;
    /**
     * Volume, between 0.0 and 1.0
     */
    volume?:number;
    /**
     * Current status (paused, stopped, playing)
     */
    status?:number;
    /**
     * true to auto-play when ready, false to not
     */
    autoplay?:boolean;
    /**
     * Additional class names
     */
    className?:string;
    /**
     * True to loop playback when video ends
     */
    loop?:boolean;
    /**
     * Triggered when the video can play through completely without buffering
     */
    onCanPlayThrough?:Function;
    /**
     * Triggered when the duration of the video changes
     */
    onDurationChange?:Function;
    /**
     * Triggered when the video ends
     */
    onEnded?:Function;
    /**
     * Triggered when the video encounters an error
     */
    onError?:Function;
    /**
     * Triggered when the video is paused
     */
    onPause?:Function;
    /**
     * Triggered when the video begins playing
     */
    onPlay?:Function;
    /**
     * Triggered when the video is playing
     */
    onPlaying?:Function;
    /**
     * Triggered when the playback rate changes
     */
    onRateChange?:Function;
    /**
     * Triggered when the video forwards / reverses normally (ie, playing)
     */
    onTimeUpdate?:Function;
    /**
     * Triggered when the volume changes
     */
    onVolumeChange?:Function;
}> {
    /**
     * Reference to video element
     */
    protected VideoItem:React.RefObject<HTMLVideoElement> = React.createRef();
    /**
     * Flag to prevent certain changes from being made when the video's currentTime is changing
     */
    protected TimeChanging:boolean = false;

    /**
     * Timer for fading volume
     * - We don't immediately change volume; we fade it up/down for quality fan experience
     */
    protected FadeTimer:number = 0;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
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
    }

    /**
     * Triggered when the video element can play through
     */
    onCanPlayThrough() {
        if(this.VideoItem == null || this.VideoItem.current === null)
            return;

        if(this.props.status === vars.Video.Status.Playing) {
            this.VideoItem.current.play();
        }

        if(this.props.onCanPlayThrough)
            this.props.onCanPlayThrough(this.VideoItem.current, this);
    }

    /**
     * Triggered when the duration of the video changes.
     */
    onDurationChange() {
        if(this.props.onDurationChange)
            this.props.onDurationChange(this.VideoItem.current, this);
    }

    /**
     * Triggered when metadaa about the video is loaded.
     */
    onLoadedMetaData() {
        if(this.props.autoplay && this.VideoItem !== null && this.VideoItem.current !== null) {
            this.VideoItem.current.play();
        }
    }

    /**
     * Triggered when the video ends
     * - Loops if loop is true
     */
    onEnded() {
        if(this.props.loop) {
            this.stop();
            this.play();
        } else {
            if(this.props.onEnded)
                this.props.onEnded(this.VideoItem.current, this);
        }
    }

    /**
     * Triggered when the video ends
     */
    onError() {
        if(this.props.onError)
            this.props.onError(this.VideoItem, this);
    }

    /**
     * Triggered when the video is paused
     */
    onPause() {
        if(this.props.status === vars.Video.Status.AutoPlay 
            && this.VideoItem !== null && this.VideoItem.current !== null
            && this.VideoItem.current.currentTime === this.VideoItem.current.duration) {
            this.start();
        }

        if(this.props.onPause)
            this.props.onPause(this.VideoItem.current, this);
    }

    /**
     * Triggered when the video starts to play
     */
    onPlay() {
        if(this.props.onPlay)
            this.props.onPlay(this.VideoItem.current, this);
    }

    /**
     * Triggered when the video is playing
     */
    onPlaying() {
        if(this.props.onPlaying)
            this.props.onPlaying(this.VideoItem.current, this);
    }

    /**
     * Triggered when the playback rate changes
     */
    onRateChange() {
        if(this.props.onRateChange)
            this.props.onRateChange(this.VideoItem.current, this);
    }

    /**
     * Triggered when the timestamp updates (each frame of play)
     */
    onTimeUpdate() {
        if(this.props.onTimeUpdate)
            this.props.onTimeUpdate(this.VideoItem.current, this);
    }

    /**
     * Triggered when the volume changes
     */
    onVolumeChange() {
        if(this.props.onVolumeChange)
            this.props.onVolumeChange(this.VideoItem.current, this);
    }

    /**
     * Triggered when the video is finished 'seeking' (scrubbing through)
     */
    onSeeked() {
        this.TimeChanging = false;
    }

    /**
     * Triggered when the user is 'scrubbing' through the video (video is changing its currentTime)
     */
    onSeeking() {
        this.TimeChanging = true;
    }

    /**
     * Stop video.
     */
    async stop() {
        this.pause();
        if(this.VideoItem !== null && this.VideoItem.current !== null)
            this.VideoItem.current.src = '';
    }

    /**
     * Play video from beginning.
     */
    async start() {
        this.pause();
        if(this.VideoItem !== null && this.VideoItem.current !== null)
            this.VideoItem.current.currentTime = 0;
        this.play();
    }

    /**
     * Play from current position
     */
    play() {
        try {
            if(window && this.VideoItem !== null && this.VideoItem.current !== null)
                this.VideoItem.current.play();
        } catch(er) {

        }
    }

    /**
     * Pause video
     */
    async pause() {
        if(this.VideoItem !== null && this.VideoItem.current !== null)
            this.VideoItem.current.pause();
    }

    /**
     * Fades the volume between its current level, and the level provided (value)
     * This is better than abrupt changes in volume
     * @param value number
     */
    fadeVolume(value) {
        if(this.VideoItem === null || this.VideoItem.current === null)
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
        this.FadeTimer = window.setInterval(() => {
            if(this.VideoItem !== null && this.VideoItem.current !== null) {
                this.VideoItem.current.volume = currentVolume + ((tick / ticks) * diff);
            }
            tick++;
            if(tick >= ticks) {
                clearInterval(this.FadeTimer);
            }
        }, 100);
    }

    /**
     * Sets the current time for the video.
     * @param value number
     */
    setTime(value:number) {
        if(this.VideoItem !== null && this.VideoItem.current !== null 
            && this.props.status !== vars.Video.Status.Playing) {
                this.VideoItem.current.currentTime = value;
            }
    }

    /**
     * Triggered when the component mounts to the DOM
     * - This is where initial volume is set, since TypeScript has a fit about it 'not being a property'
     *   even though it clearly IS a propert of the <video> element...
     */
    componentDidMount() {
        if(this.props.volume !== undefined && this.VideoItem !== null && this.VideoItem.current !== null) {
            this.VideoItem.current.volume = this.props.volume;
        }
    }

    /**
     * Triggered when the component is udpated.
     * @param prevProps any
     */
    componentDidUpdate(prevProps) {
        if(prevProps.status !== this.props.status) {
            switch(this.props.status) {
                //stop and reset
                case vars.Video.Status.Ready :
                    this.stop();
                break;
                
                //play from current position
                case vars.Video.Status.AutoPlay :
                case vars.Video.Status.Playing :
                    this.play();
                break;

                //pause video at current position
                case vars.Video.Status.Paused :
                    this.pause();
                break;

                //stop video 
                case vars.Video.Status.Stopped :
                    this.stop();
                break;

                default :

                break;
            }
        }

        //volume changed
        if(prevProps.volume !== this.props.volume) {
            this.fadeVolume(this.props.volume);
        }

        //rate changed
        if(prevProps.playbackRate !== this.props.rate && this.props.rate !== undefined) {
            if(this.VideoItem !== null && this.VideoItem.current !== null)
                this.VideoItem.current.playbackRate = this.props.rate;
        }

        //mute
        if(prevProps.muted !== this.props.muted && typeof(this.props.muted) === "boolean") {
            if(this.VideoItem !== null && this.VideoItem.current !== null)
                this.VideoItem.current.muted = this.props.muted;
        }

        //source changed
        if(prevProps.source !== this.props.source) {
            if(this.VideoItem.current)
                this.VideoItem.current.src = this.props.source;
        }

        //currentTime changed
        if(prevProps.currentTime !== this.props.currentTime && this.props.currentTime !== undefined) {
            this.setTime(this.props.currentTime);
        }
    }

    /**
     * Renders the component
     */
    render() {
        return (
            <video 
                className={cnames('video', this.props.className)}
                ref={this.VideoItem}
                width={this.props.width}
                height={this.props.height}
                src={this.props.source}
                muted={this.props.muted}
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