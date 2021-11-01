import React from 'react';
import { Unsubscribe } from 'redux';
import { compareStrings } from 'tools/functions';
import { Roster } from 'tools/roster/functions';
import { Skaters } from 'tools/skaters/functions';
import { TeamSide } from 'tools/vars';

interface Props {
    side:TeamSide;
}

interface State {
    role:string;
    updateTime:number;
}

interface Role {
    value:string;
    label:string;
}

const roles:Role[] = [
    {value:'bench', label:'Bench Coach'},
    {value:'coach', label:'Coach'},
    {value:'captain', label:'Captain'},
    {value:'cocaptain', label:'CoCaptain'},
    {value:'manager', label:'Manager'},
    {value:'penalties', label:'Penalties'},
];

/**
 * Displays a selection of roles and skaters to assign to them.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        role:'bench',
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            updateTime:Roster.GetUpdateTime(),
        })
    }

    /**
     * Set the current role
     * @param ev 
     */
    protected onSelectRole = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        let value = ev.currentTarget.value;
        this.setState({role:value});
    }

    /**
     * Set the skater who occup
     * @param ev 
     */
    protected onSelectSkater = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        let value = parseInt(ev.currentTarget.value);
        Roster.SetRole(this.props.side, this.state.role, value);
    }

    componentDidMount() {
        this.remote = Roster.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const records = (((this.props.side === 'A') ? Roster.Get().SkatersA : Roster.Get().SkatersB) || []).slice();
        const skaters = Skaters.GetRecords();
        records.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));
        const skaterId = (Roster.GetRoleSkater(this.props.side, this.state.role))?.RecordID || 0
        return <div className='roles'>
            <select size={1} onChange={this.onSelectRole}>
                {
                    roles.map(role => {
                        return <option value={role.value} key={`role-${role.value}`}>{role.label}</option>
                    })
                }
            </select>
            <select size={1} onChange={this.onSelectSkater} value={skaterId}>
                <option value={0}>(Not Assigned)</option>
                {
                    records.map(record => {
                        const skater = skaters.find(s => s.RecordID === record.RecordID);
                        const name = (skater && skater.Name) ? skater.Name : record.Name;
                        return <option value={record.RecordID} key={`skater-${record.RecordID}`}>{name}</option>
                    })
                }
            </select>
        </div>
    }
}

export {Main as TeamRoles};