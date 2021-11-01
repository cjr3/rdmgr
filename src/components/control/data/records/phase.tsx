import { NumberInput } from 'components/common/inputs/numberinput';
import React from 'react';
import { Phases } from 'tools/phases/functions';
import { Phase } from 'tools/vars';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    hour:number;
    minute:number;
    second:number;
    quarter:number;
}

/**
 * Form for adding/editing a phase record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        hour:0,
        minute:0,
        second:0,
        quarter:0
    }
    
    protected load = () => {
        const record = Phases.Get(this.props.recordId);
        if(record) {
            this.setState({
                hour:record.Hours || 0,
                minute:record.Minutes || 0,
                second:record?.Seconds || 0,
                quarter:record?.Quarter || 0
            })
        }
    }

    protected onChangeHour = (value:number) => this.setState({hour:value});
    protected onChangeMinute = (value:number) => this.setState({minute:value});
    protected onChangeSecond = (value:number) => this.setState({second:value});
    protected onChangeQuarter = (value:number) => this.setState({quarter:value});

    protected onBeforeSubmit = (values:Phase) : Phase => {
        return {
            ...values,
            Hours:this.state.hour,
            Minutes:this.state.minute,
            Seconds:this.state.second,
            Quarter:this.state.quarter
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
        return <BaseRecordForm
            recordId={this.props.recordId}
            recordType='PHS'
            showMedia={false}
            showURL={false}
            showNumber={false}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>Time</td>
                <td>
                    <NumberInput value={this.state.hour} onChangeValue={this.onChangeHour} min={0} max={23}/> :
                    <NumberInput value={this.state.minute} onChangeValue={this.onChangeMinute} min={0} max={59}/> :
                    <NumberInput value={this.state.second} onChangeValue={this.onChangeSecond} min={0} max={59}/>
                </td>
            </tr>
            <tr>
                <td>Quarter</td>
                <td>
                    <NumberInput value={this.state.quarter} onChangeValue={this.onChangeQuarter} min={0} max={4}/>
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {Main as PhaseForm};