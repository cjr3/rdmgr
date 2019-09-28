import React from 'react';
import DataController from 'controllers/DataController';
import CaptureController from 'controllers/CaptureController';
import CaptureControlPanel, {PCaptureControlPanel} from './CaptureControlPanel';

import  {
    IconX,
    IconCheck,
    IconButton
} from 'components/Elements';

interface SCaptureControlAnthem {
    /**
     * Collection of national anthem singer records
     */
    Records:Array<any>,
    /**
     * Record ID of current national anthem singer
     */
    RecordID:number,
    /**
     * Determines if the national anthem is shown or not
     */
    Shown:boolean,
    /**
     * The className that determines how the national anthem is shown
     */
    className:string
}

/**
 * Component for configuring the national anthem singer.
 */
class CaptureControlAnthem extends React.PureComponent<PCaptureControlPanel, SCaptureControlAnthem> {

    readonly state:SCaptureControlAnthem = {
        Records:DataController.getAnthemSingers(true),
        RecordID:CaptureController.getState().NationalAnthem.Record.RecordID,
        Shown:CaptureController.getState().NationalAnthem.Shown,
        className:CaptureController.getState().NationalAnthem.className
    }

    remoteCapture:Function
    remoteData:Function

    constructor(props) {
        super(props);
        this.onChangeSinger = this.onChangeSinger.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateCapture = this.updateCapture.bind(this);
        this.remoteCapture = CaptureController.subscribe(this.updateCapture);
        this.remoteData = DataController.subscribe(this.updateData);
    }

    /**
     * Updates the state to match the capture controller.
     */
    updateCapture() {
        this.setState(() => {
            return {
                Shown:CaptureController.getState().NationalAnthem.Shown,
                className:CaptureController.getState().NationalAnthem.className,
                RecordID:CaptureController.getState().NationalAnthem.Record.RecordID
            }
        });
    }

    /**
     * Updates the state to match the data controller.
     */
    updateData() {
        this.setState(() => {
            return {Records:DataController.getAnthemSingers(true)};
        });
    }

    /**
     * Triggered when the user changes the default national anthem singer.
     * @param {Event} ev 
     */
    onChangeSinger(ev) {
        var id = parseInt(ev.target.value);
        var singer = DataController.getAnthemSinger(id);
        if(singer === null) {
            singer = {
                RecordID:0,
                Name:'National Anthem',
                Biography:''
            };
        }

        CaptureController.SetNationalAnthemSinger( singer );
    }

    /**
     * Renders the component.
     */
    render() {
        var singers = [
            <option key="singer-def" value="0">(none)</option>
        ];
        this.state.Records.forEach((singer) => {
            singers.push(
                <option
                    key={`${singer.RecordType}-${singer.RecordID}`}
                    value={singer.RecordID}>
                        {singer.Name}
                    </option>
            );
        });

        return (
            <CaptureControlPanel
                active={this.props.active}
                name={this.props.name}
                icon={this.props.icon}
                toggle={this.props.toggle}
                shown={this.state.Shown}
                onClick={this.props.onClick}>
                    <div className="record-list">
                        <IconButton
                            src={(this.state.className === 'banner') ? IconCheck : IconX}
                            active={(this.state.className === 'banner')}
                            onClick={() => {
                                CaptureController.SetNationalAnthemClass('banner');
                            }}
                            >Banner</IconButton>
                        <IconButton
                            src={(this.state.className === '') ? IconCheck : IconX}
                            active={(this.state.className === '')}
                            onClick={() => {
                                CaptureController.SetNationalAnthemClass('');
                            }}
                            >Full Screen</IconButton>
                    </div>
                    <select size={1}
                        value={this.state.RecordID}
                        onChange={this.onChangeSinger}
                        style={{width:"100%"}}
                        >{singers}</select>
                </CaptureControlPanel>
        );
    }
}

export default CaptureControlAnthem;