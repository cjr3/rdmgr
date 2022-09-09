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
        MainController.UpdateClockState({
            JamHour:hour,
            JamMinute:minute,
            JamSecond:second,
            JamStatus:status
        });
    // }
});

JamClock.OnStop.push(() => {
    MainController.UpdateClockState({
        JamStatus:ClockStatus.STOPPED,
        JamHour:0,
        JamMinute:0,
        JamSecond:JamClock.MaxSeconds
    });
});

export {JamClock};