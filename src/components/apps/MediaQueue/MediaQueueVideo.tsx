import React from 'react';
import MediaQueueController from 'controllers/MediaQueueController';
import VideoController from 'controllers/VideoController';
import cnames from 'classnames';
import vars, { SlideshowRecord, VideoRecord, AnthemRecord } from 'tools/vars';
import CaptureCameraStyleButtons from 'components/apps/CaptureControl/CaptureCameraStyleButtons';
import CaptureVideoStyleButtons from 'components/apps/CaptureControl/CaptureVideoStyleButtons';
import VideoCaptureController from 'controllers/capture/Video';
import { Compare, AddMediaPath } from 'controllers/functions';


export default class MediaQueueVideo extends React.PureComponent<any, {
    Record:SlideshowRecord | VideoRecord | AnthemRecord | undefined | null;
    Source:string;
    Status:number;
}> {
    readonly state = {
        Record:MediaQueueController.GetState().Record,
        Source:VideoController.GetState().Source,
        Status:VideoController.GetState().Status
    }

    protected VideoItem:React.RefObject<HTMLVideoElement> = React.createRef();

    protected remoteMedia:Function|null = null;
    protected remoteVideo:Function|null = null;

    constructor(props) {
        super(props);
        this.updateMedia = this.updateMedia.bind(this);
        this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
    }

    protected async updateMedia() {
        let record = MediaQueueController.GetState().Record;
        if(!Compare(record, this.state.Record))
            this.setState({Record:record});
    }

    protected async updateVideo() {
        this.setState({
            Status:VideoController.GetState().Status
        }, () => {
            
            if(this.VideoItem !== null && this.VideoItem.current !== null) {
                if(this.state.Status === vars.Video.Status.Stopped) {
                    try {
                        let vid:any = this.VideoItem.current;
                        vid.stop();
                    } catch(er) {

                    }
                }
            }
        });
    }
    
    /**
     * Triggered when the video item can be played.
     */
    protected async onCanPlayThrough() {
        if(this.VideoItem.current) {
            let record = this.state.Record;
            if(record && record.RecordType === vars.RecordType.Video) {
                VideoController.SetState({
                    Source:this.VideoItem.current.src,
                    Status:vars.Video.Status.Playing,
                    CurrentTime:0
                });
                VideoCaptureController.Show();
                this.VideoItem.current.play();
            }
        }
    }

    componentDidMount() {
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
    }

    componentWillUnmount() {
        if(this.remoteMedia !== null)
            this.remoteMedia();
    }

    render() {
        let src:string = '';
        let shown:boolean = false;

        if(this.state.Record && this.state.Record.RecordType === vars.RecordType.Video) {
            shown = true;
            if(this.state.Record.Filename)
                src = AddMediaPath('videos/' + this.state.Record.Filename);
        }

        return (
            <div className={cnames('record-control video-preview', {shown:shown})}>
                <video
                    src={src}
                    autoPlay={false}
                    muted={true}
                    controls={true}
                    width="640"
                    height="360"
                    onCanPlayThrough={this.onCanPlayThrough}
                    ref={this.VideoItem}
                />
                <div className="camera-styles">
                    <CaptureCameraStyleButtons/>
                    <CaptureVideoStyleButtons/>
                </div>
            </div>
        )
    }
}