import { NumberInput } from 'components/common/inputs/numberinput';
import { TextInput } from 'components/common/inputs/textinput';
import React from 'react';
import { Peers } from 'tools/peers/functions';
import { Peer } from 'tools/vars';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    host:string;
    port:number;
    receive:string[];
    send:string[];
}

interface AppRecord {
    name:string;
    code:string;
}

const apps:AppRecord[] = [
    {name:'Penalty Tracker', code:'PT'},
    {name:'Raffle', code:'RAF'},
    {name:'Roster', code:'ROS'},
    {name:'Scoreboard', code:'SB'},
    {name:'Scorekeeper', code:'SK'},
];

/**
 * Form for adding/editing an anthem singer or announcer record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        host:'',
        port:49152,
        receive:[],
        send:[]
    }

    protected load = () => {
        const record = Peers.Get(this.props.recordId);
        this.setState({
            host:record?.Host || '',
            port:record?.Port || 49152,
            receive:record?.ReceiveApplications || [],
            send:record?.SendApplications || []
        })
    }

    protected onChangeHost = (value:string) => this.setState({host:value});
    protected onChangePort = (value:number) => this.setState({port:value});
    protected onSelectReceive = (code:string) => {
        const records = this.state.receive.slice();
        const index = records.indexOf(code);
        if(index >= 0)
            records.splice(index, 1);
        else
            records.push(code);
        this.setState({receive:records});
    }

    protected onSelectSend = (code:string) => {
        const records = this.state.send.slice();
        const index = records.indexOf(code);
        if(index >= 0)
            records.splice(index, 1);
        else
            records.push(code);
        this.setState({send:records});
    }

    protected onBeforeSubmit = (values:Peer) : Peer => {
        let port = this.state.port;
        if(port <= 1024)
            port = 0;
        else if(port > 65535)
            port = 0;
        else if(port < 49152)
            port = 0;
        return {
            ...values,
            Host:this.state.host,
            Port:this.state.port,
            ReceiveApplications:this.state.receive,
            SendApplications:this.state.send
        }
    }

    render() {
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='PER'
            showURL={false}
            showNumber={false}
            showCode={false}
            showDescription={false}
            showMedia={false}
            showShortName={false}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>Host</td>
                <td>
                    <TextInput 
                        className='form-control'
                        value={this.state.host} 
                        onChangeValue={this.onChangeHost} 
                        maxLength={32}
                        placeholder='IP address or host name'
                        />
                </td>
            </tr>
            <tr>
                <td>Port</td>
                <td>
                    <NumberInput
                        className='form-control'
                        value={this.state.port}
                        onChangeValue={this.onChangePort}
                        min={0}
                        max={65535}
                        style={{width:'150px'}}
                        title='Enter a port between 49152 - 65535'
                    />
                </td>
            </tr>
            <tr>
                <td>Receive</td>
                <td>
                    {
                        apps.map(a => {
                            return <label className='form-control' key={`app-${a.code}`}>
                                <input 
                                    type='checkbox' 
                                    checked={this.state.receive.indexOf(a.code) >= 0}
                                    onChange={() => this.onSelectReceive(a.code)}
                                    />
                                {a.name}
                            </label>
                        })
                    }
                </td>
            </tr>
            <tr>
                <td>Send</td>
                <td>
                    {
                        apps.map(a => {
                            return <label className='form-control' key={`app-${a.code}`}>
                                <input 
                                    type='checkbox' 
                                    checked={this.state.send.indexOf(a.code) >= 0}
                                    onChange={() => this.onSelectSend(a.code)}
                                    />
                                {a.name}
                            </label>
                        })
                    }
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {Main as PeerForm};