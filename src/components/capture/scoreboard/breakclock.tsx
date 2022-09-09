import classNames from 'classnames';
import React from 'react';
import { Clocks } from 'tools/clocks/functions';
import { ClockStatus } from 'tools/vars';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display break clock.
 * @param props 
 * @returns 
 */
const ScoreboardBreakClock:React.FunctionComponent<Props> = props => {
    const [seconds, setSeconds] = React.useState(Clocks.GetState().BreakSecond || 0);
    const [active, setActive] = React.useState(false);

    React.useEffect(() => {
        return Clocks.Subscribe(() => {
            const state = Clocks.GetState();
            const value = state?.BreakSecond || 0;
            setSeconds(value);
            if(state?.BreakStatus === ClockStatus.RUNNING)
                setActive(true);
            else if(value === 0 && state.JamStatus === ClockStatus.STOPPED && state.GameStatus === ClockStatus.STOPPED)
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