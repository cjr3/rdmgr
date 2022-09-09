import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Clocks } from 'tools/clocks/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { JamClock } from './jamclock';
import { JamNumber } from './jamnumber';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display the game clock.
 * @param props 
 * @returns 
 */
const GameClock:React.FunctionComponent<Props> = props => {
    const [time, setTime] = React.useState('00:00');
    const [name, setName] = React.useState(Scoreboard.GetState().PhaseName || '');
    const [visible, setVisible] = React.useState(Capture.GetGameClock().visible || false);
    const [counterVisible, setCounterVisible] = React.useState(Capture.GetJamCounter().visible || false);

    React.useEffect(() => {
        return Clocks.Subscribe(() => {
            const state = Clocks.GetState();
            const hour = (state.GameHour || 0).toString().padStart(2,'0');
            const minute = (state.GameMinute || 0).toString().padStart(2,'0');
            const second = (state.GameSecond || 0).toString().padStart(2,'0');
            if(state.GameHour)
                setTime(`${hour}:${minute}:${second}`);
            else
                setTime(`${minute}:${second}`);
        })
    }, []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetGameClock().visible || false);
        setCounterVisible(Capture.GetJamCounter().visible || false);
    }), []);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        const state = Scoreboard.GetState();
        setName(state.PhaseName || '');
    }), []);

    return <div className='clock-phase'>
        <div className={classNames('phase', {
            counterclockhidden:(counterVisible === false && visible === false)
        })}>{name}</div>
        <JamNumber/>
        <div {...props} className={classNames('gameclock', props.className, {active:visible, counterhidden:!counterVisible})}>
            <span className='value'>{time}</span>
        </div>
        <JamClock/>
    </div>

};

export {GameClock};