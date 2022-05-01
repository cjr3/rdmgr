import React from 'react';
import { Penalties } from 'tools/penalties/functions';
import { Penalty } from 'tools/vars';
import { BaseRecordForm } from './base';

interface Props {
    recordId:number;
    onSave:{():void};
}

interface State {
    penaltyType:'P'|'X'
}

/**
 * Form for adding/editing a penalty record.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        penaltyType:'P'
    }
    
    protected load = () => {
        const record = Penalties.Get(this.props.recordId);
        if(record) {
            this.setState({
                penaltyType:record.PenaltyType || 'P'
            })
        }
    }

    protected onSelectPenaltyTypeDefault = () => this.setState({penaltyType:'P'});
    protected onSelectPenaltyTypeExpulsion = () => this.setState({penaltyType:'X'});

    protected onBeforeSubmit = (values:Penalty) : Penalty => {
        return {
            ...values,
            PenaltyType:this.state.penaltyType
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
            recordType='PEN'
            showMedia={false}
            showURL={false}
            showNumber={false}
            onBeforeSubmit={this.onBeforeSubmit}
            onCancel={this.props.onSave}
            onSave={this.props.onSave}
        >
            <tr>
                <td>Type</td>
                <td>
                    <label className='form-control'>
                        <input type='checkbox' checked={this.state.penaltyType === 'P'} onChange={this.onSelectPenaltyTypeDefault}/>
                        Basic
                    </label>
                    <label className='form-control' onClick={this.onSelectPenaltyTypeExpulsion}>
                        <input type='checkbox' checked={this.state.penaltyType === 'X'} onChange={this.onSelectPenaltyTypeExpulsion}/>
                        Expulsion
                    </label>
                </td>
            </tr>
        </BaseRecordForm>
    }
}

export {Main as PenaltyForm};