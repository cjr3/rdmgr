import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import vars, { PenaltyRecord } from 'tools/vars';
import PenaltiesController from 'controllers/PenaltiesController';
import { Unsubscribe } from 'redux';
import RecordList from './RecordList';

interface props extends PRecordEditor {
    record:PenaltyRecord|null
};

/**
 * Component for editing penalty records.
 */
export default class PenaltyEditor extends React.PureComponent<props, {
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

export class PenaltyRecordList extends React.PureComponent<{
    shown:boolean;
    record:PenaltyRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<PenaltyRecord>;
}> {
    readonly state = {
        Records:PenaltiesController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:PenaltiesController.Get()});
    }

    componentDidMount() {
        this.remoteData = PenaltiesController.Subscribe(this.updateData);
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