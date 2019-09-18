import React from 'react';
import DataController from 'controllers/DataController';
import VideoController from 'controllers/VideoController';
import SlideshowController from 'controllers/SlideshowController';
import CaptureController from 'controllers/CaptureController';
import SponsorController from 'controllers/SponsorController';
import MediaQueueController from 'controllers/MediaQueueController';
import {CaptureDisplayButtons} from 'components/apps/CaptureControl/CaptureControl';
import Raffle from 'components/apps/Raffle/Raffle';
import {
    IconButton,
    IconLeft,
    IconRight,
    IconShown,
    IconHidden,
    IconMovie,
    IconSave,
    IconFlag,
    IconX,
    MediaThumbnail,
    Icon,
    IconPlus,
    IconSlideshow,
    IconTicket,
    ToggleButton,
    IconMonitor,
    IconMuted,
    IconUnmute,
    Slider,
    Button,
    IconLoop
} from 'components/Elements';
import Panel from 'components/Panel';

import vars from 'tools/vars';
import CaptureStatus from 'tools/CaptureStatus';
import RecordList from 'components/data/RecordList';
import cnames from 'classnames';
import SortPanel from 'components/tools/SortPanel';
import './css/MediaQueue.scss';

/**
 * Component for media to be queued to the capture window,
 * allowing a user to setup all media they need to for the presentation.
 */
class MediaQueue extends React.PureComponent {
    /**
     * Constructs the component.
     * @param {Object} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            recordset:'',
            SponsorsID:0,
            SponsorStatus:false,
            DisplayShown:false,
            captureClass:CaptureController.getState().className,
            State:Object.assign({}, MediaQueueController.getState()),
            Videos:DataController.getVideos(true),
            AnthemSingers:DataController.getAnthemSingers(true),
            Slideshows:DataController.getSlideshows(true),
            SlideIndex:SlideshowController.getState().Index,
            Slides:SlideshowController.getState().Slides.slice(),
            CaptureVideo:Object.assign({}, CaptureController.getState().MainVideo),
            CaptureSlideshow:Object.assign({}, CaptureController.getState().MainSlideshow),
            CaptureSponsor:Object.assign({}, CaptureController.getState().SponsorSlideshow),
            CaptureAnthem:Object.assign({}, CaptureController.getState().NationalAnthem),
            VideoState:Object.assign({}, VideoController.getState()),
            Status:Object.assign({}, CaptureStatus.getState())
        };

        this.VideoItem = React.createRef();
        this.VideoCanPlayThrough = false;
        this.setRecordset = this.setRecordset.bind(this);
        this.onDoubleClickSlide = this.onDoubleClickSlide.bind(this);

        this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
        this.onSelectSponsor = this.onSelectSponsor.bind(this);

        this.SponsorTimer = null;

        this.updateData = this.updateData.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.updateSlideshow = this.updateSlideshow.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.updateVideo = this.updateVideo.bind(this);
        this.updateStatus = this.updateStatus.bind(this);

        this.remoteData = DataController.subscribe(this.updateData);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteSlideshow = SlideshowController.subscribe(this.updateSlideshow);
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia);
        this.removeVideo = VideoController.subscribe(this.updateVideo);
        this.remoteStatus = CaptureStatus.subscribe(this.updateStatus);
    }

    /**
     * Triggered when the data controller updates.
     */
    updateData() {
        var videos = DataController.getVideos(true);
        var slideshows = DataController.getSlideshows(true);
        var singers = DataController.getAnthemSingers(true);

        //Videos
        if(!DataController.compare(videos, this.state.Videos)) {
            this.setState(() => {
                return {Videos:videos}
            });
        }
        
        //Slideshows
        if(!DataController.compare(slideshows, this.state.Slideshows)) {
            this.setState(() => {
                return {Slideshows:slideshows}
            });
        }

        //National Anthem Singers
        if(!DataController.compare(singers, this.state.AnthemSingers)) {
            this.setState(() => {
                return {AnthemSingers:singers}
            });
        }
    }

