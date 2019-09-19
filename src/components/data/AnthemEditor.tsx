import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { AnthemRecord } from 'tools/vars';

interface SAnthemEditor {
    Biography:string,
    Records:Array<AnthemRecord>
}

interface PAnthemEditor {
    record:AnthemRecord,
    opened:boolean
}

/**
 * Component for editing National Anthem records.
 */
class AnthemEditor extends React.PureComponent<PAnthemEditor, SAnthemEditor> {
    readonly state:SAnthemEditor ={
        Biography:'',
        Records:DataController.getAnthemSingers(true)
    }

    remoteData:Function

    constructor(props) {
        super(props);
        this.onChangeBio = this.onChangeBio.bind(this);
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
        this.setState({Records:DataController.getAnthemSingers(true)});
    }

    /**
     * Triggered when the user changes the value of the quarter for this phase.
     * @param {Event} ev 
     */
    onChangeBio(ev) {
        var value = ev.target.value;
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
        var bio = record.Biography || '';
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
        var bio = this.state.Biography || '';

        return (
            <RecordEditor 
                recordType={vars.RecordType.Anthem}
                records={this.state.Records}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td>Biography</td>
                    <td colSpan={3}>
                        <textarea rows={5} cols={50} maxLength={300}
                            value={bio}
                            onChange={this.onChangeBio}
                            />
                    </td>
                </tr>
            </RecordEditor>
        )
    }
}

export default AnthemEditor;