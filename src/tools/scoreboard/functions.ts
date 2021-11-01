import { Unsubscribe } from "redux";
import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Phases } from "tools/phases/functions";
import { UIController } from "tools/UIController";
import { ClockStatus, Phase, ScoreboardStatus, ScoreboardTeam, ScoreboardTeamStatus, SScoreboard, Team, TeamSide } from "tools/vars";
import { BreakClock } from "./breakclock";
import { GameClock } from "./gameclock";
import { JamClock } from "./jamclock";

JamClock.OnStop.push(() => {
    Scoreboard.ToggleBreakClock();
});

namespace Scoreboard {

    /**
     * Calls an injury timeout, stopping all clocks.
     */
    export const CallInjuryTimeout = () => {
        JamClock.stop();
        GameClock.stop();
        BreakClock.stop();
        BreakClock.MaxSeconds = 30;
        BreakClock.set(0, 0, 30, 0);
        MainController.UpdateScoreboardState({BoardStatus:ScoreboardStatus.INJURY});
    }

    /**
     * Calls an official timeout, stopping the jam clock, game clock, and setting the break clock to 60 seconds.
     */
    export const CallOfficialTimeout = () => {
        JamClock.stop();
        GameClock.stop();
        BreakClock.stop();
        BreakClock.MaxSeconds = 60;
        BreakClock.set(0, 0, 60, 0);
        MainController.UpdateScoreboardState({BoardStatus:ScoreboardStatus.TIMEOUT});
        BreakClock.start();
    };

