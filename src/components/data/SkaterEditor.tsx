import React from 'react';
import RecordEditor, {PRecordEditor} from './RecordEditor';
import {ToggleButton} from 'components/Elements';
import vars, { SkaterTeamRecord, TeamRecord, SkaterRecord } from 'tools/vars';
import SkatersController from 'controllers/SkatersController';
import TeamsController from 'controllers/TeamsController';
import { Unsubscribe } from 'redux';
import RecordList from './RecordList';

interface props extends PRecordEditor {
    record:SkaterRecord|null;
}

/**
 * Component to edit a skater record.
 */
export default class SkaterEditor extends React.PureComponent<props, {
    /**
     * Teams the skater is assigned to
     */
    SkaterTeams:Array<SkaterTeamRecord>;
    /**
     * Reference for assigning to skater teams
     */
    SkaterID:number;
    /**
     * Teams to select from
     */
    Teams:Array<TeamRecord>;
}> {
    readonly state = {
        SkaterTeams:new Array<SkaterTeamRecord>(),
        SkaterID:0,
        Teams:TeamsController.Get()
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
        this.addTeam = this.addTeam.bind(this);
        this.removeTeam = this.removeTeam.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.updateData = this.updateData.bind(this);
        this.changePosition = this.changePosition.bind(this);
    }

    /**
     * Updates the state to match the data controller
     * - Update teams
     */
    updateData() {
        this.setState({Teams:TeamsController.Get()});
    }

    /**
     * Adds the skater to the given team
     * @param {Number} id 
     */
    protected addTeam(id:number) {
        let index:number = this.state.SkaterTeams.findIndex(team => team.TeamID == id);
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
    protected removeTeam(id:number) {
        let index:number = this.state.SkaterTeams.findIndex(team => team.TeamID == id);

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
     * Start listeners
     */
    componentDidMount() {
        this.remoteData = TeamsController.Subscribe(this.updateData);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteData !== null)
            this.remoteData();
    }

    /**
     * Renders the component.
     */
    render() {
        let teams:Array<React.ReactElement> = [];
        if(this.state.Teams) {
            let items = Object.entries(this.state.Teams);
            this.state.Teams.forEach((team) => {
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
            });
        }
        
        return (
            <RecordEditor 
                recordType={vars.RecordType.Skater}
                onSubmit={this.onSubmit}
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

export class SkaterRecordList extends React.PureComponent<{
    shown:boolean;
    onSelect:Function;
    record:SkaterRecord|null;
    keywords?:string;
}, {
    Records:Array<SkaterRecord>
}>{
    readonly state = {
        Records:SkatersController.Get()
    }

    protected remoteData?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
    }

    protected updateData() {
        this.setState({Records:SkatersController.Get()});
    }

    componentDidMount() {
        this.remoteData = SkatersController.Subscribe(this.updateData);
    }

    componentWillUnmount() {
        if(this.remoteData)
            this.remoteData();
    }

    render() {
        return (
            <RecordList
                className={(this.props.shown) ? 'shown' : ''}
                records={this.state.Records}
                onSelect={this.props.onSelect}
                keywords={this.props.keywords}
                recordid={(this.props.record) ? this.props.record.RecordID : 0}
            />
        )
    }
}