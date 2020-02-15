import React from 'react';
import VideoController from 'controllers/VideoController';
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
    IconPlay,
    IconFolder,
    IconSave
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
import MediaQueueRoster from './MediaQueueRoster';
import VideoCaptureController from 'controllers/capture/Video';
import SlideshowCaptureController from 'controllers/capture/Slideshow';
import RosterCaptureController from 'controllers/capture/Roster';
import AnthemCaptureController from 'controllers/capture/Anthem';
import Raffle from 'components/apps/Raffle/Raffle';
import { ShowOpenDialog } from 'controllers/functions';
import vars, { SlideshowRecord } from 'tools/vars';
import { LoadFolderFiles, FileExtension, Basename, SaveFile } from 'controllers/functions.io';

/**
 * Component for media to be queued to the capture window,
 * allowing a user to setup all media they need to for the presentation.
 */
export default class MediaQueue extends React.PureComponent<any, {
    opened:boolean;
}> {

    readonly state = {
        opened:UIController.GetState().MediaQueue.Shown
    }

    protected remoteUI:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateUI = this.updateUI.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    protected async updateUI() {
        this.setState({
            opened:UIController.GetState().MediaQueue.Shown
        });
    }

    protected onKeyUp(ev) {
        ev.stopPropagation();
        ev.preventDefault();
    }

    componentDidMount() {
        this.remoteUI = UIController.Subscribe(this.updateUI);
    }

    componentWillUnmount() {
        if(this.remoteUI !== null)
            this.remoteUI();
    }
    

    /**
     * Renders the component.
     */
    render() {

        let raffleName:string = cnames('MEQ-raffle', {
            shown:(this.state.opened)
        });

        return (
            <React.Fragment>
                <Panel
                    opened={this.state.opened}
                    buttons={[<MediaQueueButtons key="buttons"/>]}
                    contentName="MEQ-app"
                    className="MEQ-panel">
                    <MediaQueueItems/>
                    <div className="current-record" onKeyUp={this.onKeyUp}>
                        <MediaQueueVideo/>
                        <MediaQueueSlideshow/>
                        <MediaQueueAnthem/>
                        <MediaQueueRoster/>
                    </div>
                    <MediaQueueRecordSets/>
                </Panel>
                <div className={raffleName}>
                    <Raffle opened={true}/>
                </div>
            </React.Fragment>
        )
    }
}

class MediaQueueButtons extends React.PureComponent<any, {
    VideoShown:boolean;
    SlideshowShown:boolean;
    AnthemShown:boolean;
    RosterShown:boolean;
    Loop:boolean;
    Muted:boolean;
    Volume:number;
    Index:number;
    Record:any;
}> {

    readonly state = {
        VideoShown:VideoCaptureController.GetState().Shown,
        SlideshowShown:SlideshowCaptureController.GetState().Shown,
        AnthemShown:SlideshowCaptureController.GetState().Shown,
        RosterShown:RosterCaptureController.GetState().Showm,
        Loop:MediaQueueController.GetState().Loop,
        Record:MediaQueueController.GetState().Record,
        Index:MediaQueueController.GetState().Index,
        Muted:VideoController.GetState().Muted,
        Volume:VideoController.GetState().Volume
    }

    /**
     * CaptureController remote
     */
    protected remoteCapture?:Unsubscribe;
    protected remoteVideoCapture?:Unsubscribe;
    protected remoteSlideshowCapture?:Unsubscribe;
    protected remoteAnthemCapture?:Unsubscribe;
    protected remoteRosterCapture?:Unsubscribe;

    /**
     * MediaQueueController subscriber
     */
    protected remoteMedia?:Unsubscribe;

    /**
     * VideoController subscriber
     */
    protected remoteVideo?:Unsubscribe;

    protected mediaWorker?:Worker;

    /**
     * Constructs the component.
     * @param {Object} props 
     */
    constructor(props) {
        super(props);
        this.updateMedia = this.updateMedia.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.updateVideoCapture = this.updateVideoCapture.bind(this);
        this.updateSlideshowCapture = this.updateSlideshowCapture.bind(this);
        this.updateAnthemCapture = this.updateAnthemCapture.bind(this);
        this.updateRosterCapture = this.updateRosterCapture.bind(this);
    }

    protected async onWorkerUpdate(msg:any) {
        console.log(msg);
    }

    /**
     * Updates the state to match the MediaQueueController
     */
    protected async updateMedia() {
        this.setState({
            Loop:MediaQueueController.GetState().Loop,
            Index:MediaQueueController.GetState().Index,
            Record:MediaQueueController.GetState().Record
        });
    }

    /**
     * Updates the state to match the VideoController
     */
    protected async updateVideo() {
        this.setState({
            Muted:VideoController.GetState().Muted,
            Volume:VideoController.GetState().Volume
        });
    }

    protected updateVideoCapture() {
        this.setState({
            VideoShown:VideoCaptureController.GetState().Shown
        });
    }

    protected updateSlideshowCapture() {
        this.setState({
            SlideshowShown:SlideshowCaptureController.GetState().Shown
        });
    }

    protected updateAnthemCapture() {
        this.setState({
            AnthemShown:AnthemCaptureController.GetState().Shown
        });
    }

    protected updateRosterCapture() {
        this.setState({
            RosterShown:RosterCaptureController.GetState().Shown
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
        this.remoteVideo = VideoController.Subscribe(this.updateVideo);
        this.remoteAnthemCapture = AnthemCaptureController.Subscribe(this.updateAnthemCapture);
        this.remoteRosterCapture = RosterCaptureController.Subscribe(this.updateRosterCapture);
        this.remoteSlideshowCapture = SlideshowCaptureController.Subscribe(this.updateSlideshowCapture);
        this.remoteVideoCapture = VideoCaptureController.Subscribe(this.updateVideoCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteMedia)
            this.remoteMedia();
        if(this.remoteVideo)
            this.remoteVideo();
        if(this.remoteAnthemCapture)
            this.remoteAnthemCapture();
        if(this.remoteRosterCapture)
            this.remoteRosterCapture();
        if(this.remoteSlideshowCapture)
            this.remoteSlideshowCapture();
        if(this.remoteVideoCapture)
            this.remoteVideoCapture();
    }

    render() {
        let shown:boolean = false;

        if(this.state.AnthemShown 
            || this.state.SlideshowShown 
            || this.state.VideoShown
            || this.state.RosterShown
            ) {
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
                            if(typeof(value) === 'number')
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