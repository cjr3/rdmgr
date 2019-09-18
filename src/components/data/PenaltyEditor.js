import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars from 'tools/vars';

/**
 * Component for editing penalty records.
 */
class PenaltyEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Description:'',
            records:Object.assign({}, DataController.getPenalties())
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.updateState = this.updateState.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.remote = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     */
    updateState() {
        var records = DataController.getPenalties();
        if(!DataController.compare(records, this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, records)};
            });
        }
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
                records={this.state.records}
                onSubmit={this.onSubmit}
                {...this.props}
                >
                <h2>Description</h2>
                <textarea rows="5" cols="50" maxLength={300}
                    value={this.state.Description}
                    onChange={this.onChangeDescription}
                    />
            </RecordEditor>
        )
    }
}

export default PenaltyEditor;