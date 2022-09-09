import classNames from 'classnames';
import React from 'react';
import { Clocks } from 'tools/clocks/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display the game clock.
 * @param props 
 * @returns 
 */
const GameClock:React.FunctionComponent<Props> = props => {
    const [hour, setHour] = React.useState(Clocks.GetState().GameHour || 0);
    const [minute, setMinute] = React.useState(Clocks.GetState().GameMinute || 0);
    const [second, setSecond] = React.useState(Clocks.GetState()?.GameSecond || 0);

    React.useEffect(() => {
        return Clocks.Subscribe(() => {
            const state = Clocks.GetState();
            // console.log('game clock updated')
            setHour(state?.GameHour || 0);
            setMinute(state?.GameMinute || 0);
            setSecond(state?.GameSecond || 0);
        })
    }, []);

    let time = minute.toString().padStart(2,'0') + ':' + second.toString().padStart(2,'0');
    if(hour > 0)
        time = hour.toString().padStart(2,'0') + ':' + time;
    return <div {...props} className={classNames('game-clock', props.className)}>{time}</div>
}

export {GameClock};