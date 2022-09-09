import { Clock } from "classes/Clock";
import { MainController } from "tools/MainController";
import { ClockStatus } from "tools/vars";

const GameClock = new Clock();
const state = MainController.GetClockState();
GameClock.Hour = state?.GameHour || 0;
GameClock.Minute = state?.GameMinute || 0;
GameClock.Second = state?.GameSecond || 0;
GameClock.Tenths = 0;
// let lastSecond = GameClock.Second;
// let lastHour = GameClock.Hour;
// let lastMinute = GameClock.Minute;
// let lastStatus = GameClock.Status;
GameClock.OnTick.push(async (hour, minute, second, tenths, status) => {
    // if(second !== lastSecond || lastHour !== hour || lastMinute !== minute || lastStatus !== status) {
        // lastHour = hour;
        // lastSecond = second;
        // lastMinute = minute;
        // lastStatus = status;
        MainController.UpdateClockState({
            GameHour:hour,
            GameMinute:minute,
            GameSecond:second,
            GameStatus:status
        });
    // }
});

GameClock.OnStop.push(async () => {
    MainController.UpdateClockState({
        GameStatus:ClockStatus.STOPPED
    });
});

export {GameClock};