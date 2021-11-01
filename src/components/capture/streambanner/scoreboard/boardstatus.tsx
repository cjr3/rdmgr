import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ScoreboardStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display scoreboard status
 * @param props 
 * @returns 
 */
const BoardStatus:React.FunctionComponent<Props> = props => {
    const [label, setLabel] = React.useState('');
    const [active, setActive] = React.useState(false);
    const [color, setColor] = React.useState('');

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const status = Scoreboard.GetState().BoardStatus;
            setActive(status !== ScoreboardStatus.NORMAL);
            if(status !== ScoreboardStatus.NORMAL) {
                setLabel(Scoreboard.GetStatusLabel());
                setColor(Scoreboard.GetStatusBackground());
            }
        });
    }, []);

    return <div {...props} 
        style={{
            backgroundColor:color,
            ...props.style
        }}
        className={classNames('board-status', props.className, {active:active})}
        >
        {label}
    </div>
};

export {BoardStatus};