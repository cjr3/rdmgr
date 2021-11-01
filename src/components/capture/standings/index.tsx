import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import Data from 'tools/data';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * 
 * @param props 
 * @returns 
 */
const StandingsCapture:React.FunctionComponent<Props> = props => {
    const [visible, setVisibile] = React.useState(Capture.GetStandings().visible || false);
    const [records, setRecords] = React.useState(Capture.GetStandings().standings || []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisibile(Capture.GetStandings().visible || false);
        setRecords(Capture.GetStandings().standings || []);
    }), []);

    return <div {...props} className={classNames('capture-standings', {active:visible && records.length > 0})}>
        <div className='title'>Standings</div>
        <div className='teams'>
        {
            records.map((record, index) => {
                if(record.Position) {
                    return <TeamItem
                        logo={record.TeamLogo || ''}
                        losses={record.Losses || 0}
                        points={record.Points || 0}
                        position={record.Position || 0}
                        wins={record.Wins || 0}
                        key={`team-${record.TeamID}-${index}`}
                    />
                }

                return null;
            })
        }
        </div>
    </div>
};

const TeamItem:React.FunctionComponent<{
    logo:string;
    losses:number;
    points:number;
    position:number;
    wins:number;
}> = props => {

    return <div className='team'>
        <div className='logo'>
            {
                (props.logo && props.logo.length > 0) &&
                <img src={Data.GetMediaPath(props.logo)} alt=''/>
            }
        </div>
        <div className='position'>#{props.position}</div>
        <div className='wins'>{props.wins} / {props.losses}</div>
        <div className='points'>{props.points}</div>
    </div>
}

export {StandingsCapture};