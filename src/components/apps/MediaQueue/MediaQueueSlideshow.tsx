import React from 'react';
import SlideshowController from 'controllers/SlideshowController';
import DataController from 'controllers/DataController';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import SortPanel from 'components/tools/SortPanel';
import vars, { SlideshowRecord, VideoRecord, AnthemRecord } from 'tools/vars';
import { MediaThumbnail } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';

export default class MediaQueueSlideshow extends React.PureComponent<any, {
    Slides:Array<any>;
    Index:number;
    Record:SlideshowRecord | VideoRecord | AnthemRecord | undefined | null;
}> {
    readonly state = {
        Slides:SlideshowController.getState().Slides,
        Index:SlideshowController.getState().Index,
        Record:MediaQueueController.getState().Record
    }

    protected remoteSlideshow:Unsubscribe|null = null;
    protected remoteMedia:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateSlideshow = this.updateSlideshow.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.onDoubleClickSlide = this.onDoubleClickSlide.bind(this);
    }

    protected async updateSlideshow() {
        let slides:Array<any> = SlideshowController.getState().Slides;
        let changes:any = {Index:SlideshowController.getState().Index};

        if(!DataController.compare(slides, this.state.Slides))
            changes.Slides = slides;

        this.setState(changes);
    }

    protected async updateMedia() {
        let record = MediaQueueController.getState().Record;
        if(!DataController.compare(record, this.state.Record))
            this.setState({Record:record});
    }

    /**
     * Triggered when a slide is double-clicked.
     * @param {Number} index 
     */
    protected async onDoubleClickSlide(index) {
        SlideshowController.Display(parseInt(index));
    }

    componentDidMount() {
        this.remoteSlideshow = SlideshowController.subscribe(this.updateSlideshow);
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia);
    }

    componentWillUnmount() {
        if(this.remoteSlideshow !== null)
            this.remoteSlideshow();
        if(this.remoteMedia !== null)
            this.remoteMedia();
    }
    

    render() {
        const slides:Array<any> = new Array<any>();
        let shown:boolean = false;
        this.state.Slides.forEach((record, index) => {
            slides.push({
                label:<React.Fragment key={`${vars.RecordType.Slideshow}-${index}`}>
                    <MediaThumbnail src={record.Filename}/>
                    <div className="slide-title">{record.Title}</div>
                </React.Fragment>
            });
        });

        if(this.state.Record && this.state.Record.RecordType == vars.RecordType.Slideshow)
            shown = true;

        return (
            <div className={cnames('record-control slideshow-slides', {shown:(shown)})}>
                <SortPanel
                    items={slides}
                    index={this.state.Index}
                    onDoubleClick={this.onDoubleClickSlide}
                    onDrop={SlideshowController.SwapSlides}
                />
            </div>
        )
    }
}