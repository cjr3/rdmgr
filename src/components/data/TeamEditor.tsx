import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import vars, { TeamRecord } from 'tools/vars';
import {Unsubscribe} from 'redux';
import TeamsController from 'controllers/TeamsController';
import RecordList from './RecordList';
import { compareRecordName } from 'tools/functions';

interface props extends PRecordEditor {
    record:TeamRecord|null
};

/**
 * Component for editing team records.
 */
export default class TeamEditor extends React.PureComponent<props> {
    /**
     * Renders the component.
     */
    render() {
        return (
            <RecordEditor 
                recordType={vars.RecordType.Team}
                {...this.props}
                >
            </RecordEditor>
        );
    }
}


export class TeamRecordList extends React.PureComponent<{
    shown:boolean;
    record:TeamRecord|null;
    onSelect:Function;
    keywords?:string;
}, {
    Records:Array<TeamRecord>;
}> {
    readonly state = {
        Records:TeamsController.Get().sort(compareRecordName)
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:TeamsController.Get().sort(compareRecordName)});
    }

    componentDidMount() {
        this.remoteData = TeamsController.Subscribe(this.updateData);
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