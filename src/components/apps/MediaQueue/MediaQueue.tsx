import React from 'react';
import VideoController from 'controllers/VideoController';
import CaptureController from 'controllers/CaptureController';
import MediaQueueController from 'controllers/MediaQueueController';
import UIController from 'controllers/UIController';
import {
    IconButton,
    IconLeft,
    IconRight,
    IconShown,
    IconHidden,
    IconMuted,
    IconUnmute,
    Slider,
    Button,
    IconLoop,
    IconPlay
} from 'components/Elements';
import Panel from 'components/Panel';
import MediaQueueItems from './MediaQueueItems';
import cnames from 'classnames';
import MediaQueueVideo from './MediaQueueVideo';
import MediaQueueSlideshow from './MediaQueueSlideshow';
import MediaQueueAnthem from './MediaQueueAnthem';
import MediaQueueRecordSets from './MediaQueueRecordSets';
import './css/MediaQueue.scss';
import { Unsubscribe } from 'redux';

/**
 * Component for media to be queued to the capture window,
 * allowing a user to setup all media they need to for the presentation.
 */
export default class MediaQueue extends React.PureComponent<any, {
    opened:boolean;
}> {

    readonly state = {
        opened:UIController.getState().MediaQueue.Shown
    }

    protected remoteUI:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.getState().MediaQueue.Shown
        });
    }

    componentDidMount() {
        this.remoteUI = UIController.subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI !== null)
            this.remoteUI();
    }
    

    /**
     * Renders the component.
     */
    render() {
        return (
            <Panel
                opened={this.state.opened}
                buttons={[<MediaQueueButtons key="buttons"/>]}
                contentName="MEQ-app"
                className="MEQ-panel">
                <MediaQueueItems/>
                <div className="current-record">
                    <MediaQueueVideo/>
                    <MediaQueueSlideshow/>
                    <MediaQueueAnthem/>
                </div>
                <MediaQueueRecordSets/>
            </Panel>
        )
    }
}

class MediaQueueButtons extends React.PureComponent<any, {
    VideoShown:boolean;
    SlideshowShown:boolean;
    AnthemShown:boolean;
    Loop:boolean;
    Muted:boolean;
    Volume:number;
    Index:number;
}> {

    readonly state = {
        VideoShown:CaptureController.getState().MainVideo.Shown,
        SlideshowShown:CaptureController.getState().MainSlideshow.Shown,
        AnthemShown:CaptureController.getState().NationalAnthem.Shown,
        Loop:MediaQueueController.getState().Loop,
        Index:MediaQueueController.getState().Index,
        Muted:VideoController.getState().Muted,
        Volume:VideoController.getState().Volume
    }

    /**
     * CaptureController remote
     */
    protected remoteCapture:Unsubscribe|null = null;

    /**
     * MediaQueueController subscriber
     */
    protected remoteMedia:Unsubscribe|null = null;

    /**
     * VideoController subscriber
     */
    protected remoteVideo:Unsubscribe|null = null;

    /**
     * Constructs the component.
     * @param {Object} props 
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
    }

    /**
     * Updates the capture state to match the CaptureController
     */
    protected async updateCapture() {
        var cstate = CaptureController.getState();
        this.setState({
            VideoShown:cstate.MainVideo.Shown,
            SlideshowShown:cstate.MainSlideshow.Shown,
            AnthemShown:cstate.NationalAnthem.Shown
        });
    }

    /**
     * Updates the state to match the MediaQueueController
     */
    protected async updateMedia() {
        this.setState({
            Loop:MediaQueueController.getState().Loop,
            Index:MediaQueueController.getState().Index
        });
    }

    /**
     * Updates the state to match the VideoController
     */
    protected async updateVideo() {
        this.setState({
            Muted:VideoController.getState().Muted,
            Volume:VideoController.getState().Volume
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia);
        this.remoteVideo = VideoController.subscribe(this.updateVideo);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture !== null)
            this.remoteCapture();
        if(this.remoteMedia !== null)
            this.remoteMedia();
        if(this.remoteVideo !== null)
            this.remoteVideo();
    }

    render() {
        let shown:boolean = false;

        if(this.state.AnthemShown || this.state.SlideshowShown || this.state.VideoShown) {
            shown = true;
        }

        return (
            <React.Fragment>
                <IconButton
                    key="btn-loop"
                    src={IconLoop}
                    active={this.state.Loop}
                    onClick={MediaQueueController.ToggleLoop}
                    title="Loop Playlist"
                />
                <IconButton
                    key="btn-mute"
                    src={(this.state.Muted) ? IconMuted : IconUnmute}
                    onClick={VideoController.ToggleMute}
                    active={(!this.state.Muted)}
                    title={(this.state.Muted) ? 'Un-mute' : 'Mute'}
                    />
                <Button key="btn-volume" className={cnames('btn-volume',{
                    muted:(this.state.Muted)
                    })}>
                    <Slider
                        defaultValue={0.75}
                        step={0.05}
                        min={0}
                        max={1.0}
                        marks={true}
                        value={this.state.Volume}
                        //valueLabelFormat={x => ((x*100).toFixed(0).toString() + "%")}
                        //valueLabelDisplay="auto"
                        onChangeCommitted={(o, value) => {
                            VideoController.SetVolume(value);
                        }}
                        onContextMenu={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            VideoController.SetVolume(0.75);
                        }}
                        />
                </Button>
                <IconButton
                    key="btn-hide"
                    src={(shown) ? IconShown : IconHidden}
                    active={(shown)}
                    onClick={MediaQueueController.ToggleVisibility}
                >{(shown) ? 'Hide' : 'Show'}</IconButton>
                <IconButton
                    key="btn-start"
                    src={IconPlay}
                    active={(shown && this.state.Index === 0)}
                    onClick={MediaQueueController.Start}
                >Start</IconButton>
                <IconButton
                    key="btn-prev"
                    src={IconLeft}
                    onClick={MediaQueueController.Prev}
                >Prev</IconButton>
                <IconButton
                    key="btn-next"
                    src={IconRight}
                    onClick={MediaQueueController.Next}
                >Next</IconButton>
            </React.Fragment>
        )
    }
}