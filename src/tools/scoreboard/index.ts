import { SScoreboard, SMainController, ScoreboardTeam, ClockState } from "tools/vars";

// /**
//  * 
//  * @param state 
//  * @param values
//  * @returns 
//  */
// export const UpdateBreakClock = (state:SMainController, values:ClockState) : SMainController => {
//     return UpdateState(state, {BreakClock:{...state.Scoreboard.BreakClock, ...values}});
// };

// /**
//  * 
//  * @param state 
//  * @param values
//  * @returns 
//  */
// export const UpdateGameClock = (state:SMainController, values:ClockState) : SMainController => {
//     return UpdateState(state, {GameClock:{...state.Scoreboard.GameClock, ...values}});
// }

// /**
//  * 
//  * @param state 
//  * @param values
//  * @returns 
//  */
// export const UpdateJamClock = (state:SMainController, values:ClockState) : SMainController => {
//     return UpdateState(state, {JamClock:{...state.Scoreboard.JamClock, ...values}});
// };

/**
 * 
 * @param state 
 * @param values 
 * @returns 
 */
export const UpdateState = (state:SScoreboard, values:SScoreboard) : SScoreboard => {
    return {...state, ...values, UpdateTime:Date.now()};
};

/**
 * 
 * @param state 
 * @param side 
 * @param values 
 * @returns 
 */
export const UpdateTeam = (state:SScoreboard, side:'A'|'B', values:ScoreboardTeam) : SScoreboard => {
    if(side === 'A') {
        return UpdateState(state, {TeamA:{...state.TeamA, ...values}});
    } else  if(side === 'B') {
        return UpdateState(state, {TeamB:{...state.TeamB, ...values}});
    }
    return state;
};