import classNames from 'classnames';
import React from 'react';
import { Unsubscribe } from 'redux';
import { compareStrings } from 'tools/functions';
import { Penalties } from 'tools/penalties/functions';
import { PenaltyTracker } from 'tools/penaltytracker/functions';

interface Props {
    skaterId:number;
}

interface State {
    updateTime:number;
}

/**
 * Displays penalty selection for the penalty tracker.
 */
class Main extends React.PureComponent<Props, State> {
    readonly state:State = {
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            updateTime:PenaltyTracker.GetUpdateTime()
        });
    }

    componentDidMount() {
        this.remote = PenaltyTracker.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const skater = PenaltyTracker.Get().Skaters.find(r => r.RecordID === this.props.skaterId);
        const penalties = Penalties.GetRecords();
        penalties.sort((a, b) => compareStrings(a.Name, b.Name, 'ASC'));
        return <div className='penalty-list'>
            {
                penalties.map(record => {
                    const id = record.RecordID || 0;
                    const active = (skater && skater.Penalties && skater.Penalties.indexOf(id) >= 0);
                    return <div 
                        className={'penalty'}
                        onClick={ev => {
                            ev.stopPropagation();
                            PenaltyTracker.ToggleSkaterPenalty(this.props.skaterId, id);
                        }}
                        title={record.Name || ''}
                        key={`penalty-${record.RecordID}`}
                        >
                        <button className={classNames('code', {active:active})}>{record.Code || record.Number}</button>
                        <span className='name'>{record.Name}</span>
                    </div>
                })
            }
        </div>;
    }
}

export {Main as PenaltyTrackerPenaltyList};