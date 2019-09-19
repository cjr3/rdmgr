import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars, { TeamRecord } from 'tools/vars';

interface STeamEditor {
    records:Array<TeamRecord>;
}

interface PTeamEditor {
    record:TeamRecord;
    opened:boolean;
}

/**
 * Component for editing team records.
 */
class TeamEditor extends React.PureComponent<PTeamEditor, STeamEditor> {
    readonly state:STeamEditor = {
        records:DataController.getTeams(true)
    }
    remoteData:Function
    constructor(props) {
        super(props);

        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the 
     */
    updateState() {
        if(!DataController.compare(DataController.getTeams(), this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, DataController.getTeams())};
            });
        }
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <RecordEditor 
                recordType={vars.RecordType.Team}
                records={this.state.records}
                opened={this.props.opened}
                {...this.props}
                >
            </RecordEditor>
        );
    }
}

export default TeamEditor;