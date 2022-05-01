import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { MainController } from 'tools/MainController';
import { Roster } from 'tools/roster/functions';
import { Skaters } from 'tools/skaters/functions';
import { Teams } from 'tools/teams/functions';
import { Skater, SkaterPosition, SkaterTeam } from 'tools/vars';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface TeamProps {
    active:boolean;
    blocker:boolean;
    captain:boolean;
    coach:boolean;
    cocaptain:boolean;
    jammer:boolean;
    name:string;
    number:string;
    pivot:boolean;
    teamId:number;
    teamName:string;
    onChangeName:{(teamId:number, value:string):void};
    onChangeNumber:{(teamId:number, value:string):void};
    onSelect:{(id:number):void};
    onSelectPosition:{(id:number,position:SkaterPosition):void};
}

interface State {
    teams:SkaterTeam[];
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        teams:[]
    }

    /**
     * 
     */
    protected load = () => {
        this.setState({
            teams:Skaters.GetTeams(this.props.recordId)
        });
    }

    protected onBeforeSubmit = (values:Skater) : Skater => {
        Roster.UpdateSkater('A', values);
        Roster.UpdateSkater('B', values);
        return {...values, Teams:this.state.teams};
    }

    /**
     * Called when the user changes the skater's alternate name for a given team.
     * @param teamId 
     * @param value 
     */
    protected onChangeTeamSkaterName = (teamId:number, value:string) => {
        const teams = this.state.teams.slice();
        const index = teams.findIndex(r => r.TeamID === teamId);
        const team = {...teams[index]};
        team.Name = value;
        teams[index] = team;
        this.setState({teams:teams});
    }

    /**
     * Called when the user changes the skater's alternate number for a given team.
     * @param teamId 
     * @param value 
     */
    protected onChangeTeamSkaterNumber = (teamId:number, value:string) => {
        const teams = this.state.teams.slice();
        const index = teams.findIndex(r => r.TeamID === teamId);
        const team = {...teams[index]};
        team.Number = value;
        teams[index] = team;
        this.setState({teams:teams});
    }

    /**
     * Called when the user selects a team.
     * @param id 
     */
    protected onSelectTeam = (id:number) => {
        const team = Teams.Get(id);
        if(team) {
            let teams = this.state.teams.slice();
            const index = teams.findIndex(r => r.TeamID === team.RecordID);
            if(index < 0) {
                teams.push({
                    TeamID:team.RecordID,
                    SkaterID:this.props.recordId
                })
            } else {
                teams.splice(index, 1);
            }

            this.setState({teams:teams});
        }
    }

    /**
     * Called when the user selects a position of a selected team.
     * @param teamId 
     * @param position 
     */
    protected onSelectPosition = (teamId:number, position:SkaterPosition) => {
        const index = this.state.teams.findIndex(r => r.TeamID === teamId);
        if(index >= 0) {
            const teams = this.state.teams.slice();
            const team = {...teams[index]};
            switch(position) {
                case 'Blocker' : team.Blocker = (team.Blocker) ? false : true; break;
                case 'Captain' : team.Captain = (team.Captain) ? false : true; break;
                case 'CoCaptain' : team.CoCaptain = (team.CoCaptain) ? false : true; break;
                case 'Coach' : team.Coach = (team.Coach) ? false : true; break;
                case 'Jammer' : team.Jammer = (team.Jammer) ? false : true; break;
                case 'Pivot' : team.Pivot = (team.Pivot) ? false : true; break;
            }
            teams[index] = team;
            this.setState({teams:teams});
        }
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.recordId !== this.props.recordId)
            this.load();
    }

    render() {
        const teams = Object.values(MainController.GetState().Teams);
        return <>
            <BaseRecordForm
                recordId={this.props.recordId}
                recordType='SKR'
                showURL={false}
                onCancel={this.props.onSave}
                onSave={this.props.onSave}
                onBeforeSubmit={this.onBeforeSubmit}
            >
                <tr>
                    <td>Teams</td>
                    <td>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td>Team</td>
                                    <td colSpan={7}>Positions</td>
                                </tr>
                                {
                                    teams.map(team => {
                                        const skaterTeam = this.state.teams.find(r => r.TeamID === team.RecordID);
                                        return <TeamItem
                                            active={(skaterTeam !== undefined) ? true : false}
                                            blocker={skaterTeam?.Blocker || false}
                                            captain={skaterTeam?.Captain || false}
                                            coach={skaterTeam?.Coach || false}
                                            cocaptain={skaterTeam?.CoCaptain || false}
                                            jammer={skaterTeam?.Jammer || false}
                                            name={skaterTeam?.Name || ''}
                                            number={skaterTeam?.Number || ''}
                                            pivot={skaterTeam?.Pivot || false}
                                            teamId={team.RecordID || 0}
                                            teamName={team.Name || ''}
                                            onChangeName={this.onChangeTeamSkaterName}
                                            onChangeNumber={this.onChangeTeamSkaterNumber}
                                            onSelect={this.onSelectTeam}
                                            onSelectPosition={this.onSelectPosition}
                                            key={`team-${team.RecordID}`}
                                        />
                                    })
                                }
                            </tbody>
                        </table>
                    </td>
                </tr>
            </BaseRecordForm>
        </>
    }
}

const TeamItem:React.FunctionComponent<TeamProps> = props => {
    const onChangeName = (value:string) => props.onChangeName(props.teamId, value);
    const onChangeNumber = (value:string) => props.onChangeNumber(props.teamId, value);
    const onCheckTeam = () => props.onSelect(props.teamId);
    const onCheckCaptain = () => props.onSelectPosition(props.teamId, 'Captain');
    const onCheckCoach = () => props.onSelectPosition(props.teamId, 'Coach');
    const onCheckCoCaptain = () => props.onSelectPosition(props.teamId, 'CoCaptain');
    const onCheckJammer = () => props.onSelectPosition(props.teamId, 'Jammer');
    const onCheckBlocker = () => props.onSelectPosition(props.teamId, 'Blocker');
    const onCheckPivot = () => props.onSelectPosition(props.teamId, 'Pivot');
    return <>
        <tr>
            <td>
                <label className='form-control'>
                    <input type='checkbox' checked={props.active} onChange={onCheckTeam}/>
                    {props.teamName}
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.captain} onChange={onCheckCaptain}/>
                    Captain
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.cocaptain} onChange={onCheckCoCaptain}/>
                    Co-Captain
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.jammer} onChange={onCheckJammer}/>
                    Jammer
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.blocker} onChange={onCheckBlocker}/>
                    Blocker
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.pivot} onChange={onCheckPivot}/>
                    Pivot
                </label>
            </td>
            <td>
                <label className='form-control'>
                    <input type='checkbox' disabled={!props.active} checked={props.coach} onChange={onCheckCoach}/>
                    Coach
                </label>
            </td>
        </tr>
        {
            (props.active) &&
            <>
                <tr>
                    <td></td>
                    <td colSpan={7}>
                        <div className='input-group'>
                            <span className='input-group-text'>Alt #/Name</span>
                            <TextInput className='form-control' value={props.number} onChangeValue={onChangeNumber} maxLength={10} size={10} style={{flex:'0 0 100px'}}/>
                            <TextInput className='form-control' value={props.name} onChangeValue={onChangeName}/>
                        </div>
                    </td>
                </tr>
            </>
        }
    </>
}

export {Main as SkaterForm};