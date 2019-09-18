import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import vars from 'tools/vars';

/**
 * Component for editing team records.
 */
class TeamEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            records:Object.assign({}, DataController.getTeams())
        };

        this.updateState = this.updateState.bind(this);
        this.remote = DataController.subscribe(this.updateState);
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
                {...this.props}
                >
            </RecordEditor>
        );
    }
}

export default TeamEditor;