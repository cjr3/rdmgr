import classNames from 'classnames';
import { IconX } from 'components/common/icons';
import React from 'react';
import { Unsubscribe } from 'redux';
import { MainController } from 'tools/MainController';
import { Penalties } from 'tools/penalties/functions';
import { PenaltyTracker } from 'tools/penaltytracker/functions';
import { Skaters } from 'tools/skaters/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {
    skaterId:number;
    onSelectSkater:{(id:number):void};
}

interface State {
    updateTime:number;
}

interface SkaterProps {
    active:boolean;
    codes:string;
    recordId:number;
    name:string;
    num:string;
    onSelect:{(id:number):void}
}

class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        const state = MainController.GetState();
        this.setState({
            updateTime:Math.max(state.UpdateTimePenaltyTracker, state.UpdateTimePenalties, state.UpdateTimeSkaters, state.UpdateTimeRoster)
        });
    }

    componentDidMount() {
        this.remote = MainController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const records = PenaltyTracker.Get().Skaters;
        const skaters = Skaters.GetRecords();
        const penalties = Penalties.GetRecords();
        
        return <div className='bench'>
            {
                records.map(record => {
                    const skater = skaters.find(s => s.RecordID === record.RecordID);
                    const codes = penalties.filter(p => p.RecordID && record.Penalties && record.Penalties.indexOf(p.RecordID) >= 0).map(p => p.Code || '').join(', ');
                    if(skater) {
                        return <SkaterItem
                            active={this.props.skaterId === record.RecordID ? true : false}
                            codes={codes}
                            recordId={record.RecordID || 0}
                            name={skater.Name || ''}
                            num={skater.Number || ''}
                            onSelect={this.props.onSelectSkater}
                            key={`skater-${record.RecordID}`}
                        />
                    }

                    return null;
                })
            }
        </div>
    }
}

const SkaterItem:React.FunctionComponent<SkaterProps> = props => {
    return <div 
        className={classNames('skater', {active:props.active})}
        onClick={ev => {
            ev.stopPropagation();
            props.onSelect(props.recordId)
        }}
        title={props.name}
        >
        <IconX
            onClick={ev => {
                ev.stopPropagation();
                if(props.active)
                    props.onSelect(0);
                MainController.TogglePenaltySkater(props.recordId);
            }}
        />
        <span className='name'>{props.num}</span>
        <span className='codes'>{props.codes}</span>
    </div>
};

export {Main as PenaltyTrackerBench};