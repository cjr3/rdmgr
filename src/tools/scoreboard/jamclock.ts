import { MainController } from 'tools/MainController';
import { ClockStatus } from 'tools/vars';
import {Clock} from '../../classes/Clock';

const JamClock = new Clock();
JamClock.MaxSeconds = 60;
JamClock.ResetOnStop = true;
JamClock.reset();
// let lastHour = JamClock.Hour;
// let lastMinute = JamClock.Minute;
// let lastSecond = JamClock.Second;
// let lastStatus = JamClock.Status;
JamClock.OnTick.push((hour, minute, second, tenths, status) => {
    // if(lastSecond !== second || lastHour !== hour || lastMinute !== minute || lastStatus !== status) {
    //     lastHour = hour;
    //     lastMinute = minute;
    //     lastSecond = second;
    //     lastStatus = status;
        MainController.UpdateScoreboardJamClock({
            Hours:hour,
            Minutes:minute,
            Seconds:second,
            Status:status,
            Tenths:0
        });
    // }
});

JamClock.OnStop.push(() => {
    MainController.UpdateScoreboardJamClock({
        Status:ClockStatus.STOPPED,
        Hours:0,
        Minutes:0,
        Seconds:JamClock.MaxSeconds,
        Tenths:0
    });
});

export {JamClock};