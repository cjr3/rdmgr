import React from 'react';
import cnames from 'classnames';
import {Unsubscribe} from 'redux';
import vars, { AnthemRecord, VideoRecord, SlideshowRecord } from 'tools/vars';
import SortPanel from 'components/tools/SortPanel';
import { Icon, IconMovie, IconX, MediaThumbnail, IconFlag, IconTeam } from 'components/Elements';
import MediaQueueController from 'controllers/MediaQueueController';
import { Compare, AddMediaPath } from 'controllers/functions';
import Raffle from 'components/apps/Raffle/Raffle';
import AnthemCaptureController from 'controllers/capture/Anthem';

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
        Index:MediaQueueController.GetState().Index,
        Records:MediaQueueController.GetState().Records
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
        let cstate = MediaQueueController.GetState();
        let changes:any = {Index:cstate.Index};
        if(!Compare(cstate.Records, this.state.Records))
            changes.Records = cstate.Records;
        this.setState(changes);
    }

    /**
     * Subscribe to controllers
     */
    componentDidMount() {
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
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
                            <Icon src={IconMovie}/>
                            <div className="slide-title">{record.Name}</div>
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
                        src = AddMediaPath(record.Records[0].Filename);
                    items.push({
                        label:<React.Fragment key={`${record.RecordType}-${index}`}>
                            <Icon src={src}/>
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
                            <Icon src={IconFlag}/>
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

                case vars.RecordType.Roster :
                    let src:string = '';
                    if(record.Thumbnail)
                        src = AddMediaPath(record.Thumbnail);
                    items.push({
                        label:<React.Fragment key={`${record.RecordType}-${index}`}>
                            <Icon src={IconTeam}/>}
                            <div className="slide-title">{record.Name}</div>
                            <Icon src={IconX} 
                                className="remove"
                                onClick={() => {
                                    MediaQueueController.Remove(index);
                                }}
                            />
                        </React.Fragment>,
                        className:cnames({active:(index === this.state.Index)})
                    })
                break;
            }

        });

        return (
            <div className="queue-items">
                <SortPanel
                    items={items}
                    index={this.state.Index}
                    onDrop={MediaQueueController.SwapRecords}
                    onDoubleClick={(index:number) => {
                        if(this.state.Records[index] && this.state.Records[index].RecordType == vars.RecordType.Anthem) {
                            AnthemCaptureController.SetClass('');
                        }
                        MediaQueueController.SetRecord(index);
                    }}
                />
            </div>
        )
    }
}