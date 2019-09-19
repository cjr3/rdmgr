import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { PhaseRecord } from 'tools/vars';

interface SPhaseEditor {
    hour:number,
    minute:number,
    second:number,
    quarter:number,
    records:Array<PhaseRecord>
}

interface PPhaseEditor {
    record:PhaseRecord,
    opened:boolean
}

/**
 * Component for editing a Phase record.
 */
class PhaseEditor extends React.PureComponent<PPhaseEditor, SPhaseEditor> {
    readonly state:SPhaseEditor = {
        hour:0,
        minute:0,
        second:0,
        quarter:0,
        records:DataController.getPhases()
    }

    remoteData:Function

    constructor(props) {
        super(props);
        this.onChangeHour = this.onChangeHour.bind(this);
        this.onChangeMinute = this.onChangeMinute.bind(this);
        this.onChangeSecond = this.onChangeSecond.bind(this);
        this.onChangeQuarter = this.onChangeQuarter.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     * - Update changed phase records.
     */
    updateState() {
        if(!DataController.compare(DataController.getPhases(), this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, DataController.getPhases())}
            });
        }
    }

    /**
     * Triggered when the value for the hour textbox changes.
     * @param {Event} ev 
     */
    onChangeHour(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {hour:Number.parseInt(value)};
        });
    }

    /**
     * Triggered when the value for the minute textbox changes.
     * @param {Event} ev 
     */
    onChangeMinute(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {minute:Number.parseInt(value)};
        });
    }
    /**
     * Triggered when the value for the second textbox changes.
     * @param {Event} ev 
     */
    onChangeSecond(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {second:Number.parseInt(value)};
        });
    }

    /**
     * Triggered when the user changes the value of the quarter for this phase.
     * @param {Event} ev 
     */
    onChangeQuarter(ev) {
        var value = ev.target.value;
        this.setState(() => {
            return {quarter:Number.parseInt(value)};
        });
    }

    /**
     * Triggered when the user selects a record to edit.
     * @param {Object} record 
     */
    onSelect(record) {
        var duration = [0,0,0];
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
    onSubmit(record) {
        var duration = [this.state.hour, this.state.minute, this.state.second];
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
                records={this.state.records}
                opened={this.props.opened}
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
                        <input type="number"
                            min={0}
                            max={4}
                            value={qtr}
                            onChange={this.onChangeQuarter}
                            className="large"
                            />
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}

export default PhaseEditor;