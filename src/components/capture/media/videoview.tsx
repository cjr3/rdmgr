import classNames from 'classnames';
import React, { HTMLProps } from 'react';
import { Unsubscribe } from 'redux';
import { VideoStatus } from 'tools/vars';
import YouTubeVideo from 'react-youtube';

interface Props extends HTMLProps<HTMLVideoElement> {
    status:VideoStatus;
    volume?:number;
}

interface State {
    
}

class Main extends React.PureComponent<Props,State> {

    protected remote?:Unsubscribe;

    protected VideoItem:React.RefObject<HTMLVideoElement> = React.createRef<HTMLVideoElement>();

    protected YouTubeItem:any = null;

    protected update = () => {

    }

    /**
     * Checks if the browser can play the current video type
     * @param type 
     * @returns 
     */
    canPlayType = (type:string) => {
        if(this.VideoItem && this.VideoItem.current)
            return this.VideoItem.current.canPlayType(type);
        return false;
    }

    /**
     * Re-loads the video.
     */
    load = () => {
        if(this.VideoItem && this.VideoItem.current)
            this.VideoItem.current.load();
    }

    /**
     * Fires when the loading of an audio/video is aborted
     */
    protected onAbort = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onAbort')
    }

    /**
     * Fires when the browser can start playing the audio/video
     */
    protected onCanPlay = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onCanPlay')
    }

    /**
     * Fires when the browser can play through the audio/video without stopping for buffering
     */
    protected onCanPlayThrough = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        if(this.props.onCanPlayThrough)
            this.props.onCanPlayThrough(ev);
            
        if(!ev.isPropagationStopped()) {
            if(this.props.status === VideoStatus.PLAYING) {
                this.play();
            }
        }
    }

    protected onCanPlayThroughYouTube = (ev:any) => {
        this.YouTubeItem = ev.target;
        this.setVolume(this.props.volume || 0.75);
        if(this.props.status === VideoStatus.PLAYING)
            this.play();
    }

    /**
     * Fires when the duration of the audio/video is changed
     */
    protected onDurationChange = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onDurationChange')
    }


    /**
     * Fires when the current playlist is ended
     */
    protected onEnded = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onEnded')
    }

    protected onEndYouTube = (ev:any) => {

    }

    /**
     * Fires when an error occurred during the loading of an audio/video
     */
    protected onError = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onError')
    }

    protected onErrorYouTube = (ev:any) => {

    }

    /**
     * Fires when the browser has loaded the current frame of the audio/video
     */
    protected onLoadedData = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onLoadedData')
    }

    /**
     * Fires when the browser has loaded meta data for the audio/video
     */
    protected onLoadedMetadata = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onLoadedMetadata')
    }

    /**
     * Fires when the browser starts looking for the audio/video
     */
    protected onLoadStart = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onLoadStart')
    };

    /**
     * Fires when the audio/video has been paused
     */
    protected onPause = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onPause')
    };

    protected onPauseYouTube = (ev:any) => {

    };

    /**
     * Fires when the audio/video has been started or is no longer paused
     */
    protected onPlay = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onPlay')
    };

    protected onPlayYouTube = (ev:any) => {

    };

    /**
     * Fires when the audio/video is playing after having been paused or stopped for buffering
     */
    protected onPlaying = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onPlaying')
    };

    /**
     * Fires when the browser is downloading the audio/video
     */
    protected onProgress = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onProgress')
    };

    protected onQualityChangeYouTube = (ev:any) => {

    };

    /**
     * Fires when the playing speed of the audio/video is changed
     */
    protected onRateChange = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onRateChange')
    };

    /**
     * 
     * @param ev 
     */
    protected onRateChangeYouTube = (ev:any) => {

    }

    /**
     * Fires when the user is finished moving/skipping to a new position in the audio/video
     */
    protected onSeeked = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onSeeked')
    };

    /**
     * Fires when the user starts moving/skipping to a new position in the audio/video
     */
    protected onSeeking = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onSeeking')
    };

    /**
     * Fires when the browser is trying to get media data, but data is not available
     */
    protected onStalled = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onStalled')
    };

    protected onStateChangeYouTube = (ev:any) => {

    }

    /**
     * Fires when the browser is intentionally not getting media data
     */
    protected onSuspend = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onSuspend')
    };

    /**
     * Fires when the current playback position has changed
     */
    protected onTimeUpdate = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onTimeUpdate')
    };

    /**
     * Fires when the volume has been changed
     */
    protected onVolumeChange = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onVolumeChange')
    };

    /**
     * Fires when the video stops because it needs to buffer the next frame
     */
    protected onWaiting = (ev:React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // console.log('VideoView:onWaiting');
    }

    /**
     * Pause the current video.
     */
    pause = () => {
        // console.log('VideoView:pause')
        if(this.VideoItem && this.VideoItem.current && !this.VideoItem.current.paused) {
            this.VideoItem.current.pause();
        }
        
        try {
            if(this.YouTubeItem && this.YouTubeItem.pauseVideo) {
                this.YouTubeItem.pauseVideo();
            }
        } catch(er) {

        }
    }

    /**
     * Play the current video
     */
    play = () => {
        // console.log('VideoView:play')
        if(this.VideoItem && this.VideoItem.current && this.VideoItem.current.paused) {
            try {
                this.VideoItem.current.play().then(() => {

                }).catch((reason) => {
                    if(reason && typeof(reason) === 'object') {
                        if(reason instanceof DOMException) {
                            const ex:DOMException = reason;
                            switch(ex.code) {
                                case DOMException.NOT_SUPPORTED_ERR : 
                                
                                break;
                            }
                        }
                    }
                });
            } catch(er) {

            }
        }

        try {
            if(this.YouTubeItem && this.YouTubeItem.playVideo) {
                this.YouTubeItem.playVideo();
            }
        } catch(er) {

        }
    }

    setVolume = (value:number) => {
        // console.log('VideoView:setVolume')
        if(this.VideoItem && this.VideoItem.current) {
            this.VideoItem.current.volume = value;
            if(this.props.muted)
                this.VideoItem.current.muted = true;
            else
                this.VideoItem.current.muted = false;
        }

        try {
            if(this.YouTubeItem) {
                if(this.props.muted)
                    this.YouTubeItem.setVolume(0);
                else
                    this.YouTubeItem.setVolume(value * 100);
            }
        } catch(er) {

        }
    }

    stop = () => {
        // console.log('VideoView:stop')
        this.pause();
        if(this.VideoItem && this.VideoItem.current) {
            this.VideoItem.current.currentTime = 0;
        }

        try {
            if(this.YouTubeItem && this.YouTubeItem.stopVideo) {
                this.YouTubeItem.stopVideo();
            }
        } catch(er) {

        }
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.volume !== this.props.volume || prevProps.muted !== this.props.muted || this.props.src !== prevProps.src) {
            this.setVolume(this.props.volume || 0);
        }

        if(prevProps.status !== this.props.status) {
            switch(this.props.status) {
                case VideoStatus.PAUSED : this.pause(); break;
                case VideoStatus.PLAYING : this.play(); break;
                case VideoStatus.STOPPED : this.stop(); break;
            }
        }
    }


    //https://youtu.be/J76uvnBzMPE
    
    render() {
        const {status, ...rprops} = {...this.props};
        const width = window.outerWidth;
        const height = window.outerHeight;
        let youtubeId = '';
        if(rprops.src && rprops.src.length && (
            rprops.src.startsWith('https://youtu.be/') ||
            rprops.src.startsWith('https://www.youtube.com/')
        )) {
            const parts = rprops.src.split('/');
            youtubeId = parts[parts.length - 1];
        }

        if(!youtubeId) {
            this.YouTubeItem = null;
        }

        // console.log(this.props.src);

        return <div className={classNames('video-view', rprops.className, {
            playing:(status === VideoStatus.PLAYING),
            paused:(status === VideoStatus.PAUSED),
            stopped:(status === VideoStatus.STOPPED)
        })}>
            {
                (youtubeId.length > 0) &&
                <YouTubeVideo
                    videoId={youtubeId}
                    opts={{
                        height:height.toString(),
                        width:width.toString(),
                        playerVars:{
                            autoplay:0,
                            controls:0,
                            disablekb:1,
                            fs:0,
                            iv_load_policy:3
                        }
                    }}
                    onEnd={this.onEndYouTube}
                    onReady={this.onCanPlayThroughYouTube}
                    onPlay={this.onPlayYouTube}
                    onPause={this.onPauseYouTube}
                    onError={this.onErrorYouTube}
                    onStateChange={this.onStateChangeYouTube}
                    onPlaybackRateChange={this.onRateChangeYouTube}
                    onPlaybackQualityChange={this.onQualityChangeYouTube}
                />
            }
            {
                (youtubeId === '') &&
                <video
                    onAbort={this.onAbort}
                    onCanPlay={this.onCanPlay}
                    onDurationChange={this.onDurationChange}
                    onEnded={this.onEnded}
                    onError={this.onError}
                    onLoadedData={this.onLoadedData}
                    onLoadedMetadata={this.onLoadedMetadata}
                    onLoadStart={this.onLoadStart}
                    onPause={this.onPause}
                    onPlay={this.onPlay}
                    onPlaying={this.onPlaying}
                    onProgress={this.onProgress}
                    onRateChange={this.onRateChange}
                    onSeeked={this.onSeeked}
                    onSeeking={this.onSeeking}
                    onStalled={this.onStalled}
                    onSuspend={this.onSuspend}
                    onTimeUpdate={this.onTimeUpdate}
                    onVolumeChange={this.onVolumeChange}
                    onWaiting={this.onWaiting}
                    {...rprops}
                    onCanPlayThrough={this.onCanPlayThrough}
                    ref={this.VideoItem}
                ></video>
            }
            {this.props.children}
        </div>
    }
}

export {Main as VideoView};