import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display jam clock.
 * @param props 
 * @returns 
 */
const JamClock:React.FunctionComponent<Props> = props => {
    const [jamSeconds, setSeconds] = React.useState(Scoreboard.GetState()?.JamClock?.Seconds || 0);
    const [jamMinutes, setMinutes] = React.useState(Scoreboard.GetState()?.JamClock?.Minutes || 0);
    const [jamNumber, setJamNumber] = React.useState(Scoreboard.GetState()?.JamNumber || 0);
    const [confirm, setConfirm] = React.useState(Scoreboard.GetState().ConfirmStatus || false);
    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState();
            setSeconds(state?.JamClock?.Seconds || 0);
            setMinutes(state?.JamClock?.Minutes || 0);
            setJamNumber(state?.JamNumber || 0);
            setConfirm(Scoreboard.GetState().ConfirmStatus || false);
        });
    }, []);

    let time = jamSeconds.toString().padStart(2,'0')
    if(jamMinutes > 0)
        time = jamMinutes.toString() + ':' + time;

    return <div {...props} className={classNames('jam-values', props.className)}>
        <div className='jam-clock'>
            <span className='value'>{time}</span>
        </div>
        <div className='jam-counter'>JAM {jamNumber.toString().padStart(2,'0')}</div>
        <div className={classNames('confirm', {active:confirm})}></div>
    </div>
}

export {JamClock};