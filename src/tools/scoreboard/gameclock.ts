import { Clock } from "classes/Clock";
import { MainController } from "tools/MainController";
import { ClockStatus } from "tools/vars";

const GameClock = new Clock();
const state = MainController.GetState().Scoreboard.GameClock;
GameClock.Hour = state?.Hours || 0;
GameClock.Minute = state?.Minutes || 0;
GameClock.Second = state?.Seconds || 0;
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
        MainController.UpdateScoreboardGameClock({
            Hours:hour,
            Minutes:minute,
            Seconds:second,
            Tenths:0,
            Status:status
        });
    // }
});

GameClock.OnStop.push(async () => {
    MainController.UpdateScoreboardGameClock({
        Status:ClockStatus.STOPPED
    });
});

export {GameClock};