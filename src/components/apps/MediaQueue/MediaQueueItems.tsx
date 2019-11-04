import React from 'react';
import cnames from 'classnames';
import {Unsubscribe} from 'redux';
import vars, { AnthemRecord, VideoRecord, SlideshowRecord } from 'tools/vars';
import SortPanel from 'components/tools/SortPanel';
import { Icon, IconMovie, IconX, MediaThumbnail } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';
import VideoController from 'controllers/VideoController';
import DataController from 'controllers/DataController';

export default class MediaQueueItems extends React.PureComponent<any, {
    /**
     * Current record
     */
    Index:number;
    /**
     * Collection of records in the queue
     */
    Records:Array<SlideshowRecord | VideoRecord | AnthemRecord>;
}> {
    readonly state = {
        Index:MediaQueueController.getState().Index,
        Records:MediaQueueController.getState().Records
    }

    /**
     * Subscriber for MediaQueueController
     */
    protected remoteMedia:Unsubscribe|null = null;

    /**
     * 
     * @param props 
     */
    constructor(props) {
        super(props);
        this.updateMedia = this.updateMedia.bind(this);
    }

    /**
     * Updates the state to match the MediaQueueController
     */
    protected async updateMedia() {
        let cstate = MediaQueueController.getState();
        let changes:any = {Index:cstate.Index};
        if(!DataController.compare(cstate.Records, this.state.Records))
            changes.Records = cstate.Records;
        this.setState(changes);
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia);
    }

    /**
     * Close subscribers
     */
    componentWillUnmount() {
        if(this.remoteMedia !== null)
            this.remoteMedia();
    }
    
    /**
     * Renders the component
     * - A list of records in the media queue
     */
    render() {
        let items:Array<any> = [];
        this.state.Records.forEach((record, index) => {
            switch(record.RecordType) {
                case vars.RecordType.Video :
                    items.push({
                        label:<React.Fragment key={`${record.RecordType}-${index}`}>
                            <div className="slide-title">{record.Name}</div>
                            <Icon src={IconMovie}/>
                            <Icon src={IconX} 
                                className="remove"
                                onClick={() => {MediaQueueController.Remove(index);}}
                            />
                        </React.Fragment>,
                        recordIndex:index,
                        slideIndex:-1,
                        className:cnames('video', {active:(index === this.state.Index)})
                    });
                break;

                //Slideshow : Thumbnail of each slide
                case vars.RecordType.Slideshow : {
                    let src:string = '';
                    if(record.Records && record.Records.length)
                        src = record.Records[0].Filename;
                    items.push({
                        label:<React.Fragment key={`${record.RecordType}-${index}`}>
                            <MediaThumbnail src={src}/>
                            <div className="slide-title">{record.Name}</div>
                            <Icon src={IconX} 
                                className="remove"
                                onClick={() => {
                                    MediaQueueController.Remove(index);
                                }}
                            />
                        </React.Fragment>,
                        className:cnames('slideshow', {active:(index === this.state.Index)})
                    });
                }
                break;

                //National Anthem Singer
                case vars.RecordType.Anthem :
                    items.push({
                        label:<React.Fragment key={`${record.RecordType}-${index}`}>
                            <div className="slide-title">{record.Name}</div>
                            <Icon src={IconX} 
                                className="remove"
                                onClick={() => {
                                    MediaQueueController.Remove(index);
                                }}
                            />
                        </React.Fragment>,
                        className:cnames({active:(index === this.state.Index)})
                    });
                break;
            }

        });

        return (
            <div className="queue-items">
                <SortPanel
                    items={items}
                    index={this.state.Index}
                    onDrop={MediaQueueController.SwapRecords}
                    onDoubleClick={MediaQueueController.SetRecord}
                />
            </div>
        )
    }
}