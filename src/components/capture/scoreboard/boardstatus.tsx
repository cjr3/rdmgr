import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display scoreboard status.
 * @param props 
 * @returns 
 */
const ScoreboardBoardStatus:React.FunctionComponent<Props> = props => {
    const [status, setStatus] = React.useState(Scoreboard.GetState().BoardStatus || ScoreboardStatus.NORMAL);
    const [color, setColor] = React.useState(Scoreboard.GetStatusBackground());
    const [label, setLabel] = React.useState(Scoreboard.GetStatusLabel());

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState();
            setStatus(state.BoardStatus || ScoreboardStatus.NORMAL);
            if(state.BoardStatus !== ScoreboardStatus.NORMAL) {
                setColor(Scoreboard.GetStatusBackground());
                setLabel(Scoreboard.GetStatusLabel());
            }
        });
    }, []);

    return <div 
        {...props}
        className={classNames('board-status', props.className, {active:status !== ScoreboardStatus.NORMAL})}
        >
        <span className='value' style={{backgroundColor:color}}>
            {label}
        </span>
    </div>
}

export {ScoreboardBoardStatus};