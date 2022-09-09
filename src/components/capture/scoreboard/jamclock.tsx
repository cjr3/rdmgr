import classNames from 'classnames';
import React from 'react';
import { Clocks } from 'tools/clocks/functions';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display jam clock.
 * @param props 
 * @returns 
 */
const JamClock:React.FunctionComponent<Props> = props => {
    const [jamSeconds, setSeconds] = React.useState(Clocks.GetState().JamSecond || 0);
    const [jamMinutes, setMinutes] = React.useState(Clocks.GetState()?.JamMinute || 0);
    const [jamNumber, setJamNumber] = React.useState(Scoreboard.GetState()?.JamNumber || 0);
    const [confirm, setConfirm] = React.useState(Scoreboard.GetState().ConfirmStatus || false);
    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState();
            setJamNumber(state?.JamNumber || 0);
            setConfirm(state.ConfirmStatus || false);
        });
    }, []);

    React.useEffect(() => Clocks.Subscribe(() => {
        const state = Clocks.GetState();
        setSeconds(state.JamSecond || 0);
        setMinutes(state.JamMinute || 0);
    }), []);

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