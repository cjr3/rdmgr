import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars from 'tools/vars';

/**
 * Component for editing National Anthem records.
 */
class AnthemEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Biography:'',
            records:Object.assign({}, DataController.getAnthemSingers())
        }

        this.onChangeBio = this.onChangeBio.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remote = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller.
     * - Update changed phase records.
     */
    updateState() {
        var records = DataController.getAnthemSingers();
        if(!DataController.compare(records, this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, records)}
            });
        }
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
                records={this.state.records}
                onSubmit={this.onSubmit}
                {...this.props}
                >
                <h3>Biography</h3>
                <textarea rows="5" cols="50" maxLength={300}
                    value={bio}
                    onChange={this.onChangeBio}
                    />
            </RecordEditor>
        )
    }
}

export default AnthemEditor;