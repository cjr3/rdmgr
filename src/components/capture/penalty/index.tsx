import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { PenaltyTracker } from 'tools/penaltytracker/functions';
import { Skaters } from 'tools/skaters/functions';
import { SkaterPenalty } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    
}

/**
 * Display penalties.
 * @param props 
 * @returns 
 */
const PenaltyTrackerCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetPenaltyTracker().visible || false);
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetPenaltyTracker().visible || false);
        });
    }, []);

    React.useEffect(() => {
        return PenaltyTracker.Subscribe(() => {
            setCount(PenaltyTracker.Get().Skaters.length);
        });
    }, []);

    return <div {...props} className={classNames('capture-penalty', props.className, {active:(visible && count > 0)})}>
        <div className='title'>Penalties</div>
        <SkaterList/>
    </div>
}

/**
 * Display list of skaters in the penalty box.
 * @param props 
 * @returns 
 */
const SkaterList:React.FunctionComponent<{}> = props => {
    const [records, setRecords] = React.useState<SkaterPenalty[]>(PenaltyTracker.Get().Skaters);

    React.useEffect(() => {
        return PenaltyTracker.Subscribe(() => {
            const skaters = PenaltyTracker.Get().Skaters;
            if(skaters !== records) {
                setRecords(skaters);
            }
        });
    }, []);

    return <div className='skaters'>
        {
            records.map((record, index) => {
                const skater = Skaters.Get(record.RecordID);
                if(record.Penalties && record.Penalties.length) {
                    const codes = (record.Codes || []).join(', ');
                    const num = skater?.Number || record?.Number || '';
                    return <div className='skater' key={`skater-${record.RecordID}-${index}`}>
                        <div className='num'>#{num}</div>
                        <div className='codes'>{codes}</div>
                    </div>
                }

                return null;
            })
        }
    </div>
}

export {PenaltyTrackerCapture};