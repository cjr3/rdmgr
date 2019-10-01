import React from 'react';
import RecordEditor from './RecordEditor';
import vars, { TeamRecord } from 'tools/vars';

/**
 * Component for editing team records.
 */
export default class TeamEditor extends React.PureComponent<{
    /**
     * Record to edit
     */
    record:TeamRecord|null;
    /**
     * true to show, false to hide
     */
    opened:boolean;
}> {
    /**
     * Renders the component.
     */
    render() {
        return (
            <RecordEditor 
                recordType={vars.RecordType.Team}
                opened={this.props.opened}
                {...this.props}
                >
            </RecordEditor>
        );
    }
}