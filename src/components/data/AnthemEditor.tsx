import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { AnthemRecord } from 'tools/vars';

/**
 * Component for editing National Anthem records.
 */
export default class AnthemEditor extends React.PureComponent<{
    /**
     * The record to edit
     */
    record:AnthemRecord|null;
    /**
     * true to show, false to hide
     */
    opened:boolean;
}, {
    /**
     * Biography of current record
     */
    Biography:string;
}> {
    readonly state ={
        Biography:''
    }

    /**
     * DataController listener
     */
    protected remoteData:Function|null = null;

    /**
     * Constructor
     * @param props 
     */
    constructor(props) {
        super(props);
        this.onChangeBio = this.onChangeBio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    /**
     * Triggered when the user changes the value of the quarter for this phase.
     * @param {Event} ev 
     */
    onChangeBio(ev: React.ChangeEvent<HTMLTextAreaElement>) {
        let value:string = ev.currentTarget.value;
        this.setState(() => {
            return {Biography:value};
        });
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Biography:this.state.Biography
        });
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        let bio:string = record.Biography || '';
        this.setState({Biography:bio});
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
                recordType={vars.RecordType.Anthem}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td>Biography</td>
                    <td colSpan={3}>
                        <textarea rows={5} cols={50} maxLength={300}
                            value={this.state.Biography}
                            onChange={this.onChangeBio}
                            />
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}