import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Jam clock for scorebanner
 * @param props 
 * @returns 
 */
const JamClock:React.FunctionComponent<Props> = props => {
    const [time, setTime] = React.useState('00');
    const [visible, setVisible] = React.useState(Capture.GetJamClock().visible || false);

    React.useEffect(() => {
        return Scoreboard.Subscribe(() => {
            const state = Scoreboard.GetState();
            const minute = state.JamClock?.Minutes || 0;
            const second = state.JamClock?.Seconds || 0;
            if(minute) {
                setTime(`${minute}:${second.toString().padStart(2,'0')}`);
            } else {
                setTime(second.toString().padStart(2,'0'));
            }
        });
    }, []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetJamClock().visible || false);
    }), []);

    return <div {...props} className={classNames('jam-clock', props.className, {active:visible})}>{time}</div>
}

export {JamClock};