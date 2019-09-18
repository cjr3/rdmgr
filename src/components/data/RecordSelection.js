import React from 'react';
import {Button, IconButton} from 'components/Elements';
import Panel from 'components/Panel';
import './css/RecordList.scss'
import vars from 'tools/vars';

class RecordSelection extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            keys:[]
        };
        this.toggleRecord = this.toggleRecord.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    /**
     * Triggered when the user clicks a record.
     * - Toggles a record's selection.
     * @param {Mixed} key 
     */
    toggleRecord(key) {
        this.setState((state) => {
            var index = state.keys.findIndex((k) => {
                return (k === key);
            });
            var keys = state.keys.slice();
            if(index < 0)
                keys.push(key);
            else
                keys.splice(index, 1);
            return {keys:keys};
        });
    }

    /**
     * Clears the selection of records.
     * - Does not update the record list on the clojure.
     */
    clearSelection() {
        this.setState(() => {return {keys:[]}});
    }

    /**
     * Triggered when the user clicks the submit button.
     * - Sends the skater list to the onSubmit property clojure.
     */
    onClickSubmit() {
        if(this.props.onSubmit) {
            var skaters = [];
            if(this.state.keys >= 1) {
                this.state.keys.forEach((key) => {
                    if(this.props.records[key])
                        skaters.push(this.props.records[key]);
                });
            }
            this.props.onSubmit(skaters);
        }

        if(this.props.onClose)
            this.props.onClose();
    }

    /**
     * 
     */
    componentDidUpdate() {
        
    }

    /**
     * Renders the component.
     * - Displays all records.
     */
    render() {
        let items = [];
        if(this.props.records) {
            let keys = Object.entries(this.props.records).sort((a, b) => a[1].Name.localeCompare(b[1].Name));
            keys.forEach((record) => {

                let label = `${record[1].Name}`;
                if(record[1].RecordType === vars.RecordType.Skater) {
                    label = `#${record[1].Number} - ${record[1].Name}`;
                }

                items.push(
                    <Button
                        active={(this.state.keys.indexOf(record[0]) >= 0)}
                        key={record[0]}
                        onClick={() => {
                            this.toggleRecord(record[0]);
                        }}
                        >{label}</Button>
                );
            });
        }

        var buttons = [
            <IconButton
                onClick={this.clearSelection}
                src={require('images/icons/no.png')}
                title="Clear Selection"
                key="btn-clear"
            >Clear</IconButton>,
            <IconButton
                onClick={this.onClickSubmit}
                src={require('images/icons/check.png')}
                title="Submig"
                key="btn-submit"
            >Accept</IconButton>
        ];

        return (
            <Panel
                opened={this.props.opened}
                popup={true}
                buttons={buttons}
                contentName="record-list"
                onClose={this.props.onClose}
                className={this.props.className}
                title={this.props.title}
            >
                {items}
            </Panel>
        );
    }
}

export default RecordSelection;