    /**
     * Decrease the jam number by 1
     */
    export const DecreaseJamCounter = () => {
        const value = Math.max(0, (GetState().JamNumber || 0) - 1);
        MainController.UpdateScoreboardState({JamNumber:value});
    }

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const DecreaseTeamChallenges = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamChallenges(side, (((side === 'A') ? state.TeamA?.Challenges : state.TeamB?.Challenges) || 0) - amount);
    };

    /**
     * Decrease a team's jam points
     * @param side 
     * @param amount Default is 1
     * @return true if score was also decrease, false if not
     */
    export const DecreaseTeamJamPoints = (side:TeamSide, amount:number = 1) : boolean => {
        const state = GetState();
        if(state.JamClock?.Status !== ClockStatus.RUNNING) {
            SetTeamJamPoints(side, (((side === 'A') ? state.TeamA?.JamPoints : state.TeamB?.JamPoints) || 0) - amount);
            DecreaseTeamScore(side, amount);
            return true;
        }
        return false;
    };

    /**
     * 
     * @param side 
     * @param amount Default is 1
     */
    export const DecreaseTeamScore = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamScore(side, (((side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0) - amount);
    };

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const DecreaseTeamTimeouts = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamTimeouts(side, (((side === 'A') ? state.TeamA?.Timeouts : state.TeamB?.Timeouts) || 0) - amount);
    };

    /**
     * Get current scoreboard state
     * @returns 
     */
    export const GetState = () => MainController.GetState().Scoreboard;

    /**
     * 
     * @returns 
     */
    export const GetConfig = () => UIController.GetState().Config.Scoreboard || {};

    /**
     * 
     * @returns 
     */
    export const GetStatusBackground = () : string => {
        const config = UIController.GetState().Config.Colors;
        switch(GetState().BoardStatus) {
            case ScoreboardStatus.INJURY : return config?.Calls || '#0099CC';
            case ScoreboardStatus.OVERTURNED : return config?.Active || '#009900';
            case ScoreboardStatus.REVIEW : return config?.Danger || '#990000';
            case ScoreboardStatus.TIMEOUT : return config?.Danger || '#990000';
            case ScoreboardStatus.UPHELD : return config?.Neutral || '#666666';
        }
        return 'transparent';
    };

    /**
     * 
     * @returns 
     */
    export const GetStatusLabel = () : string => {
        const config = UIController.GetState().Config.Scoreboard;
        switch(GetState().BoardStatus) {
            case ScoreboardStatus.INJURY : return config?.LabelInjury || 'INJURY TIMEOUT';
            case ScoreboardStatus.OVERTURNED : return config?.LabelOverturned || 'CALL OVERTURNED';
            case ScoreboardStatus.REVIEW : return config?.LabelReview || 'OFFICIAL REVIEW';
            case ScoreboardStatus.TIMEOUT : return config?.LabelOfficialTimeout || 'OFFICIAL TIMEOUT';
            case ScoreboardStatus.UPHELD : return config?.LabelUpheld || 'CALL UPHELD';
        }

        return '';
    };

    /**
     * 
     * @param side 
     * @returns 
     */
    export const GetTeamStatusColor = (side:TeamSide) : string => {
        const status = ((side === 'A') ? GetState().TeamA?.Status : GetState().TeamB?.Status) || ScoreboardTeamStatus.NORMAL;
        const config = UIController.GetState().Config.Colors;
        switch(status) {
            case ScoreboardTeamStatus.CHALLENGE : return config?.Danger || '#990000';
            case ScoreboardTeamStatus.INJURY : return config?.Calls || '#0099CC';
            case ScoreboardTeamStatus.LEADJAM : return config?.Active || '#009900';
            case ScoreboardTeamStatus.POWERJAM : return config?.Warning || '#CC9900';
            case ScoreboardTeamStatus.TIMEOUT : return config?.Danger || '#990000';
            default : return '';
        }
    }

    /**
     * 
     * @param side 
     * @returns 
     */
    export const GetTeamStatusLabel = (side:TeamSide) : string => {
        const status = ((side === 'A') ? GetState().TeamA?.Status : GetState().TeamB?.Status) || ScoreboardTeamStatus.NORMAL;
        const config = UIController.GetState().Config.Scoreboard;
        switch(status) {
            case ScoreboardTeamStatus.CHALLENGE : return config?.LabelChallenges ||  'CHALLENGE';
            case ScoreboardTeamStatus.INJURY : return config?.LabelInjury || 'INJURY';
            case ScoreboardTeamStatus.LEADJAM : return config?.LabelLeadJammer || 'LEAD JAMMER';
            case ScoreboardTeamStatus.POWERJAM : return config?.LabelPowerJam || 'POWER JAM';
            case ScoreboardTeamStatus.TIMEOUT : return config?.LabelTimeouts || 'TIMEOUT';
            default : return '';
        }
    };

    export const GetUpdateTime = () => MainController.GetState().UpdateTimeScoreboard;

    /**
     * Increase the jam counter by 1
     */
    export const IncreaseJamCounter = () => {
        const value = Math.min(999, (GetState().JamNumber || 0) + 1);
        MainController.UpdateScoreboardState({JamNumber:value});
    };

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const IncreaseTeamChallenges = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamChallenges(side, (((side === 'A') ? state.TeamA?.Challenges : state.TeamB?.Challenges) || 0) + amount);
    };

    /**
     * Increase a team's jam points
     * @param side 
     * @param amount Default is 1
     * @return true if score is also increase, false if not
     */
    export const IncreaseTeamJamPoints = (side:TeamSide, amount:number = 1) : boolean => {
        const state = GetState();
        if(state.JamClock?.Status !== ClockStatus.RUNNING) {
            SetTeamJamPoints(side, (((side === 'A') ? state.TeamA?.JamPoints : state.TeamB?.JamPoints) || 0) + amount);
            IncreaseTeamScore(side, amount);
            return true;
        }
        return false;
    };

    /**
     * Increase team score
     * @param side 
     * @param amount Default is 1
     */
    export const IncreaseTeamScore = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamScore(side, (((side === 'A') ? state.TeamA?.Score : state.TeamB?.Score) || 0) + amount);
    };

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const IncreaseTeamTimeouts = (side:TeamSide, amount:number = 1) => {
        const state = GetState();
        SetTeamTimeouts(side, (((side === 'A') ? state.TeamA?.Timeouts : state.TeamB?.Timeouts) || 0) + amount);
    };

    /**
     * Initialize scoreboard stuff.
     * - Save listener.
     */
    export const Init = () : Promise<boolean> => {
        return new Promise(res => {
            Load().then().catch().finally(() => {
                let lastState = GetState();
                let saving = false;
                setInterval(() => {
                    const state = GetState();
                    if(!saving && lastState !== state) {
                        saving = true;
                        lastState = state;
                        Data.SaveScoreboard(state).then().catch().finally(() => {
                            saving = false;
                        });
                    }
                }, 1000);
                return res(true);
            });
        })
    };

    /**
     * 
     * @returns 
     */
    export const Load = () : Promise<SScoreboard> => {
        return new Promise((res, rej) => {
            Data.LoadScoreboard().then(state => {
                Update(state);
                return res(state);
            }).catch(er => rej(er));
        });
    }

    /**
     * Move the scoreboard to the next phase.
     */
    export const NextPhase = (name:boolean = true) : Phase|undefined => {
        const state = GetState();
        const phases = Phases.GetRecords();
        let index = (state.PhaseIndex || 0);
        index++;
        if(index >= phases.length)
            index = 0;
        const phase = phases[index];
        if(phase) {
            if(name) {
                MainController.UpdateScoreboardState({
                    PhaseName:phase.Name || '',
                    PhaseIndex:index
                });
            } else {
                SetPhase(phase.RecordID || 0);
            }
            return phase;
        }

        return undefined;
    };

    /**
     * Move the scoreboard to the previous phase.
     */
    export const PreviousPhase = (name:boolean = true) : Phase|undefined => {
        const state = GetState();
        const phases = Phases.GetRecords();
        let index = (state.PhaseIndex || 0);
        index--;
        if(index < 0)
            index = phases.length - 1;
        const phase = phases[index];
        if(phase) {
            if(name) {
                MainController.UpdateScoreboardState({
                    PhaseName:phase.Name || '',
                    PhaseIndex:index
                })
            } else {
                SetPhase(phase.RecordID || 0);
            }
            return phase;
        }

        return undefined;
    };

    /**
     * Reset entire scoreboard, except team colors/names/logo.
     */
    export const Reset = () => {
        JamClock.stop();
        BreakClock.stop();
        GameClock.stop();
        JamClock.reset();
        BreakClock.reset();
        const first = MainController.GetState().Phases.find(p => p.Quarter === 1);
        const findex = MainController.GetState().Phases.findIndex(p => p.Quarter === 1);
        const hour = first?.Hours || 0;
        const minute = first?.Minutes || 0;
        const second = first?.Seconds || 0;
        GameClock.set(hour, minute, second, 0);

        MainController.UpdateScoreboardState({
            BoardStatus:ScoreboardStatus.NORMAL,
            BreakClock:{
                Hours:0,
                Minutes:0,
                Seconds:BreakClock.MaxSeconds,
                Status:ClockStatus.STOPPED,
                Tenths:0
            },
            ConfirmStatus:false,
            GameClock:{
                Hours:hour,
                Minutes:minute,
                Seconds:second,
                Tenths:0,
                Status:ClockStatus.STOPPED
            },
            JamClock:{
                Hours:0,
                Minutes:0,
                Seconds:JamClock.MaxSeconds,
                Tenths:0,
                Status:ClockStatus.STOPPED
            },
            JamHour:hour,
            JamMinute:minute,
            JamSecond:second,
            JamNumber:0,
            PhaseHour:hour,
            PhaseMinute:minute,
            PhaseSecond:second,
            PhaseID:first?.RecordID || 0,
            PhaseName:first?.Name || 'DERBY!',
            PhaseIndex:findex || 0
        })
    };

    /**
     * Stop all clocks, and set the game clock to the previous time from the next jam.
     */
    export const ResetJam = () => {
        const state = GetState();
        JamClock.stop();
        BreakClock.stop();
        GameClock.stop();
        GameClock.set(state.JamHour || 0, state.JamMinute || 0, state.JamSecond || 0, 0);
    };

    /**
     * Set the game clock time, if the jam clock and game clock are not running.
     * This method should only be called implicitly by the user.
     * @param hour 
     * @param minute 
     * @param second 
     */
    export const SetGameClockTime = (hour:number, minute:number, second:number) => {
        if(JamClock.Status !== ClockStatus.RUNNING && GameClock.Status !== ClockStatus.RUNNING) {
            GameClock.set(hour, minute, second, 0);
        }
    };

    /**
     * 
     * @param id 
     */
    export const SetPhase = (id:number) => {
        let record = Phases.Get(id);
        if(record) {
            let index = MainController.GetState().Phases.findIndex(r => r.RecordID === id);
            MainController.UpdateScoreboardState({
                PhaseHour:record.Hours || 0,
                PhaseID:id,
                PhaseIndex:index,
                PhaseMinute:record.Minutes || 0,
                PhaseName:record.Name || '',
                PhaseSecond:record.Seconds || 0
            });

            if(GameClock.Status !== ClockStatus.RUNNING) {
                GameClock.set(record.Hours || 0, record.Minutes || 0, record.Seconds || 0, 0);
            }
        }
    };

    /**
     * Set the scoreboard status
     * @param status 
     */
    export const SetStatus = (status:ScoreboardStatus = ScoreboardStatus.NORMAL) => {
        const state = GetState();
        MainController.UpdateScoreboardState({BoardStatus:(status === state.BoardStatus) ? ScoreboardStatus.NORMAL : status});
    }

    /**
     * Set the team.
     * @param side 
     * @param team 
     * @param values 
     */
    export const SetTeam = (side:TeamSide, team:Team, values?:ScoreboardTeam) => {
        MainController.UpdateScoreboardTeam(side, {
            Color:team.Color || '#000000',
            ID:team.RecordID || 0,
            Logo:team.Thumbnail || '',
            Name:team.Name || '',
            ScoreboardThumbnail:team.ScoreboardThumbnail || '',
            ...values
        });
    };

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const SetTeamChallenges = (side:TeamSide, amount:number = 0) => {
        MainController.UpdateScoreboardTeam(side, {Challenges:Math.max(0, Math.min(amount, UIController.GetState().Config.Scoreboard?.MaxTeamChallenges || 3))});
    };

    /**
     * Set the team jam points
     * @param side 
     * @param amount 
     */
    export const SetTeamJamPoints = (side:TeamSide, amount:number = 0) => {
        MainController.UpdateScoreboardTeam(side, {JamPoints:Math.max(0, Math.min(amount, 99))});
    };

    /**
     * Set the team score
     * @param side 
     * @param amount 
     */
    export const SetTeamScore = (side:TeamSide, amount:number = 0) => {
        MainController.UpdateScoreboardTeam(side, {Score:Math.max(0, Math.min(amount, 999))})
    };

    /**
     * 
     * @param side 
     * @param amount 
     */
    export const SetTeamTimeouts = (side:TeamSide, amount:number = 0) => {
        MainController.UpdateScoreboardTeam(side, {Timeouts:Math.max(0, Math.min(amount, UIController.GetState().Config.Scoreboard?.MaxTeamTimeouts || 3))});
    };

    /**
     * Set the scoreboard status of the given team.
     * @param side 
     * @param status 
     */
    export const SetTeamStatus = (side:TeamSide, status:ScoreboardTeamStatus = ScoreboardTeamStatus.NORMAL) => {
        const state = GetState();
        if(side === 'A') {
            let value = status;
            if(value === state.TeamA?.Status)
                value = ScoreboardTeamStatus.NORMAL;
            MainController.UpdateScoreboardTeam(side, {Status:value});
            //MainController.UpdateScoreboardTeam('B', {Status:ScoreboardTeamStatus.NORMAL});
        } else if(side === 'B') {
            let value = status;
            if(value === state.TeamB?.Status)
                value = ScoreboardTeamStatus.NORMAL;
            MainController.UpdateScoreboardTeam(side, {Status:value});
            //MainController.UpdateScoreboardTeam('A', {Status:ScoreboardTeamStatus.NORMAL});
        }
    };

    export const Stop = () => {
        JamClock.stop();
        GameClock.stop();
        BreakClock.stop();
    }

    /**
     * Subscribe to changes to the state.
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) : Unsubscribe => MainController.Subscribe(f);

    /**
     * Start/stop the break clock and jam clock.
     */
    export const ToggleBreakClock = () => {
        if(JamClock.Status !== ClockStatus.RUNNING) {
            switch(BreakClock.Status) {
                case ClockStatus.RUNNING :
                    BreakClock.stop();
                    BreakClock.reset();
                break;

                case ClockStatus.STOPPED :
                    BreakClock.reset();
                    BreakClock.start();
                break;
            }
        } else {
            //stop break clock
            BreakClock.stop();
            BreakClock.reset();
        }
    }

    /**
     * Toggle the confirmation of jam points on the main scoreboard.
     */
    export const ToggleConfirmStatus = () => {
        if(JamClock.Status !== ClockStatus.RUNNING) {
            const state = GetState();
            MainController.UpdateScoreboardState({ConfirmStatus:!state.ConfirmStatus});
        }
    }

    /**
     * Start/stop game clock, if the jam clock isn't running.
     */
    export const ToggleGameClock = () => {
        if(JamClock.Status !== ClockStatus.RUNNING) {
            switch(GameClock.Status) {
                case ClockStatus.RUNNING :
                    GameClock.stop();
                break;
                case ClockStatus.STOPPED :
                    GameClock.start();
                break;
            }
        }
    }

    /**
     * Toggle the Jam Clock
     */
    export const ToggleJamClock = () => {
        switch(JamClock.Status) {
            //stop and reset jam clock; stop, reset, and start break clock
            case ClockStatus.RUNNING : {
                JamClock.stop();
                JamClock.reset();
                BreakClock.stop();
                BreakClock.MaxSeconds = 30;
                BreakClock.reset();
                BreakClock.start();
                SetTeamStatus('A', ScoreboardTeamStatus.NORMAL);
                SetTeamStatus('B', ScoreboardTeamStatus.NORMAL);
            }
            break;
    
            //reset jam clock, start jam clock, start game clock; stop break clock
            case ClockStatus.STOPPED : {
                const state = GetState();
                JamClock.reset();

                //save game time
                MainController.UpdateScoreboardState({
                    JamHour:GameClock.Hour,
                    JamMinute:GameClock.Minute,
                    JamSecond:GameClock.Second,
                    ConfirmStatus:false,
                    BoardStatus:ScoreboardStatus.NORMAL
                });

                JamClock.start();
                GameClock.start();
                BreakClock.stop();
                BreakClock.reset();
                IncreaseJamCounter();
                SetTeamJamPoints('A', 0);
                SetTeamJamPoints('B', 0);

                //set the team status
                if(state.TeamA?.Status !== ScoreboardTeamStatus.POWERJAM) {
                    SetTeamStatus('A', ScoreboardTeamStatus.NORMAL);
                }

                if(state.TeamB?.Status !== ScoreboardTeamStatus.POWERJAM) {
                    SetTeamStatus('B', ScoreboardTeamStatus.NORMAL);
                }
            }
            break;
        }
    };

    export const Update = (state:SScoreboard) =>MainController.UpdateScoreboardState(state);

    /**
     * Update team values
     * @param side 
     * @param values 
     */
    export const UpdateTeam = (side:TeamSide, values:ScoreboardTeam) => {
        MainController.UpdateScoreboardTeam(side, {
            ...values
        });
    };
}

export {Scoreboard};