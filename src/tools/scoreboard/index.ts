import { SScoreboard, SMainController, ScoreboardTeam, ClockState } from "tools/vars";

/**
 * 
 * @param state 
 * @param values
 * @returns 
 */
export const UpdateBreakClock = (state:SMainController, values:ClockState) : SMainController => {
    return UpdateState(state, {BreakClock:{...state.Scoreboard.BreakClock, ...values}});
};

/**
 * 
 * @param state 
 * @param values
 * @returns 
 */
export const UpdateGameClock = (state:SMainController, values:ClockState) : SMainController => {
    return UpdateState(state, {GameClock:{...state.Scoreboard.GameClock, ...values}});
}

/**
 * 
 * @param state 
 * @param values
 * @returns 
 */
export const UpdateJamClock = (state:SMainController, values:ClockState) : SMainController => {
    return UpdateState(state, {JamClock:{...state.Scoreboard.JamClock, ...values}});
};

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
export const UpdateState = (state:SMainController, values:SScoreboard) : SMainController => {
    return {...state, Scoreboard:{...state.Scoreboard, ...values}, UpdateTimeScoreboard:Date.now()};
};

/**
 * 
 * @param state 
 * @param side 
 * @param values 
 * @returns 
 */
export const UpdateTeam = (state:SMainController, side:'A'|'B', values:ScoreboardTeam) : SMainController => {
    if(side === 'A') {
        return UpdateState(state, {TeamA:{...state.Scoreboard.TeamA, ...values}});
    } else  if(side === 'B') {
        return UpdateState(state, {TeamB:{...state.Scoreboard.TeamB, ...values}});
    }
    return state;
};