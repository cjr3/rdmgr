import React from 'react';
import { JamClock } from 'tools/scoreboard/jamclock';
import { GameClock } from 'tools/scoreboard/gameclock';
import { ClockView } from 'components/common/clock';

const JamClockView:React.FunctionComponent<any> = props => {
    const [seconds, setSeconds] = React.useState(JamClock.Second);
    JamClock.OnTick.push((h, m, s) => setSeconds(s));
    return <ClockView clockType='stopwatch' Seconds={seconds} showTenths={false} className='jam-clock'/>
};

const GameClockView:React.FunctionComponent<any> = props => {
    const [hours, setHours] = React.useState(GameClock.Hour);
    const [minutes, setMinutes] = React.useState(GameClock.Minute);
    const [seconds, setSeconds] = React.useState(GameClock.Second);
    GameClock.OnTick.push((h, m, s) => {
        setHours(h);
        setMinutes(m);
        setSeconds(s);
    });
    return <ClockView clockType='clock'
        showTenths={false}
        Hours={hours}
        Minutes={minutes}
        Seconds={seconds}
        className='game-clock'
    />
}

export {JamClockView, GameClockView};