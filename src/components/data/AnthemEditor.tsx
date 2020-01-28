import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import vars, { AnthemRecord } from 'tools/vars';
import AnthemsController from 'controllers/AnthemsController';
import { Unsubscribe } from 'redux';
import RecordList from './RecordList';

interface props extends PRecordEditor {
    record:AnthemRecord|null;
}

/**
 * Component for editing National Anthem records.
 */
export default class AnthemEditor extends React.PureComponent<props, {
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

export class AnthemRecordList extends React.PureComponent<{
    shown:boolean;
    record:AnthemRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<AnthemRecord>;
}> {
    readonly state = {
        Records:AnthemsController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:AnthemsController.Get()});
    }

    componentDidMount() {
        this.remoteData = AnthemsController.Subscribe(this.updateData);
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