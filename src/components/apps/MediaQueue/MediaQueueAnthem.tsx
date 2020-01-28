import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import vars, { SlideshowRecord, VideoRecord, AnthemRecord } from 'tools/vars';
import MediaQueueController from 'controllers/MediaQueueController';
import DataController from 'controllers/DataController';
import { Unsubscribe } from 'redux';
import { Compare, AddMediaPath } from 'controllers/functions';

export default class MediaQueueAnthem extends React.PureComponent<any, {
    Record:SlideshowRecord | VideoRecord | AnthemRecord | undefined | null;
    BackgroundImage:string;
}> {
    readonly state = {
        Record:MediaQueueController.GetState().Record,
        BackgroundImage:DataController.GetMiscRecord('NationalFlag')
    }

    protected remoteMedia?:Unsubscribe;
    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateMedia = this.updateMedia.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    protected updateMedia() {
        this.setState({
            Record:MediaQueueController.GetState().Record
        });
    }

    protected updateData() {
        this.setState({
            BackgroundImage:DataController.GetMiscRecord('NationalFlag')
        });
    }

    componentDidMount() {
        this.remoteMedia = MediaQueueController.Subscribe(this.updateMedia);
        this.remoteData = DataController.Subscribe(this.updateData);
    }

    componentWillUnmount() {
        if(this.remoteMedia)
            this.remoteMedia();
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        let shown:boolean = (this.state.Record && this.state.Record.RecordType === vars.RecordType.Anthem) ? true : false;
        let style:CSSProperties = {backgroundImage:'none'};
        let name:string = '';
        let bio:string = '';
        if(this.state.Record && this.state.Record.RecordType === vars.RecordType.Anthem) {
            let singer:any = Object.assign({}, this.state.Record);
            shown = true;
            name = this.state.Record.Name;
            if(singer.Biography)
                bio = singer.Biography;
        }
        if(this.state.BackgroundImage)
            style.backgroundImage = "url('" + AddMediaPath(this.state.BackgroundImage) + "')";

        return (
            <div 
                className={cnames('record-control anthem', {shown:shown})}
                style={style}
                >
                <div className="singer-name">{name}</div>
                <div className="singer-bio">{bio}</div>
            </div>
        );
    }
    
}