import classNames from 'classnames';
import React from 'react';
import { Scoreboard } from 'tools/scoreboard/functions';
import { ClockStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display break clock.
 * @param props 
 * @returns 
 */
const ScoreboardBreakClock:React.FunctionComponent<Props> = props => {
    const [seconds, setSeconds] = React.useState(Scoreboard.GetState().BreakClock?.Seconds || 0);
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState();
            const value = state?.BreakClock?.Seconds || 0;
            setSeconds(value);
            if(state.BreakClock?.Status === ClockStatus.RUNNING)
                setActive(true);
            else if(value === 0 && state.JamClock?.Status === ClockStatus.STOPPED && state.GameClock?.Status === ClockStatus.STOPPED)
                setActive(true);
            else
                setActive(false);
        });
    }, []);

    return <div {...props} className={classNames('break-clock', props.className, {active:active})}>
        <span className='value'>{seconds.toString().padStart(2,'0')}</span>
    </div>;
}

export {ScoreboardBreakClock};