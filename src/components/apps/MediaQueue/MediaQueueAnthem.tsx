import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import vars, { SlideshowRecord, VideoRecord, AnthemRecord } from 'tools/vars';
import MediaQueueController from 'controllers/MediaQueueController';
import DataController from 'controllers/DataController';
import { Unsubscribe } from 'redux';

export default class MediaQueueAnthem extends React.PureComponent<any, {
    Record:SlideshowRecord | VideoRecord | AnthemRecord | undefined | null;
}> {
    readonly state = {
        Record:MediaQueueController.getState().Record
    }

    protected BackgroundImage:string = DataController.GetMiscRecord('NationalAnthemSinger').Background

    protected remoteMedia:Unsubscribe|null = null;

    constructor(props) {
        super(props);
        this.updateMedia = this.updateMedia.bind(this);
    }

    protected async updateMedia() {
        let record = MediaQueueController.getState().Record;
        if(!DataController.compare(record, this.state.Record))
            this.setState({Record:record});
    }

    componentDidMount() {
        this.remoteMedia = MediaQueueController.subscribe(this.updateMedia)
    }

    componentWillUnmount() {
        if(this.remoteMedia !== null)
            this.remoteMedia();
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
        if(this.BackgroundImage)
            style.backgroundImage = "url('" + DataController.mpath(this.BackgroundImage) + "')";

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