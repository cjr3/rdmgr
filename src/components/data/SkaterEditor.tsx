import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import {ToggleButton} from 'components/Elements';
import vars, { SkaterTeamRecord, TeamRecord, SkaterRecord } from 'tools/vars';

interface SSkaterEditor {
    SkaterTeams:Array<SkaterTeamRecord>;
    SkaterID:number;
    Teams:Array<TeamRecord>;
    records:Array<SkaterRecord>;
}

interface PSkaterEditor {
    record:SkaterRecord;
    opened:boolean;
}

/**
 * Component to edit a skater record.
 */
class SkaterEditor extends React.PureComponent<PSkaterEditor, SSkaterEditor> {
    readonly state:SSkaterEditor = {
        SkaterTeams:[],
        SkaterID:0,
        Teams:DataController.getTeams(true),
        records:DataController.getSkaters(true)
    }

    remoteData:Function

    constructor(props) {
        super(props);
        this.addTeam = this.addTeam.bind(this);
        this.removeTeam = this.removeTeam.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.updateState = this.updateState.bind(this);
        this.remoteData = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller
     */
    updateState() {
        this.setState({
            Teams:DataController.getTeams(true),
            records:DataController.getSkaters(true)
        });
    }

    /**
     * Adds the skater to the given team
     * @param {Number} id 
     */
    addTeam(id) {
        var found = false;
        if(this.state.SkaterTeams) {
            this.state.SkaterTeams.forEach((team) => {
                if(team.TeamID === id)
                    found = true;
            });
        }

        if(!found) {
            this.setState((state) => {
                var teams:Array<SkaterTeamRecord> = [];
                if(state.SkaterTeams) {
                    teams = state.SkaterTeams.slice();
                }

                teams.push({
                    SkaterID:this.state.SkaterID,
                    TeamID:id,
                    Jammer:false,
                    Blocker:false,
                    Pivot:false,
                    Coach:false,
                    Manager:false,
                    Regulator:false,
                    Trainer:false
                });

                return {SkaterTeams:teams};
            })
        }
    }

    /**
     * Removes the skater from the given team.
     * @param {Number} id 
     */
    removeTeam(id) {
        var found = false;
        if(this.state.SkaterTeams.length <= 0)
            return this;
        
        this.state.SkaterTeams.forEach((team) => {
            if(team.TeamID === id)
                found = true;
        });

        if(found) {
            this.setState((state) => {
                return {
                    SkaterTeams:state.SkaterTeams.filter(team => (team.TeamID !== id))
                };
            });
        }
    }

    /**
     * Triggered when the user clicks the submit button.
     * @param {Object} record 
     */
    onSubmit(record) {
        return Object.assign({}, record, {
            Teams:this.state.SkaterTeams.slice()
        });
    }

    /**
     * Triggered when the user selects a record.
     * @param {Object} record 
     */
    onSelect(record) {
        var teams:Array<SkaterTeamRecord> = [];
        if(record && record.Teams && record.Teams.length) {
            teams = record.Teams.slice();
            teams.forEach((team) => {
                team.SkaterID = record.RecordID;
            });
        }

        this.setState({
            SkaterTeams:teams
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
        var teams:Array<React.ReactElement> = [];
        if(this.state.Teams) {
            var items = Object.entries(this.state.Teams);
            items.forEach((item) => {
                let team = item[1];
                var checked = false;
                this.state.SkaterTeams.forEach((steam) => {
                    if(steam.TeamID === team.RecordID)
                        checked = true;
                });

                teams.push(
                    <ToggleButton 
                        label={team.Name} key={"team" + team.RecordID}
                        checked={checked}
                        title={team.Name}
                        onClick={() => {
                            if(checked)
                                this.removeTeam(team.RecordID);
                            else
                                this.addTeam(team.RecordID);
                        }}
                    />
                );
            });
        }
        
        return (
            <RecordEditor 
                recordType={vars.RecordType.Skater}
                records={this.state.records}
                onSubmit={this.onSubmit}
                opened={this.props.opened}
                {...this.props}
                >
                <tr>
                    <td>Teams</td>
                    <td colSpan={3}>
                        <div className="stack-panel s3">{teams}</div>
                    </td>
                </tr>
            </RecordEditor>
        );
    }
}

export default SkaterEditor;