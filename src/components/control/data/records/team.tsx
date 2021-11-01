import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { compareStrings } from 'tools/functions';
import { MainController } from 'tools/MainController';
import { Skaters } from 'tools/skaters/functions';
import { Teams } from 'tools/teams/functions';
import { SkaterPosition, SkaterTeam, Team } from 'tools/vars';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface SkaterProps {
    active:boolean;
    blocker:boolean;
    captain:boolean;
    coach:boolean;
    cocaptain:boolean;
    jammer:boolean;
    name:string;
    number:string;
    pivot:boolean;
    skaterId:number;
    skaterName:string;
    onChangeName:{(teamId:number, value:string):void};
    onChangeNumber:{(teamId:number, value:string):void};
    onSelect:{(id:number):void};
    onSelectPosition:{(id:number,position:SkaterPosition):void};
}

interface State {
    skaters:SkaterTeam[];
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        skaters:[]
    }

    /**
     * 
     */
    protected load = () => {
        const skaters = Teams.GetSkaters(this.props.recordId);
        if(skaters.length > 0) {
            const steams:SkaterTeam[] = [];
            skaters.forEach(t => {
                const team = (t.Teams || []).find(r => r.TeamID === this.props.recordId);
                if(team) {
                    steams.push({...team});
                }
            });
            this.setState({skaters:steams});
        } else {
            this.setState({
                skaters:[]
            });
        }
    }

    protected onBeforeSubmit = (values:Team) : Team => {
        //save skaters

        return values;
    }

    /**
     * Called when the user changes the skater's alternate name for a given team.
     * @param id 
     * @param value 
     */
    protected onChangeTeamSkaterName = (id:number, value:string) => {
        const records = this.state.skaters.slice();
        const index = records.findIndex(r => r.SkaterID === id);
        const record = {...records[index]};
        record.Name = value;
        records[index] = record;
        this.setState({skaters:records});
    }

    /**
     * Called when the user changes the skater's alternate number for a given team.
     * @param id 
     * @param value 
     */
    protected onChangeTeamSkaterNumber = (id:number, value:string) => {
        const records = this.state.skaters.slice();
        const index = records.findIndex(r => r.SkaterID === id);
        const record = {...records[index]};
        record.Number = value;
        records[index] = record;
        this.setState({skaters:records});
    }

    /**
     * Called when the user selects a skater.
     * @param id 
     */
    protected onSelectSkater = (id:number) => {
        const record = Skaters.Get(id);
        if(record) {
            const records = this.state.skaters.slice();
            const index = records.findIndex(r => r.SkaterID === id);
            if(index < 0) {
                records.push({
                    TeamID:this.props.recordId,
                })
            } else {
                records.splice(index, 1);
            }

            this.setState({skaters:records});
        }
    }

    /**
     * Called when the user selects a position of a selected team.
     * @param id 
     * @param position 
     */
    protected onSelectPosition = (id:number, position:SkaterPosition) => {
        const index = this.state.skaters.findIndex(r => r.SkaterID === id);
        if(index >= 0) {
            const records = this.state.skaters.slice();
            const record = {...records[index]};
            switch(position) {
                case 'Blocker' : record.Blocker = (record.Blocker) ? false : true; break;
                case 'Captain' : record.Captain = (record.Captain) ? false : true; break;
                case 'CoCaptain' : record.CoCaptain = (record.CoCaptain) ? false : true; break;
                case 'Coach' : record.Coach = (record.Coach) ? false : true; break;
                case 'Jammer' : record.Jammer = (record.Jammer) ? false : true; break;
                case 'Pivot' : record.Pivot = (record.Pivot) ? false : true; break;
            }
            records[index] = record;
            this.setState({skaters:records});
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
        const records = Object.values(MainController.GetState().Skaters);
        records.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));
        return <>
            <BaseRecordForm
                recordId={this.props.recordId}
                recordType='TEM'
                showURL={false}
                showNumber={false}
                onCancel={this.props.onSave}
                onSave={this.props.onSave}
                onBeforeSubmit={this.onBeforeSubmit}
            >
                <tr>
                    <td>Skaters</td>
                    <td>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td>Skater</td>
                                    <td colSpan={7}>Positions</td>
                                </tr>
                                {
                                    records.map(record => {
                                        const skaterTeam = this.state.skaters.find(r => r.SkaterID === record.RecordID);
                                        return <SkaterItem
                                            active={(skaterTeam !== undefined) ? true : false}
                                            blocker={skaterTeam?.Blocker || false}
                                            captain={skaterTeam?.Captain || false}
                                            coach={skaterTeam?.Coach || false}
                                            cocaptain={skaterTeam?.CoCaptain || false}
                                            jammer={skaterTeam?.Jammer || false}
                                            name={skaterTeam?.Name || ''}
                                            number={skaterTeam?.Number || ''}
                                            pivot={skaterTeam?.Pivot || false}
                                            skaterId={record.RecordID || 0}
                                            skaterName={record.Name || ''}
                                            onChangeName={this.onChangeTeamSkaterName}
                                            onChangeNumber={this.onChangeTeamSkaterNumber}
                                            onSelect={this.onSelectSkater}
                                            onSelectPosition={this.onSelectPosition}
                                            key={`skater-${record.RecordID}`}
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

const SkaterItem:React.FunctionComponent<SkaterProps> = props => {
    const onChangeName = (value:string) => props.onChangeName(props.skaterId, value);
    const onChangeNumber = (value:string) => props.onChangeNumber(props.skaterId, value);
    const onCheckTeam = () => props.onSelect(props.skaterId);
    const onCheckCaptain = () => props.onSelectPosition(props.skaterId, 'Captain');
    const onCheckCoach = () => props.onSelectPosition(props.skaterId, 'Coach');
    const onCheckCoCaptain = () => props.onSelectPosition(props.skaterId, 'CoCaptain');
    const onCheckJammer = () => props.onSelectPosition(props.skaterId, 'Jammer');
    const onCheckBlocker = () => props.onSelectPosition(props.skaterId, 'Blocker');
    const onCheckPivot = () => props.onSelectPosition(props.skaterId, 'Pivot');
    return <>
        <tr>
            <td>
                <label>
                    <input type='checkbox' checked={props.active} onChange={onCheckTeam}/>
                    {props.skaterName}
                </label>
            </td>
            <td>
                <label>
                    <input type='checkbox' disabled={!props.active} checked={props.captain} onChange={onCheckCaptain}/>
                    Captain
                </label>
            </td>
            <td>
                <label>
                    <input type='checkbox' disabled={!props.active} checked={props.cocaptain} onChange={onCheckCoCaptain}/>
                    Co-Captain
                </label>
            </td>
            <td>
                <label>
                    <input type='checkbox' disabled={!props.active} checked={props.jammer} onChange={onCheckJammer}/>
                    Jammer
                </label>
            </td>
            <td>
                <label>
                    <input type='checkbox' disabled={!props.active} checked={props.blocker} onChange={onCheckBlocker}/>
                    Blocker
                </label>
            </td>
            <td>
                <label>
                    <input type='checkbox' disabled={!props.active} checked={props.pivot} onChange={onCheckPivot}/>
                    Pivot
                </label>
            </td>
            <td>
                <label>
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
                    <td>Alt Name</td>
                    <td colSpan={6}>
                        #<TextInput value={props.number} onChangeValue={onChangeNumber} maxLength={10} size={10}/>
                        <TextInput value={props.name} onChangeValue={onChangeName}/>
                    </td>
                </tr>
            </>
        }
    </>
}

export {Main as TeamForm};