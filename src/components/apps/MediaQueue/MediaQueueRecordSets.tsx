import React from 'react';
import vars, { SlideshowRecord } from 'tools/vars';
import MediaQueueController from 'controllers/MediaQueueController';
import RecordSelector from 'components/data/RecordSelector';
import SlideshowsController from 'controllers/SlideshowsController';
import { Unsubscribe } from 'redux';
import SlideshowController from 'controllers/SlideshowController';
import SponsorController from 'controllers/SponsorController';
import SponsorCaptureController from 'controllers/capture/Sponsor';
import { Icon, IconHidden, IconShown, IconRight } from 'components/Elements';
import { compareRecordName } from 'tools/functions';

export default class MediaQueueRecordSets extends React.PureComponent<any, {
    SponsorShowID:number;
}> {
    readonly state = {
        SponsorShowID:0
    }

    protected RecordTypes:Array<string> = new Array<string>(
        vars.RecordType.Anthem,
        vars.RecordType.Slideshow,
        vars.RecordType.Video
    );

    render() {

        return (
            <div className="recordsets">
            <SponsorSelector/>
            <RecordSelector
                types={this.RecordTypes}
                recordType={this.RecordTypes[1]}
                highlight={false}
                onSelect={(record) => {
                    MediaQueueController.Add(record);
                }}
            />
            </div>
        )
    }
}

class SponsorSelector extends React.PureComponent<any, {
    Records:Array<SlideshowRecord>;
    ID:number;
    Shown:boolean;
}> {
    readonly state = {
        Records:SlideshowsController.Get().sort(compareRecordName),
        Shown:SponsorCaptureController.GetState().Shown,
        ID:0
    }

    protected remoteSlideshows?:Unsubscribe;
    protected remoteCapture?:Unsubscribe;
    
    protected selectItem:React.RefObject<HTMLSelectElement> = React.createRef();

    constructor(props) {
        super(props);
        this.updateSlideshows = this.updateSlideshows.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.onSelectSlideshow = this.onSelectSlideshow.bind(this);
    }

    protected updateSlideshows() {
        this.setState({Records:SlideshowsController.Get().sort(compareRecordName)});
    }

    protected updateCapture() {
        this.setState({Shown:SponsorCaptureController.GetState().Shown});
    }

    protected onSelectSlideshow(ev: React.ChangeEvent<HTMLSelectElement>) {
        let value:number = Number.parseInt(ev.currentTarget.value);

        if(this.selectItem && this.selectItem.current) {
            this.selectItem.current.blur();
        }

        this.setState({ID:value}, () => {
            let record:SlideshowRecord = this.state.Records.find(r => r.RecordID == this.state.ID);
            if(record && record.Records) {
                SponsorController.SetSlides(record.Records, record.RecordID);
                SponsorController.Start();
            } else {
                SponsorController.SetSlides([], 0);
                SponsorController.Stop();
                SponsorCaptureController.Hide();
            }
        });
    }

    componentDidMount() {
        this.remoteSlideshows = SlideshowsController.Subscribe(this.updateSlideshows);
        this.remoteCapture = SponsorCaptureController.Subscribe(this.updateCapture);
    }

    componentWillUnmount() {
        if(this.remoteSlideshows)
            this.remoteSlideshows();
        if(this.remoteCapture)
            this.remoteCapture();
    }

    render() {
        const shows:Array<React.ReactElement> = new Array<React.ReactElement>(
            <option key={`def`} value={0}>(none)</option>
        );

        const records:Array<SlideshowRecord> = this.state.Records;
        let viewIcon:string = IconHidden;
        if(this.state.Shown)
            viewIcon = IconShown;

        if(records) {
            records.forEach((slideshow:SlideshowRecord) => {
                shows.push(
                    <option
                        key={`${slideshow.RecordType}-${slideshow.RecordID}`}
                        value={slideshow.RecordID}
                        >{slideshow.Name}</option>
                );
            });
        }

        return (
            <div className="sponsor-selector">
                <select
                    size={1}
                    value={this.state.ID}
                    onChange={this.onSelectSlideshow}
                    ref={this.selectItem}
                    >
                    {shows}
                </select>
                <Icon
                    src={viewIcon}
                    active={this.state.Shown}
                    title={"Show/Hide"}
                    onClick={SponsorCaptureController.Toggle}
                    />
                <Icon
                    src={IconRight}
                    title="Next Slide"
                    onClick={SponsorController.ForceNext}
                    />
            </div>
        )
    }
}