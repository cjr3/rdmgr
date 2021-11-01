import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';
import { Match } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {
    
}

/**
 * Display the schedule.
 * @param props 
 * @returns 
 */
const ScheduleCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisible] = React.useState(Capture.GetSchedule().visible || false);
    const [records, setRecords] = React.useState(Capture.GetSchedule().bouts || []);

    React.useEffect(() => {
        return Capture.Subscribe(() => {
            setVisible(Capture.GetSchedule().visible || false);
            setRecords(Capture.GetSchedule().bouts || []);
        })
    }, []);

    // console.log(records);

    return <div {...props} className={classNames('capture-schedule', props.className, {active:visible && records.length > 0})}>
        <div className='title'>Schedule</div>
        <div className='bouts'>
        {
            records.map((bout, index) => {
                if(index <= 9) {
                    return <BoutItem
                        date={bout.DateStart || bout.DateEnd || ''}
                        matches={bout.Matches || []}
                        key={`bout-${bout.DateStart}-${bout.DateEnd}-${index}`}
                    />
                }
                return null;
            })
        }
        </div>
    </div>
}

/**
 * Display a bout item
 * @param props 
 * @returns 
 */
const BoutItem:React.FunctionComponent<{
    date:string;
    matches:Match[];
}> = props => {
    if(props.date) {
        return <div className='bout-item'>
            <div className='date'>{props.date.substring(0, 5)}</div>
            {
                (props.matches && props.matches.length > 0) &&
                <div className='matches'>
                    {
                        props.matches.map((match, index) => {
                            if(index <= 1) {
                                return <MatchItem
                                    teamAColor={match.TeamA.Color || ''}
                                    teamALogo={match.TeamA.Logo || ''}
                                    teamAName={match.TeamA.Name || ''}
                                    teamBColor={match.TeamB.Color || ''}
                                    teamBLogo={match.TeamB.Logo || ''}
                                    teamBName={match.TeamB.Name || ''}
                                    key={`match-${index}`}
                                />
                            }
                            return null;
                        })
                    }
                </div>
            }
        </div>
    }

    return null;
}

const MatchItem:React.FunctionComponent<{
    teamAName:string;
    teamAColor:string;
    teamALogo:string;
    teamBName:string;
    teamBColor:string;
    teamBLogo:string;
}> = props => {
    return <div className='match-item'>
        <div className='team team-a'>
            {
                (props.teamALogo && props.teamALogo.length > 0) &&
                <div className='logo'>
                    <img src={Data.GetMediaPath(props.teamALogo)} alt=''/>
                </div>
            }
        </div>
        <div className='vs'>VS</div>
        <div className='team team-b'>
            {
                (props.teamBLogo && props.teamBLogo.length > 0) &&
                <div className='logo'>
                    <img src={Data.GetMediaPath(props.teamBLogo)} alt=''/>
                </div>
            }
        </div>
    </div>
};

export {ScheduleCapture};