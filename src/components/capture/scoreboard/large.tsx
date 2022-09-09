import classNames from 'classnames';
import React from 'react';
import { Capture } from 'tools/capture/functions';
import { Clocks } from 'tools/clocks/functions';
import { Scoreboard } from 'tools/scoreboard/functions';

interface Props extends React.HTMLProps<HTMLDivElement> {

}

/**
 * Display large jam counter.
 * @param props 
 * @returns 
 */
const LargeJamCounter:React.FunctionComponent<Props> = props => {
    const [num, setNumber] = React.useState(Scoreboard.GetState().JamNumber || 0);
    const [visible, setVisible] = React.useState(Capture.GetJamCounter().visible || false);

    React.useEffect(() => Scoreboard.Subscribe(() => {
        setNumber(Scoreboard.GetState().JamNumber || 0);
    }), []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetJamCounter().visible || false);
    }), []);

    return <div {...props} className={classNames('large-jam-counter', {active:visible})}><span>{num.toString().padStart(2,'0')}</span></div>
};

/**
 * Display large game clock.
 * @param props 
 * @returns 
 */
const LargeGameClock:React.FunctionComponent<Props> = props => {
    const [hour, setHour] = React.useState(Clocks.GetState().GameHour || 0);
    const [minute, setMinute] = React.useState(Clocks.GetState().GameMinute || 0);
    const [second, setSecond] = React.useState(Clocks.GetState().GameSecond || 0);
    const [visible, setVisible] = React.useState(Capture.GetGameClock().visible || false);
    let className = '';

    React.useEffect(() => Clocks.Subscribe(() => {
        const state = Clocks.GetState();
        setHour(state.GameHour || 0);
        setMinute(state.GameMinute || 0);
        setSecond(state.GameSecond || 0);
    }), []);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetGameClock().visible || false);
    }), []);

    let time = minute.toString().padStart(2,'0') + ':' + second.toString().padStart(2,'0');
    if(hour) {
        time = hour.toString().padStart(2,'0') + ':' + time;
        className = 'houred';
    }

    return <div {...props} className={classNames('large-game-clock', className, {active:visible})}><span>{time}</span></div>
};

/**
 * Large jam clock to display.
 * @param props 
 * @returns 
 */
const LargeJamClock:React.FunctionComponent<Props> = props => {
    const [className, setClassName] = React.useState(Capture.GetJamClock().className || '');
    const [minute, setMinute] = React.useState(Clocks.GetState().JamMinute || 0);
    const [second, setSeconds] = React.useState(Clocks.GetState().JamSecond || 0);
    const [visible, setVisible] = React.useState(Capture.GetJamClock().visible || false);

    React.useEffect(() => Capture.Subscribe(() => {
        setVisible(Capture.GetJamClock().visible || false);
        setClassName(Capture.GetJamClock().className || '');
    }), []);

    React.useEffect(() => Clocks.Subscribe(() => {
        const state = Clocks.GetState();
        setMinute(state.JamMinute || 0);
        setSeconds(state.JamSecond || 0);
    }), []);

    let time = second.toString().padStart(2,'0');
    if(className === 'minute') {
        time = minute.toString().padStart(2,'0') + ':' + time;
    }

    return <div {...props} className={classNames('large-jam-clock', className, {active:visible})}><span>{time}</span></div>;
};

export {
    LargeGameClock,
    LargeJamClock,
    LargeJamCounter    
};