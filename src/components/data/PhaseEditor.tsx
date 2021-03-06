import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import vars, { PhaseRecord } from 'tools/vars';
import {Unsubscribe} from 'redux';
import PhasesController from 'controllers/PhasesController';
import RecordList from './RecordList';

interface props extends PRecordEditor {
    record:PhaseRecord|null;
};

/**
 * Component for editing a Phase record.
 */
export default class PhaseEditor extends React.PureComponent<props, {
    /**
     * Hours of the phase
     */
    hour:number;
    /**
     * Minutes of the phase
     */
    minute:number;
    /**
     * Seconds of the phase
     */
    second:number;
    /**
     * Quarter of the phase
     * 1-4
     */
    quarter:number;
}> {
    readonly state = {
        hour:0,
        minute:0,
        second:0,
        quarter:0
    }

    constructor(props) {
        super(props);
        this.onChangeHour = this.onChangeHour.bind(this);
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onChangeQuarter = this.onChangeQuarter.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    /**
     * Triggered when the value for the hour textbox changes.
     * @param {Event} ev 
     */
    protected onChangeHour(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState(() => {
            return {hour:value};
        });
    }

    /**
     * Triggered when the value for the minute textbox changes.
     * @param {Event} ev 
     */
    protected onChangeMinute(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState(() => {
            return {minute:value};
        });
    }
    /**
     * Triggered when the value for the second textbox changes.
     * @param {Event} ev 
     */
    protected onChangeSecond(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:number = parseInt(ev.currentTarget.value);
        this.setState(() => {
            return {second:value};
        });
    }

    /**
     * Triggered when the user changes the value of the quarter for this phase.
     * @param {Event} ev 
     */
    protected onChangeQuarter(ev:React.ChangeEvent<HTMLSelectElement>) {
        let value:number = parseInt( ev.currentTarget.value );
        this.setState(() => {
            return {quarter:value};
        });
    }

    /**
     * Triggered when the user selects a record to edit.
     * @param {Object} record 
     */
    protected onSelect(record) {
        let duration:Array<number> = [0,0,0];
        if(record && record.Duration)
            duration = record.Duration.slice();
        this.setState({
            hour:duration[0],
            minute:duration[1],
            second:duration[2],
            quarter:record.PhaseQtr
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    protected onSubmit(record) {
        let duration:Array<number> = [this.state.hour, this.state.minute, this.state.second];
        return Object.assign({}, record, {
            Duration:duration,
            PhaseTime:duration.join(':'),
            PhaseQtr:this.state.quarter
        });
    }

    /**
     * Triggered when the component is updated
     * @param {Object} prevProps 
     */
    componentDidUpdate(prevProps) {
        if(this.props.record) {
            if(prevProps.record) {
                if(prevProps.record.RecordID !== this.props.record.RecordID) {
                    this.onSelect(this.props.record);
                }
            } else {
                this.onSelect(this.props.record);
            }
        }
    }

    /**
     * Renders the component.
     */
    render() {
        var qtr = (Number.isNaN(this.state.quarter)) ? 0 : this.state.quarter;
        return (
            <RecordEditor 
                recordType={vars.RecordType.Phase}
                {...this.props}
                >
                <tr>
                    <td>Duration</td>
                    <td colSpan={2}>
                        <input type="number"
                            min={0}
                            max={23}
                            value={this.state.hour}
                            onChange={this.onChangeHour}
                            className="large"
                            /> : 
                        <input type="number"
                            min={0}
                            max={59}
                            value={this.state.minute}
                            onChange={this.onChangeMinute}
                            className="large"
                            /> : 
                        <input type="number"
                            min={0}
                            max={59}
                            value={this.state.second}
                            onChange={this.onChangeSecond}
                            className="large"
                            />
                    </td>
                </tr>
                <tr>
                    <td>Quarter</td>
                    <td>
                        <select size={1} onChange={this.onChangeQuarter} value={qtr}>
                            <option value={0}>None</option>
                            <option value={1}>1ST</option>
                            <option value={2}>2ND</option>
                            <option value={3}>3RD</option>
                            <option value={4}>4TH</option>
                        </select>
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}


export class PhaseRecordList extends React.PureComponent<{
    shown:boolean;
    record:PhaseRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<PhaseRecord>;
}> {
    readonly state = {
        Records:PhasesController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:PhasesController.Get()});
    }

    componentDidMount() {
        this.remoteData = PhasesController.Subscribe(this.updateData);
    }

    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        return (
            <RecordList
                keywords={this.props.keywords}
                className={(this.props.shown) ? 'shown' : ''}
                onSelect={this.props.onSelect}
                recordid={(this.props.record) ? this.props.record.RecordID : 0}
                records={this.state.Records}
                />
        )
    }
}