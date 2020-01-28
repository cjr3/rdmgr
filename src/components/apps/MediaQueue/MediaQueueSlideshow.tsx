import React from 'react';
import SlideshowController from 'controllers/SlideshowController';
import cnames from 'classnames';
import { Unsubscribe } from 'redux';
import SortPanel from 'components/tools/SortPanel';
import vars, { SlideshowRecord, VideoRecord, AnthemRecord } from 'tools/vars';
import { MediaThumbnail } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';
import { Compare } from 'controllers/functions';

export default class MediaQueueSlideshow extends React.PureComponent<any, {
    Slides:Array<any>;
    Index:number;
    Record:SlideshowRecord | VideoRecord | AnthemRecord | undefined | null;
}> {
    readonly state = {
        Slides:SlideshowController.GetState().Slides,
        Index:SlideshowController.GetState().Index,
        Record:MediaQueueController.GetState().Record
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
        let slides:Array<any> = SlideshowController.GetState().Slides;
        let changes:any = {Index:SlideshowController.GetState().Index};

        if(!Compare(slides, this.state.Slides))
            changes.Slides = slides;

        this.setState(changes);
    }

    protected async updateMedia() {
        let record = MediaQueueController.GetState().Record;
        if(!Compare(record, this.state.Record))
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
        this.remoteSlideshow = SlideshowController.Subscribe(this.updateSlideshow);
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
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