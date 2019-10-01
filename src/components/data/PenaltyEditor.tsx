import React from 'react';
import RecordEditor from './RecordEditor';
import vars, { PenaltyRecord } from 'tools/vars';

/**
 * Component for editing penalty records.
 */
export default class PenaltyEditor extends React.PureComponent<{
    /**
     * Record to edit
     */
    record:PenaltyRecord|null;
    /**
     * true to show, false to hide
     */
    opened:boolean;
}, {
    /**
     * Description of the penalty record
     */
    Description:string;
}> {
    readonly state = {
        Description:''
    }

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
    }

    /**
     * Triggered when the description textbox value changes.
     * @param {Event} ev 
     */
    onChangeDescription(ev:React.ChangeEvent<HTMLTextAreaElement>) {
        var value = ev.currentTarget.value;
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