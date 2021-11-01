import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display the game clock.
 * @param props 
 * @returns 
 */
const GameClock:React.FunctionComponent<Props> = props => {
    const [hour, setHour] = React.useState(Scoreboard.GetState()?.GameClock?.Hours || 0);
    const [minute, setMinute] = React.useState(Scoreboard.GetState()?.GameClock?.Minutes || 0);
    const [second, setSecond] = React.useState(Scoreboard.GetState()?.GameClock?.Seconds || 0);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState().GameClock;
            // console.log('game clock updated')
            setHour(state?.Hours || 0);
            setMinute(state?.Minutes || 0);
            setSecond(state?.Seconds || 0);
        })
    }, []);

    let time = minute.toString().padStart(2,'0') + ':' + second.toString().padStart(2,'0');
    if(hour > 0)
        time = hour.toString().padStart(2,'0') + ':' + time;
    return <div {...props} className={classNames('game-clock', props.className)}>{time}</div>
}

export {GameClock};