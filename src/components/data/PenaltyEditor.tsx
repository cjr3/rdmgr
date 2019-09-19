import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { PenaltyRecord } from 'tools/vars';

interface SPenaltyEditor {
    Description:string,
    Records:Array<PenaltyRecord>
}

interface PPenaltyEditor {
    record:PenaltyRecord,
    opened:boolean
}

/**
 * Component for editing penalty records.
 */
class PenaltyEditor extends React.PureComponent<PPenaltyEditor, SPenaltyEditor> {
    readonly state:SPenaltyEditor = {
        Description:'',
        Records:DataController.getPenalties(true)
    }

    remoteData:Function

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.updateState = this.updateState.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        this.setState({
            Records:DataController.getPenalties(true)
        });
    }

    /**
     * Triggered when the description textbox value changes.
     * @param {Event} ev 
     */
    onChangeDescription(ev) {
        var value = ev.target.value;
        this.setState(() => {return {Description:value};});
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Description:this.state.Description
        });
    }

    /**
     * Triggered when the user selects a record to edit.
     * @param {Object} record 
     */
    onSelect(record) {
        this.setState({
            Description:record.Description
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
        return (
            <RecordEditor 
                recordType={vars.RecordType.Penalty}
                records={this.state.Records}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td>Description</td>
                    <td colSpan={3}>
                        <textarea rows={5} cols={50} maxLength={300}
                            value={this.state.Description}
                            onChange={this.onChangeDescription}
                            />
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}

export default PenaltyEditor;