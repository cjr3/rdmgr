import React from 'react';
import RecordEditor from './RecordEditor';
import DataController from 'controllers/DataController';
import {ToggleButton} from 'components/Elements';
import vars from 'tools/vars';

/**
 * Component to edit a skater record.
 */
class SkaterEditor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            SkaterTeams:[],
            SkaterID:0,
            Teams:Object.assign({}, DataController.getTeams()),
            records:Object.assign({}, DataController.getSkaters())
        };

        this.addTeam = this.addTeam.bind(this);
        this.removeTeam = this.removeTeam.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);

        this.updateState = this.updateState.bind(this);
        this.remote = DataController.subscribe(this.updateState);
    }

    /**
     * Updates the state to match the controller
     */
    updateState() {
        if(!DataController.compare(DataController.getTeams(), this.state.Teams)) {
            this.setState(() => {
                return {Teams:Object.assign({}, DataController.getTeams())};
            });
        }

        if(!DataController.compare(DataController.getSkaters(), this.state.records)) {
            this.setState(() => {
                return {records:Object.assign({}, DataController.getSkaters())};
            });
        }
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
                var teams = [];
                if(state.SkaterTeams) {
                    teams = state.SkaterTeams.slice();
                }

                teams.push({
                    SkaterID:this.state.SkaterID,
                    TeamID:id,
                    Jammer:"X",
                    Blocker:"X",
                    Pivot:"X",
                    Coach:"X",
                    Manager:"X",
                    Regulator:"X",
                    Trainer:"X"
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
        var teams = [];
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
        var teams = [];
        if(this.state.Teams) {
            var items = Object.entries(this.state.Teams);
            items.forEach((item) => {
                let team = item[1];
                var checked = false;
                this.state.SkaterTeams.forEach((steam) => {
                    if(parseInt(steam.TeamID) === parseInt(team.RecordID))
                        checked = true;
                });

                teams.push(
                    <ToggleButton 
                        label={team.Name} key={"team" + team.RecordID}
                        checked={checked}
                        alt={team.Name}
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
                {...this.props}
                >
                <h2>Teams</h2>
                <div className="stack-panel s3">{teams}</div>
            </RecordEditor>
        );
    }
}

export default SkaterEditor;