    /**
     * Updates the capture states
     */
    updateCapture() {
        var cstate = CaptureController.getState();
        //Video
        if(!DataController.compare(cstate.MainVideo, this.state.CaptureVideo)) {
            this.setState(() => {
                return {CaptureVideo:Object.assign({}, cstate.MainVideo)}
            });
        }

        //Slideshow
        if(!DataController.compare(cstate.MainSlideshow, this.state.CaptureSlideshow)) {
            this.setState(() => {
                return {CaptureSlideshow:Object.assign({}, cstate.MainSlideshow)}
            });
        }

        //National Anthem
        if(!DataController.compare(cstate.NationalAnthem, this.state.CaptureAnthem)) {
            this.setState(() => {
                return {CaptureAnthem:Object.assign({}, cstate.NationalAnthem)}
            });
        }

        //Sponsors
        if(!DataController.compare(cstate.SponsorSlideshow, this.state.CaptureSponsor)) {
            this.setState(() => {
                return {CaptureSponsor:Object.assign({}, cstate.SponsorSlideshow)}
            });
        }

        this.setState({captureClass:cstate.className});
    }

    /**
     * Updates the state to match the slideshow controller.
     */
    updateSlideshow() {
        var changes = {
            SlideIndex:SlideshowController.getState().Index
        };

        if(!DataController.compare(SlideshowController.getState().Slides, this.state.Slides)) {
            changes.Slides = SlideshowController.getState().Slides.slice();
        }

        this.setState(() => {
            return changes;
        });
    }

    /**
     * Updates the state to match the media queue controller.
     */
    updateMedia() {
        var state = MediaQueueController.getState();
        var changes = {
            Index:state.Index,
            Records:state.Records.slice(),
            Loop:state.Loop
        };

        var record = state.Record;
        if(!DataController.compare(record, this.state.State.Record)) {
            if(record === null)
                changes.Record = null;
            else
                changes.Record = Object.assign({}, record);
        }
        
        this.setState(() => {
            return {State:Object.assign({}, changes)};
        });
    }

    /**
     * Updates the video item to match the controller state
     */
    updateVideo() {
        var state = VideoController.getState();
        if(this.VideoItem.current) {
            if(state.Status == vars.Video.Status.Stopped) {
                try {
                    this.VideoItem.current.stop();
                } catch(er) {
                    //console.log(er)
                }
            }
        }

        //update if changed
        if(!DataController.compare(state, this.state.VideoState)) {
            this.setState({VideoState:Object.assign({}, state)});
        }
    }

    /**
     * Updates the state to match the capture status.
     */
    updateStatus() {
        var cstate = CaptureStatus.getState();
        if(!DataController.compare(cstate, this.state.Status)) {
            this.setState({Status:Object.assign({}, cstate)});
        };
    }

    /**
     * Sets the recordset to display
     * @param {String} set 
     */
    setRecordset(set) {
        if(this.state.recordset === set) {
            this.setState({recordset:''});
        } else {
            this.setState({recordset:set});
        }
    }

    /**
     * Triggered when a slide is double-clicked.
     * @param {Number} index 
     */
    onDoubleClickSlide(index) {
        SlideshowController.Display(parseInt(index));
    }

    /**
     * Triggered when the video item can be played.
     */
    onCanPlayThrough() {
        if(this.VideoItem.current) {
            var record = this.state.State.Record;
            if(record && record.RecordType === vars.RecordType.Video) {
                VideoController.SetState({
                    Source:this.VideoItem.current.src,
                    Status:vars.Video.Status.Playing,
                    CurrentTime:0
                });
                CaptureController.SetMainVideoVisibility( true );
                this.VideoItem.current.play();
            }
        }
    }

    /**
     * Triggered when the user changes the sponsor slideshow.
     * @param {Object} record
     */
    onSelectSponsor(record) {
        this.setState(() => {
            return {SponsorsID:record.ID}
        }, () => {
            try {clearInterval(this.SponsorTimer);} catch(er) {}
            SponsorController.SetSlides(record.Records);
            this.SponsorTimer = setInterval(() => {
                if(this.state.CaptureSponsor.Shown)
                    SponsorController.Next();
            }, this.state.CaptureSponsor.Delay);
        });
    }

