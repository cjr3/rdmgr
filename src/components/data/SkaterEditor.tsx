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
        this.changePosition = this.changePosition.bind(this);
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
    addTeam(id:number) {
        let index = this.state.SkaterTeams.findIndex((team) => {
            return (team.TeamID === id);
        });

        if(index < 0) {
            this.setState((state) => {
                let teams = state.SkaterTeams.slice();
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
    removeTeam(id:number) {
        let index = this.state.SkaterTeams.findIndex((team) => {
            return (team.TeamID === id);
        })

        if(index >= 0) {
            this.setState((state) => {
                return {
                    SkaterTeams:state.SkaterTeams.filter(team => (team.TeamID !== id))
                };
            });
        }
    }

    /**
     * Triggered when the user changes the position assignment on a team for the skater
     * @param id number
     * @param position string
     */
    protected changePosition(id:number, position:string) {
        this.setState((state) => {
            let teams = state.SkaterTeams.slice();
            teams.forEach((team) => {
                if(team.TeamID === id) {
                    if(typeof(team[position]) === 'boolean') {
                        team[position] = !team[position];
                    } else {
                        team[position] = true;
                    }
                }
            });
            return {SkaterTeams:teams};
        });
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
                let captain:boolean = false;
                let cocaptain:boolean = false;
                let coach:boolean = false;
                let checked:boolean = false;
                this.state.SkaterTeams.forEach((steam) => {
                    if(steam.TeamID === team.RecordID) {
                        checked = true;
                        captain = (steam.Captain !== undefined) ? steam.Captain : false;
                        cocaptain = (steam.CoCaptain !== undefined) ? steam.CoCaptain : false;
                        coach = (steam.Coach !== undefined) ? steam.Coach : false;
                    }
                });

                teams.push(<SkaterTeam
                        key={`${team.RecordType}-${team.RecordID}`}
                        team={team}
                        captain={captain}
                        cocaptain={cocaptain}
                        coach={coach}
                        selected={checked}
                        onCheckTeam={() => {
                            if(checked)
                                this.removeTeam(team.RecordID)
                            else
                                this.addTeam(team.RecordID);
                        }}
                        onCheckPosition={(position:string) => {
                            this.changePosition(team.RecordID, position);
                        }}
                    />
                );

                // teams.push(
                //     <ToggleButton 
                //         label={team.Name} key={"team" + team.RecordID}
                //         checked={checked}
                //         title={team.Name}
                //         onClick={() => {
                //             if(checked)
                //                 this.removeTeam(team.RecordID);
                //             else
                //                 this.addTeam(team.RecordID);
                //         }}
                //     />
                // );
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
                        <div>{teams}</div>
                    </td>
                </tr>
            </RecordEditor>
        );
    }
}

interface PSkaterTeam {
    team:TeamRecord;
    captain:boolean;
    cocaptain:boolean;
    coach:boolean;
    selected:boolean
    onCheckPosition:Function;
    onCheckTeam:Function;
}

/**
 * Component for displaying a team on the skater edit form,
 * with team assignment and position assignment
 * @param props PSkaterTeam
 */
function SkaterTeam(props:PSkaterTeam) {
    return (
        <div className="skater-teams">
            <ToggleButton 
                label={props.team.Name}
                checked={props.selected}
                title={props.team.Name}
                onClick={props.onCheckTeam}
            />
            <ToggleButton
                label="Captain"
                checked={props.captain}
                onClick={() => {
                    props.onCheckPosition('Captain');
                }}
                />
            <ToggleButton
                label="CoCaptain"
                checked={props.cocaptain}
                onClick={() => {
                    props.onCheckPosition('CoCaptain');
                }}
                />
            <ToggleButton
                label="Coach"
                checked={props.coach}
                onClick={() => {
                    props.onCheckPosition('Coach');
                }}
                />
        </div>
    );
}

export default SkaterEditor;