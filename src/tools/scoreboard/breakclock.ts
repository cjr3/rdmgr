import {Clock} from 'classes/Clock';
import { MainController } from 'tools/MainController';
import { ClockStatus } from 'tools/vars';
import { GameClock } from './gameclock';
import { JamClock } from './jamclock';

const BreakClock = new Clock();
BreakClock.MaxSeconds = 30;
BreakClock.reset();
// let lastHour = BreakClock.Hour;
// let lastMinute = BreakClock.Minute;
// let lastSecond = BreakClock.Second;
// let lastStatus = BreakClock.Status;
BreakClock.OnTick.push((hour, minute, second, tenths, status) => {
    // if(lastSecond !== second || lastHour !== hour || lastMinute !== minute || lastStatus !== status) {
    //     lastHour = hour;
    //     lastMinute = minute;
    //     lastSecond = second;
    //     lastStatus = status;
        MainController.UpdateClockState({
            BreakHour:hour,
            BreakMinute:minute,
            BreakSecond:second,
            BreakStatus:status
        });
    // }

    //stop game clock if time runs out on the break clock
    //and the jam clock isn't running.
    if(hour <= 0 && minute <= 0 && second <= 0 && tenths <= 0) {
        if(JamClock.Status !== ClockStatus.RUNNING) {
            GameClock.stop();
        }
    }
});

BreakClock.OnStop.push(() => {
    MainController.UpdateClockState({
        BreakStatus:ClockStatus.STOPPED
    });
});

export {BreakClock};