    /**
     * Renders the component.
     * 
     * Buttons:
     * - Show (show/hide current record)
     * - Previous (previous record / slide)
     * - Next (next record / slide)
     */
    render() {
        var items = [];
        var slides = [];
        var sponsors = [];
        var slideshows = [];
        var videoSrc = '';
        var index = -1;
        var shown = false;
        var records = this.state.State.Records;
        var recordIndex = this.state.State.Index;

        if(records && records.length >= 1) {
            for(let i=0, len = records.length; i < len; i++) {
                let record = records[i];
                switch(record.RecordType) {
                    //Video : Thumbnail with video icon and video name
                    case vars.RecordType.Video :
                        items.push({
                            label:<React.Fragment key={`${record.RecordType}-${i}`}>
                                <div className="slide-title">{record.Name}</div>
                                <Icon src={IconMovie}/>
                                <Icon src={IconX} 
                                    className="remove"
                                    onClick={() => {MediaQueueController.Remove(i);}}
                                />
                            </React.Fragment>,
                            recordIndex:i,
                            slideIndex:-1,
                            className:cnames('video', {active:(i == recordIndex)})
                        });
                        if(i === recordIndex && VideoController.getState().Source) {
                            index = recordIndex;
                            videoSrc = VideoController.getState().Source;
                        }
                    break;

                    //Slideshow : Thumbnail of each slide
                    case vars.RecordType.Slideshow :
                        var src = '';
                        if(record.Records && record.Records.length)
                            src = record.Records[0].Filename;
                        items.push({
                            label:<React.Fragment key={`${record.RecordType}-${i}`}>
                                <MediaThumbnail src={src}/>
                                <div className="slide-title">{record.Name}</div>
                                <Icon src={IconX} 
                                    className="remove"
                                    onClick={() => {
                                        MediaQueueController.Remove(i);
                                    }}
                                />
                            </React.Fragment>,
                            className:cnames('slideshow', {active:(i === recordIndex)})
                        });
                        if(i === recordIndex) {
                            index = recordIndex;
                            for(let c=0, clen = this.state.Slides.length; c < clen; c++) {
                                let slide =this.state.Slides[c];
                                slides.push({
                                    label:<React.Fragment key={`${i}-${c}`}>
                                        <MediaThumbnail src={slide.Filename}/>
                                        <div className="slide-title">{slide.Title}</div>
                                    </React.Fragment>
                                });
                            }
                        }
                    break;

                    //National Anthem Singer
                    case vars.RecordType.Anthem :
                        items.push({
                            label:<React.Fragment key={`${record.RecordType}-${i}`}>
                                <div className="slide-title">{record.Name}</div>
                                <Icon src={IconX} 
                                    className="remove"
                                    onClick={() => {
                                        MediaQueueController.Remove(i);
                                    }}
                                />
                            </React.Fragment>,
                            className:cnames({active:(i == recordIndex)})
                        });
                    break;
                }
            }
        }

        if(this.state.CaptureAnthem.Shown || 
            this.state.CaptureSlideshow.Shown ||
            this.state.CaptureVideo.Shown) {
            shown = true;
        }

        for(let key in this.state.Slideshows) {
            let show = this.state.Slideshows[key];
            if(show.SlideshowType === 'SPONSOR') {
                sponsors.push(show);
            } else {
                slideshows.push(show);
            }
        }

        var buttons = [
            <IconButton
                key="btn-loop"
                src={IconLoop}
                active={this.state.State.Loop}
                onClick={MediaQueueController.ToggleLoop}
                title="Loop Playlist"
            />,
            <IconButton
                key="btn-mute"
                src={(this.state.VideoState.Muted) ? IconMuted : IconUnmute}
                onClick={VideoController.ToggleMute}
                active={(!this.state.VideoState.Muted)}
                title={(this.state.VideoState.Muted) ? 'Un-mute' : 'Mute'}
                />,
            <Button key="btn-volume" className={cnames('btn-volume',{
                muted:(this.state.VideoState.Muted)
                })}>
                <Slider
                    defaultValue={0.75}
                    step={0.05}
                    min={0}
                    max={1.0}
                    marks={true}
                    value={this.state.VideoState.Volume}
                    valueLabelFormat={x => (parseInt(x*100) + "%")}
                    valueLabelDisplay="auto"
                    onChangeCommitted={(o, value) => {
                        VideoController.SetVolume(value);
                    }}
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        VideoController.SetVolume(0.75);
                    }}
                    />
            </Button>,
            <IconButton
                key="btn-display"
                src={IconMonitor}
                active={(this.state.DisplayShown)}
                onClick={() => {
                    this.setState({DisplayShown:!this.state.DisplayShown});
                }}>Display</IconButton>,
            <IconButton
                key="btn-hide"
                src={(shown) ? IconShown : IconHidden}
                active={(shown)}
                onClick={MediaQueueController.ToggleVisibility}
            >{(shown) ? 'Hide' : 'Show'}</IconButton>,
            <IconButton
                key="btn-start"
                src={require('images/icons/play.png')}
                active={(recordIndex === 0)}
                onClick={MediaQueueController.Start}
            >Start</IconButton>,
            <IconButton
                key="btn-prev"
                src={IconLeft}
                onClick={MediaQueueController.Prev}
            >Prev</IconButton>,
            <IconButton
                key="btn-next"
                src={IconRight}
                onClick={MediaQueueController.Next}
            >Next</IconButton>,
        ];

        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
                contentName="MEQ-app"
                className="MEQ-panel"
                >
                <div className="queue-items">
                    <SortPanel
                        items={items}
                        index={index}
                        onDrop={MediaQueueController.SwapRecords}
                        onDoubleClick={MediaQueueController.SetRecord}
                    />
                </div>
                <div className="current-record">
                    <video
                        className={cnames('video-preview', {
                            shown:(videoSrc !== '')
                        })}
                        src={videoSrc}
                        autoPlay={false}
                        volume={0.75}
                        muted={true}
                        controls={true}
                        width="640"
                        height="360"
                        onCanPlayThrough={this.onCanPlayThrough}
                        currenttime={this.state.Status.CurrentTime}
                        ref={this.VideoItem}
                    />
                    <div className={cnames('slideshow-slides', {
                            shown:(slides.length >= 1)
                        })}>
                        <SortPanel
                            items={slides}
                            index={this.state.SlideIndex}
                            onDoubleClick={this.onDoubleClickSlide}
                            onDrop={SlideshowController.SwapSlides}
                        />
                    </div>
                </div>
                <div className="queue-recordsets">
                    <div className={cnames('recordset', {
                        shown:(this.state.recordset === vars.RecordType.Anthem)
                        })}>
                        <IconButton
                            src={IconFlag}
                            onClick={() => {this.setRecordset(vars.RecordType.Anthem);}}
                        >Anthem</IconButton>
                        <RecordList
                            records={this.state.AnthemSingers}
                            onSelect={(record) => {MediaQueueController.Add(record);}}
                        />
                    </div>
                    <div  className={cnames('recordset', {
                        shown:(this.state.recordset === vars.RecordType.Slideshow)
                        })}>
                        <IconButton
                            src={IconSlideshow}
                            onClick={() => {
                                this.setRecordset(vars.RecordType.Slideshow);
                            }}
                        >Slideshows</IconButton>
                        <RecordList
                            records={slideshows}
                            onSelect={(record) => {
                                MediaQueueController.Add(record);
                            }}
                        />
                    </div>
                    <div  className={cnames('recordset has-buttons', {
                        shown:(this.state.recordset === vars.RecordType.Sponsor)
                        })}>
                        <IconButton
                            src={IconSlideshow}
                            onClick={() => {this.setRecordset(vars.RecordType.Sponsor);}}
                        >Sponsors</IconButton>
                        <RecordList
                            records={sponsors}
                            onSelect={this.onSelectSponsor}
                        />
                        <div className="buttons">
                            <IconButton
                                active={this.state.CaptureSponsor.Shown}
                                onClick={CaptureController.ToggleSponsors}
                                src={(this.state.CaptureSponsor.Shown) ? IconShown : IconHidden}
                            >{(this.state.CaptureSponsor.Shown) ? 'Hide' : 'Show'}</IconButton>
                            <ToggleButton
                                checked={(this.state.captureClass === 'sponsor-board')}
                                onClick={CaptureController.ToggleSponsorView}
                                label="Sponsor View"
                            />
                        </div>
                    </div>
                    <div className={cnames('recordset', {
                        shown:(this.state.recordset === vars.RecordType.Video)
                        })}>
                        <IconButton
                            src={IconMovie}
                            onClick={() => {
                                this.setRecordset(vars.RecordType.Video);
                            }}
                        >Videos</IconButton>
                        <RecordList
                            records={this.state.Videos}
                            onSelect={(record) => {
                                MediaQueueController.Add(record);
                            }}
                        />
                    </div>

                    <div className={cnames('recordset', {
                        shown:(this.state.recordset === '')
                    })}>
                        <IconButton
                            src={IconTicket}
                            onClick={() => {this.setRecordset('');}}
                        >Raffle</IconButton>
                        <Raffle opened={true}/>
                    </div>

                    <Panel
                        popup={true}
                        opened={this.state.DisplayShown}
                        buttons={[<CaptureDisplayButtons key='buttons'/>]}
                        />
                </div>
            </Panel>
        )
    }
}

export default MediaQueue;