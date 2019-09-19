/**
 * Scoreboard Controller / Store
 */

import {createStore} from 'redux';
import DataController from 'controllers/DataController'
import vars from 'tools/vars'
import keycodes from 'tools/keycodes'

const SET_STATE = 'SET_STATE';
const RESET_STATE = 'RESET_STATE';
const RESET_JAM = 'RESET_JAM';
const SAVE_STATE = 'SAVE_STATE';

//Board Constants
const TOGGLE_JAM_CLOCK = 'TOGGLE_JAM_CLOCK';
const TOGGLE_GAME_CLOCK = 'TOGGLE_GAME_CLOCK';
const TOGGLE_BREAK_CLOCK = 'TOGGLE_BREAK_CLOCK';
const TOGGLE_CONFIRM = 'TOGGLE_CONFIRM';
const SET_BOARD_STATUS = 'SET_BOARD_STATUS';
const SET_OFFICIAL_TIMEOUT = 'SET_OFFICIAL_TIMEOUT';
const SET_INJURY_TIMEOUT = 'SET_INJURY_TIMEOUT';
const SET_PHASES = 'SET_PHASES';
const SET_PHASE = 'SET_PHASE';
const SET_PHASE_TIME = 'SET_PHASE_TIME';
const SET_JAM_COUNTER = 'SET_JAM_COUNTER';
const SET_GAME_TIME = 'SET_GAME_TIME';

//Team Constants
const SET_TEAM = 'SET_TEAM';
const SET_TEAMS = 'SET_TEAMS';
const SET_TEAM_COLOR = 'SET_TEAM_COLOR';
const SET_TEAM_CHALLENGES = 'SET_TEAM_CHALLENGES';
const SET_TEAM_JAMPOINTS = 'SET_TEAM_JAMPOINTS';
const SET_TEAM_SCORE = 'SET_TEAM_SCORE';
const SET_TEAM_TIMEOUTS = 'SET_TEAM_TIMEOUTS';
const SET_TEAM_NAME = 'SET_TEAM_NAME';
const SET_TEAM_STATUS = 'SET_TEAM_STATUS';

export interface SScoreboardTeam {
    Side:string,
    ID:number,
    Score:number,
    Timeouts:number,
    Challenges:number,
    JamPoints:number,
    Status:number,
    Color:string,
    Name:string,
    Thumbnail:string,
    ScoreboardThumbnail:string
}

export interface SScoreboardState {
    ID:number,
    JamCounter:number,
    JamHour:number,
    JamMinute:number,
    JamSecond:number,
    JamState:number,
    GameHour:number,
    GameMinute:number,
    GameSecond:number,
    GameState:number,
    BreakHour:number,
    BreakMinute:number,
    BreakSecond:number,
    BreakState:number,
    PhaseID:number
    PhaseName:string,
    PhaseIndex:number,
    PhaseHour:number,
    PhaseMinute:number,
    PhaseSecond:number,
    BoardStatus:number,
    ConfirmStatus:number,
    TeamA:SScoreboardTeam,
    TeamB:SScoreboardTeam,
    StartGameHour:number,
    StartGameMinute:number,
    StartGameSecond:number
}

const ScoreboardState:SScoreboardState = {
    ID:0,
    JamCounter:0,
    JamHour:0,
    JamMinute:0,
    JamSecond:60,
    JamState:vars.Clock.Status.Ready,
    GameHour:0,
    GameMinute:15,
    GameSecond:0,
    GameState:vars.Clock.Status.Ready,
    BreakHour:0,
    BreakMinute:0,
    BreakSecond:30,
    BreakState:vars.Clock.Status.Ready,
    PhaseID:0,
    PhaseName:"DERBY!",
    PhaseIndex:0,
    PhaseHour:0,
    PhaseMinute:0,
    PhaseSecond:0,
    BoardStatus:vars.Scoreboard.Status.Normal,
    ConfirmStatus:0,
    TeamA:{
        Side:'A',
        ID:0,
        Score:0,
        Timeouts:3,
        Challenges:3,
        JamPoints:0,
        Status:vars.Team.Status.Normal,
        Color:"#993333",
        Name:"Team A",
        Thumbnail:"default/TeamA.jpg",
        ScoreboardThumbnail:""
    },
    TeamB:{
        Side:'B',
        ID:0,
        Score:0,
        Timeouts:3,
        Challenges:3,
        JamPoints:0,
        Status:vars.Team.Status.Normal,
        Color:"#333399",
        Name:"Team B",
        Thumbnail:"default/TeamB.jpg",
        ScoreboardThumbnail:""
    },
    StartGameHour:0,
    StartGameMinute:0,
    StartGameSecond:0
}

const MidiControllers = {
    MPX16:{
        PAD5:() => {
            ScoreboardController.IncreaseTeamScore(ScoreboardController.getState().TeamA, 1);
        },
        PAD9:() => {
            ScoreboardController.DecreaseTeamScore(ScoreboardController.getState().TeamA, 1);
        },
        PAD6:() => {
            ScoreboardController.IncreaseTeamScore(ScoreboardController.getState().TeamB, 1);
        },
        PAD10:() => {
            ScoreboardController.DecreaseTeamScore(ScoreboardController.getState().TeamB, 1);
        },
    }
};

/**
 * Reducer for the scoreboard ScoreboardController.
 * @param {Object} state 
 * @param {object} action 
 */
function ControllerReducer(state:SScoreboardState = ScoreboardState, action) {
    switch(action.type) {
        case SET_STATE :
            var obj = Object.assign({}, state, action.state, {
                TeamA:Object.assign({}, state.TeamA),
                TeamB:Object.assign({}, state.TeamB)
            });
            if(action.state.TeamA)
                obj.TeamA = Object.assign(obj.TeamA, action.state.TeamA);
            if(action.state.TeamB)
                obj.TeamB = Object.assign(obj.TeamB, action.state.TeamB);
            return obj;

        //reset the state
        case RESET_STATE :
            //ignore reset if game/jam clock is running
            if(state.JamState === vars.Clock.Status.Running || state.GameState === vars.Clock.Status.Running)
                return state;

            var phases = DataController.getPhases();
            var phase = {
                PhaseID:0,
                PhaseName:"DERBY!",
                PhaseIndex:0,
                PhaseHour:0,
                PhaseMinute:0,
                PhaseSecond:0
            };
            var index = phases.findIndex((p) => {
                return (p.PhaseQtr >= 1);
            });

            if(index >= 0) {
                phase.PhaseIndex = index;
                phase.PhaseID = phases[index].RecordID;
                if(typeof(phases[index].Name) === "string")
                    phase.PhaseName = phases[index].Name;
                phase.PhaseHour = phases[index].Duration[0];
                phase.PhaseMinute = phases[index].Duration[1];
                phase.PhaseSecond = phases[index].Duration[2];
            }

            //copy initial state, keep team identification and phases
            return Object.assign({}, ScoreboardState, {
                StartGameHour:0,
                StartGameMinute:0,
                StartGameSecond:0,
                PhaseID:phase.PhaseID,
                PhaseIndex:phase.PhaseIndex,
                PhaseName:phase.PhaseName,
                PhaseHour:phase.PhaseHour,
                PhaseMinute:phase.PhaseMinute,
                PhaseSecond:phase.PhaseSecond,
                TeamA:Object.assign({}, state.TeamA, {
                    Score:0,
                    Timeouts:3,
                    Challenges:3,
                    JamPoints:0,
                    Status:0
                }),
                TeamB:Object.assign({}, state.TeamB, {
                    Score:0,
                    Timeouts:3,
                    Challenges:3,
                    JamPoints:0,
                    Status:0
                })
            });

        //calls an official timeout
        case SET_OFFICIAL_TIMEOUT :
            if(state.BoardStatus === vars.Scoreboard.Status.Timeout) {
                return Object.assign({}, state, {
                    BoardStatus:vars.Scoreboard.Status.Normal
                });
            } else {
                return Object.assign({}, state, {
                    JamState:vars.Clock.Status.Stopped,
                    GameState:vars.Clock.Status.Stopped,
                    BreakState:vars.Clock.Status.Ready,
                    BoardStatus:vars.Scoreboard.Status.Timeout,
                    TeamA:Object.assign({}, state.TeamA, {
                        Status:vars.Team.Status.Normal
                    }),
                    TeamB:Object.assign({}, state.TeamB, {
                        Status:vars.Team.Status.Normal
                    })
                });
            }
            
        //calls an injury timeout
        case SET_INJURY_TIMEOUT :
            if(state.BoardStatus === vars.Scoreboard.Status.Injury) {
                return Object.assign({}, state, {
                    BoardStatus:vars.Scoreboard.Status.Normal
                });
            } else {
                return Object.assign({}, state, {
                    JamState:vars.Clock.Status.Stopped,
                    GameState:vars.Clock.Status.Stopped,
                    BreakState:vars.Clock.Status.Ready,
                    BoardStatus:vars.Scoreboard.Status.Injury,
                    TeamA:Object.assign({}, state.TeamA, {
                        Status:vars.Team.Status.Normal
                    }),
                    TeamB:Object.assign({}, state.TeamB, {
                        Status:vars.Team.Status.Normal
                    })
                });
            }

        //toggle the jam clock
        case TOGGLE_JAM_CLOCK :
            switch(state.JamState) {
                case vars.Clock.Status.Ready :
                    var teamAStatus = state.TeamA.Status;
                    var teamBStatus = state.TeamB.Status;

                    if(teamAStatus !== vars.Team.Status.PowerJam)
                        teamAStatus = vars.Team.Status.Normal;

                    if(teamBStatus !== vars.Team.Status.PowerJam)
                        teamBStatus = vars.Team.Status.Normal;

                    return Object.assign({}, state, {
                        JamCounter:state.JamCounter+1,
                        JamState:vars.Clock.Status.Running,
                        GameState:vars.Clock.Status.Running,
                        BreakState:vars.Clock.Status.Ready,
                        BoardStatus:vars.Scoreboard.Status.Normal,
                        BreakSecond:30,
                        //Record game time for jam reset
                        StartGameHour:state.GameHour,
                        StartGameMinute:state.GameMinute,
                        StartGameSecond:state.GameSecond,
                        ConfirmStatus:0,
                        TeamA:Object.assign({}, state.TeamA, {
                            Status:teamAStatus,
                            JamPoints:0
                        }),
                        TeamB:Object.assign({}, state.TeamB, {
                            Status:teamBStatus,
                            JamPoints:0
                        })
                    });

                //stop jam clock, start break clock
                case vars.Clock.Status.Running :
                    return Object.assign({}, state, {
                        JamState:vars.Clock.Status.Stopped,
                        BreakState:vars.Clock.Status.Running,
                        BreakSecond:30
                    });

                //reset jam clock, board status, and team status
                case vars.Clock.Status.Stopped :
                    return Object.assign({}, state, {
                        JamState:vars.Clock.Status.Ready,
                        JamSecond:vars.Scoreboard.JamSeconds,
                        BoardStatus:vars.Scoreboard.Status.Normal,
                        TeamA:Object.assign({}, state.TeamA,{
                            Status:vars.Team.Status.Normal
                        }),
                        TeamB:Object.assign({}, state.TeamB, {
                            Status:vars.Team.Status.Normal
                        })
                    });

                default :
                    return state;
            }

        //toggles the game clock
        case TOGGLE_GAME_CLOCK :
            //ignore if jam clock is running
            if(state.JamState === vars.Clock.Status.Running)
                return state;
            switch(state.GameState) {
                case vars.Clock.Status.Stopped :
                case vars.Clock.Status.Ready :
                    return Object.assign({}, state, {
                        GameState:vars.Clock.Status.Running
                    });
                case vars.Clock.Status.Running :
                    return Object.assign({}, state, {
                        GameState:vars.Clock.Status.Stopped
                    });
                default :
                    return state;
            }

        case TOGGLE_BREAK_CLOCK :
            if(state.JamState === vars.Clock.Status.Running)
                return state;
            switch(state.BreakState) {
                case vars.Clock.Status.Stopped :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Ready,
                        BreakSecond:30
                    });
                case vars.Clock.Status.Ready :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Running
                    });
                case vars.Clock.Status.Running :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Ready,
                        BreakSecond:30
                    });
                default :
                    return state;
            }

        case SET_GAME_TIME :
            return Object.assign({}, state, {
                GameHour:action.hour,
                GameMinute:action.minute,
                GameSecond:action.second
            });
            
        case SET_BOARD_STATUS :
            if(state.JamState === vars.Clock.Status.Running || state.BoardStatus === action.BoardStatus) {
                return Object.assign({}, state, {
                    BoardStatus:vars.Scoreboard.Status.Normal
                });
            }

            var clockStatus = state.GameState;
            var breakState = state.BreakState;

            if(action.BoardStatus === vars.Scoreboard.Status.Timeout
                || action.BoardStatus === vars.Scoreboard.Status.Injury) {
                    clockStatus = vars.Clock.Status.Stopped;
                    breakState = vars.Clock.Status.Ready;
                }

            return Object.assign({}, state, {
                BoardStatus:action.BoardStatus,
                GameState:clockStatus,
                BreakState:breakState
            });

        case TOGGLE_CONFIRM :
            return Object.assign({}, state, {
                ConfirmStatus:(state.ConfirmStatus) ? 0 : 1
            });

        case SET_PHASE :
            var duration = [0,0,0];
            var name:any = "";
            var id:any = 0;
            var Phases = DataController.getState().Phases;
            if(Phases[action.index]) {
                duration = Phases[action.index].Duration;
                name = Phases[action.index].Name;
                id = Phases[action.index].RecordID;
            }
                
            return Object.assign({}, state, {
                PhaseIndex:action.index,
                PhaseID:id,
                PhaseName:name,
                PhaseHour:duration[0],
                PhaseMinute:duration[1],
                PhaseSecond:duration[2]
            });

        case SET_PHASE_TIME :
            return Object.assign({}, state, {
                PhaseHour:action.hour,
                PhaseMinute:action.minute,
                PhaseSecond:action.second
            });

        case SET_PHASES :
            return Object.assign({}, state, {
                Phases:action.records
            });

        case SET_JAM_COUNTER :
            var amount = action.amount;
            if(amount < 0)
                amount = 0;
            return Object.assign({}, state, {
                JamCounter:amount
            });

        /* Team Actions */
        case SET_TEAM :
            if(Object.is(action.currentTeam, state.TeamA)) {
                return Object.assign({}, state, {
                    TeamA:Object.assign({}, state.TeamA, {
                        ID:action.nextTeam.RecordID,
                        Name:action.nextTeam.Name,
                        Color:action.nextTeam.Color,
                        Thumbnail:action.nextTeam.Thumbnail,
                        ScoreboardThumbnail:action.nextTeam.ScoreboardThumbnail
                    })
                });
            } else {
                return Object.assign({}, state, {
                    TeamB:Object.assign({}, state.TeamB, {
                        ID:action.nextTeam.RecordID,
                        Name:action.nextTeam.Name,
                        Color:action.nextTeam.Color,
                        Thumbnail:action.nextTeam.Thumbnail,
                        ScoreboardThumbnail:action.nextTeam.ScoreboardThumbnail
                    })
                });
            }

        //set both teams
        case SET_TEAMS :
            return Object.assign({}, state, {
                TeamA:Object.assign({}, state.TeamA, {
                    ID:action.TeamA.RecordID,
                    Name:action.TeamA.Name,
                    Color:action.TeamA.Color,
                    Thumbnail:action.TeamA.Thumbnail,
                    ScoreboardThumbnail:action.TeamA.ScoreboardThumbnail
                }),
                TeamB:Object.assign({}, state.TeamB, {
                    ID:action.TeamB.RecordID,
                    Name:action.TeamB.Name,
                    Color:action.TeamB.Color,
                    Thumbnail:action.TeamB.Thumbnail,
                    ScoreboardThumbnail:action.TeamB.ScoreboardThumbnail
                }),
            });

        case SET_TEAM_COLOR :
            if(action.Team.Side === 'A') {
                return Object.assign({}, state, {
                    TeamA:Object.assign({}, state.TeamA, {
                        Color:action.Color
                    })
                });
            } else {
                return Object.assign({}, state, {
                    TeamB:Object.assign({}, state.TeamB, {
                        Color:action.Color
                    })
                });
            }

        case SET_TEAM_NAME :
            if(action.Team.Side === 'A') {
                return Object.assign({}, state, {
                    TeamA:Object.assign({}, state.TeamA, {
                        Name:action.Name
                    })
                });
            } else {
                return Object.assign({}, state, {
                    TeamB:Object.assign({}, state.TeamB, {
                        Name:action.Name
                    })
                });
            }

        case SET_TEAM_SCORE :
            if(action.Team.Side === 'A') {
                let jampoints = state.TeamA.JamPoints;
                if(typeof(action.jampoints) === 'number')
                    jampoints = action.jampoints;
                return Object.assign({}, state, {
                    TeamA:Object.assign({}, state.TeamA, {
                        Score:action.amount,
                        JamPoints:jampoints
                    })
                });
            } else {
                let jampoints = state.TeamB.JamPoints;
                if(typeof(action.jampoints) === 'number')
                    jampoints = action.jampoints;
                return Object.assign({}, state, {
                    TeamB:Object.assign({}, state.TeamB, {
                        Score:action.amount,
                        JamPoints:jampoints
                    })
                });
            }

        case SET_TEAM_JAMPOINTS :
            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    JamPoints:action.amount
                });
                return Object.assign({}, state, {
                    TeamA:team
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    JamPoints:action.amount
                });
                return Object.assign({}, state, {
                    TeamB:team
                });
            }

        case SET_TEAM_TIMEOUTS :
            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Timeouts:action.amount
                });
                return Object.assign({}, state, {
                    TeamA:team
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Timeouts:action.amount
                });
                return Object.assign({}, state, {
                    TeamB:team
                });
            }

        case SET_TEAM_CHALLENGES :
            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Challenges:action.amount
                });
                return Object.assign({}, state, {
                    TeamA:team
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Challenges:action.amount
                });
                return Object.assign({}, state, {
                    TeamB:team
                });
            }

        //Sets the team status
        //The status is toggled between teams, as no two teams
        //can have the same status
        case SET_TEAM_STATUS :
            var status = action.value;
            if(state.JamState === vars.Clock.Status.Running) {
                if(status !== vars.Team.Status.PowerJam && status !== vars.Team.Status.LeadJammer) {
                    return state;
                }
            }

            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Status:(action.value === state.TeamA.Status) ? vars.Team.Status.Normal : status
                });
                return Object.assign({}, state, {
                    TeamA:team,
                    TeamB:Object.assign({}, state.TeamB, {
                        Status:vars.Team.Status.Normal
                    })
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Status:(action.value === state.TeamB.Status) ? vars.Team.Status.Normal : status
                });
                return Object.assign({}, state, {
                    TeamB:team,
                    TeamA:Object.assign({}, state.TeamA, {
                        Status:vars.Team.Status.Normal
                    })
                });
            }

        case RESET_JAM :
            return Object.assign({}, state, {
                GameHour:state.StartGameHour,
                GameMinute:state.StartGameMinute,
                GameSecond:state.StartGameSecond,
                GameState:vars.Clock.Status.Stopped,
                JamState:vars.Clock.Status.Ready,
                BreakState:vars.Clock.Status.Ready,
                JamHour:ScoreboardState.JamHour,
                JamMinute:ScoreboardState.JamMinute,
                JamSecond:ScoreboardState.JamSecond
            });

        default :
            return state;
    }
}

const ScoreboardStore = createStore(ControllerReducer);

const ScoreboardController = {
    Key:'SB',
    /**
     * Sets the state of the scoreboard.
     * @param {Object} state 
     */
    SetState(state) {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:state
        });
    },

    /**
     * Toggles the jam clock
     */
    ToggleJamClock() {
        ScoreboardController.getStore().dispatch({
            type:TOGGLE_JAM_CLOCK
        });
    },

    /**
     * Starts the jam clock, game clock, and stops the break clock.
     */
    StartJamClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                JamState:vars.Clock.Status.Running,
                GameClock:vars.Clock.Status.Running,
                BreakClock:vars.Clock.Status.Ready
            }
        });
    },

    /**
     * Stops the jam clock and starts the break clock
     */
    StopJamClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                JamState:vars.Clock.Status.Stopped,
                BreakState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Toggles the game clock
     */
    ToggleGameClock() {
        ScoreboardController.getStore().dispatch({
            type:TOGGLE_GAME_CLOCK
        });
    },

    /**
     * Starts the game clock
     */
    StartGameClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                ClockState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Stops the game clock.
     */
    StopGameClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                GameState:vars.Clock.Status.Stopped
            }
        })
    },

    /**
     * Stops the game and break clock at the same time.
     */
    StopBreakGameClock() {
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.getStore().dispatch({
                type:SET_STATE,
                state:{
                    GameState:vars.Clock.Status.Stopped,
                    BreakState:vars.Clock.Status.Stopped
                }
            });
        }
    },

    /**
     * Toggles the break clock
     */
    ToggleBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:TOGGLE_BREAK_CLOCK
        });
    },

    /**
     * Starts the break clock
     */
    StartBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                BreakState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Stops the break clock
     */
    StopBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                BreakState:vars.Clock.Status.Ready
            }
        });
    },

    /**
     * Toggles the confirm status
     */
    ToggleConfirm() {
        ScoreboardController.getStore().dispatch({
            type:TOGGLE_CONFIRM
        });
    },

    /**
     * Resets all values on the board.
     */
    Reset() {
        ScoreboardController.getStore().dispatch({
            type:RESET_STATE
        });
    },

    /**
     * Sets the game time
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    async SetGameTime(hour, minute, second) {
        ScoreboardController.getStore().dispatch({
            type:SET_GAME_TIME,
            hour:hour,
            minute:minute,
            second:second
        });
    },

    /**
     * Sets the seconds on the break clock.
     * @param {Number} second Seconds on the break clock
     */
    SetBreakTime(second) {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                BreakHour:0,
                BreakMinute:0,
                BreakSecond:second
            }
        });
    },

    /**
     * Sets the seconds on the jam clock.
     * @param {Number} second 
     */
    SetJamTime(second) {
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                JamHour:0,
                JamMinute:0,
                JamSecond:second
            }
        });
    },

    /**
     * Sets the board status, such as official timeout
     * @param {Number} value 
     */
    SetBoardStatus(value) {
        ScoreboardController.getStore().dispatch({
            type:SET_BOARD_STATUS,
            BoardStatus:value
        });
    },

    /**
     * Sets the phase / quarter
     * @param {Number} index 
     */
    SetPhase(index) {
        var Phases = DataController.getState().Phases;
        if(index < 0)
            index = Phases.length - 1;
        else if(index >= Phases.length)
            index = 0;
        ScoreboardController.getStore().dispatch({
            type:SET_PHASE,
            index:index
        });
    },

    /**
     * Sets the phase time. (This does not change the game clock time.)
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    SetPhaseTime(hour, minute, second) {
        if(hour > 23)
            hour = 23;
        else if(hour < 0)
            hour = 0;
        if(minute > 59)
            minute = 59;
        else if(minute < 0)
            minute = 0;
        if(second > 59)
            second = 59;
        else if(second < 0)
            second = 0;
        ScoreboardController.getStore().dispatch({
            type:SET_PHASE_TIME,
            hour:hour,
            minute:minute,
            second:second
        });
    },

    /**
     * Move to the next phase
     */
    IncreasePhase() {
        ScoreboardController.SetPhase(ScoreboardController.getState().PhaseIndex + 1);
    },

    /**
     * Move to the previous phase
     */
    DecreasePhase() {
        ScoreboardController.SetPhase(ScoreboardController.getState().PhaseIndex - 1);
    },

    /**
     * Sets the Jam Counter / #
     * @param {Number} amount 
     */
    SetJamCounter(amount) {
        ScoreboardController.getStore().dispatch({
            type:SET_JAM_COUNTER,
            amount:amount
        });
    },

    /**
     * Increases the Jam Counter
     * @param {Number} amount 
     */
    IncreaseJamCounter(amount) {
        ScoreboardController.SetJamCounter(ScoreboardController.getState().JamCounter + amount);
    },

    /**
     * Decreases the Jam Counter
     * @param {Number} amount 
     */
    DecreaseJamCounter(amount) {
        ScoreboardController.SetJamCounter(ScoreboardController.getState().JamCounter - amount);
    },

    /**
     * Changes the given currentTeam to the new team.
     * @param {Object} currentTeam 
     * @param {Object} nextTeam 
     */
    SetTeam(currentTeam, nextTeam) {
        ScoreboardController.getStore().dispatch({
            type:SET_TEAM,
            current:currentTeam,
            nextTeam:nextTeam
        });
    },

    /**
     * Sets both teams of the scoreboard.
     * @param {Object} a 
     * @param {Object} b 
     * @param {Boolean} reset
     */
    SetTeams(a, b, reset) {
        if(a === null || typeof(a) !== "object" || b === null || typeof(b) !== "object")
            return;
        ScoreboardController.getStore().dispatch({
            type:SET_TEAMS,
            TeamA:a,
            TeamB:b
        });
        if(reset)
            ScoreboardController.Reset();
    },

    /**
     * Sets the given team's score
     * @param {Object} team 
     * @param {Number} amount 
     * @param {Number} jampoints
     */
    SetTeamScore(team, amount, jampoints) {
        if(amount < 0)
            amount = 0;
        else if(amount > 999)
            amount = 999;

        if(typeof(jampoints) === "number") {
            ScoreboardController.getStore().dispatch({
                type:SET_TEAM_SCORE,
                Team:team,
                amount:amount,
                jampoints:team.JamPoints + jampoints
            });
        } else {
            ScoreboardController.getStore().dispatch({
                type:SET_TEAM_SCORE,
                Team:team,
                amount:amount
            });
        }
    },

    /**
     * Sets the given team's timeouts
     * @param {Object} team 
     * @param {Number} amount 
     */
    SetTeamTimeouts(team, amount) {
        if(amount < 0)
            amount = 0;
        else if(amount > 3)
            amount = 3;
        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_TIMEOUTS,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the given team's Challenges
     * @param {Object} team 
     * @param {Number} amount 
     */
    SetTeamChallenges(team, amount) {
        if(amount < 0)
            amount = 0;
        else if(amount > 3)
            amount = 3;

        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_CHALLENGES,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the number of jam points for the given team.
     * @param {Object} team 
     * @param {Number} amount 
     */
    SetTeamJamPoints(team, amount) {
        if(amount < -99)
            amount = 99;
        else if(amount > 99)
            amount = 99;

        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_JAMPOINTS,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the given team's status.
     * @param {Object} team 
     * @param {Number} status 
     */
    SetTeamStatus(team, status) {
        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_STATUS,
            Team:team,
            value:status
        });
    },

    /**
     * Changes the name of the given team on the scoreboard.
     * @param {Object} team The team to change
     * @param {String} name The new name
     */
    SetTeamName(team, name) {
        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_NAME,
            Team:team,
            Name:name
        });
    },

    /**
     * Sets the team's color.
     * @param {Object} team 
     * @param {String} color 
     */
    SetTeamColor(team, color) {
        ScoreboardController.getStore().dispatch({
            type:SET_TEAM_COLOR,
            Team:team,
            Color:color
        });
    },

    /**
     * Increases the team's score by the given amount.
     * @param {Object} team 
     * @param {Number} amount 
     */
    async IncreaseTeamScore(team, amount) {
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.SetTeamScore(team, team.Score + amount, amount);
        } else {
            ScoreboardController.SetTeamScore(team, team.Score + amount, 0);
        }
    },

    /**
     * Decreases the team's score by the given amount
     * @param {Object} team 
     * @param {Number} amount 
     */
    async DecreaseTeamScore(team, amount) {
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.SetTeamScore(team, team.Score - amount, amount * -1);
        } else {
            ScoreboardController.SetTeamScore(team, team.Score - amount, 0);
        }
    },

    /**
     * Increases the team's jam points
     * @param {Object} team 
     * @param {Amount} amount 
     */
    IncreaseTeamJamPoints(team, amount) {
        ScoreboardController.SetTeamJamPoints(team, team.JamPoints + amount);
    },

    /**
     * Decreases the team's jam points
     * @param {Object} team 
     * @param {Number} amount 
     */
    DecreaseTeamJamPoints(team, amount) {
        ScoreboardController.SetTeamJamPoints(team, team.JamPoints - amount);
    },

    /**
     * Increases the team's challenges
     * @param {Object} team 
     * @param {Number} amount 
     */
    IncreaseTeamChallenges(team, amount) {
        ScoreboardController.SetTeamChallenges(team, team.Challenges + amount);
    },

    /**
     * Decreases the team's challenges
     * @param {Object} team 
     * @param {Number} amount 
     */
    DecreaseTeamChallenges(team, amount) {
        ScoreboardController.SetTeamChallenges(team, team.Challenges - amount);
    },

    /**
     * Increases the team's timeouts.
     * @param {Object} team 
     * @param {Number} amount 
     */
    IncreaseTeamTimeouts(team, amount) {
        ScoreboardController.SetTeamTimeouts(team, team.Timeouts + amount);
    },

    /**
     * Decreases the team's timeouts.
     * @param {Object} team 
     * @param {Number} amount 
     */
    DecreaseTeamTimeouts(team, amount) {
        ScoreboardController.SetTeamTimeouts(team, team.Timeouts - amount);
    },

    /**
     * Calls an official timeout
     */
    OfficialTimeout() {
        ScoreboardController.getStore().dispatch({
            type:SET_OFFICIAL_TIMEOUT
        });
    },

    /**
     * Calls an injury timeout.
     */
    InjuryTimeout() {
        ScoreboardController.getStore().dispatch({
            type:SET_INJURY_TIMEOUT
        });
    },

    AddJamRecord(record) {
        //DataController.AddJamRecord(record);
    },

    /**
     * Resets the jam to the previous 
     */
    ResetJam() {
        ScoreboardController.getStore().dispatch({
            type:RESET_JAM
        });
    },

    /**
     * Applies the given configuration options against the state of the scoreboard.
     * @param {Object} config 
     */
    ApplyConfig(config) {
        if(config === null || typeof(config) !== "object")
            return;

        var teamA = DataController.getTeam(config.TeamA.ID);
        var teamB = DataController.getTeam(config.TeamB.ID);
        ScoreboardController.getStore().dispatch({
            type:SET_STATE,
            state:{
                ID: parseInt(config.ID),
                JamID: parseInt(config.JamID),
                JamHour: parseInt(config.JamHour),
                JamMinute: parseInt(config.JamMinute),
                JamSecond: parseInt(config.JamSecond),
                JamState: parseInt(config.JamState),
                JamCounter: parseInt(config.JamCounter),
                BreakHour: parseInt(config.BreakHour),
                BreakMinute: parseInt(config.BreakMinute),
                BreakSecond: parseInt(config.BreakSecond),
                BreakState: parseInt(config.BreakState),
                GameHour: parseInt(config.GameHour),
                GameMinute: parseInt(config.GameMinute),
                GameSecond: parseInt(config.GameSecond),
                GameState: parseInt(config.GameState),
                TeamA:{
                    ID: parseInt(config.TeamA.ID),
                    Side:'A',
                    Name: config.TeamA.Name,
                    Score: parseInt(config.TeamA.Score),
                    Timeouts: parseInt(config.TeamA.Timeouts),
                    Challenges: parseInt(config.TeamA.Challenges),
                    JamPoints: parseInt(config.TeamA.JamPoints),
                    Status: parseInt(config.TeamA.Status),
                    Color:(teamA) ? teamA.Color : '#333333',
                    Thumbnail:(teamA) ? teamA.Thumbnail : '',
                    ScoreboardThumbnail:(teamA) ? teamA.ScoreboardThumbnail : ''
                },
                TeamB:{
                    ID: parseInt(config.TeamB.ID),
                    Side:'B',
                    Name: config.TeamB.Name,
                    Score: parseInt(config.TeamB.Score),
                    Timeouts: parseInt(config.TeamB.Timeouts),
                    Challenges: parseInt(config.TeamB.Challenges),
                    JamPoints: parseInt(config.TeamB.JamPoints),
                    Status: parseInt(config.TeamB.Status),
                    Color:(teamB) ? teamB.Color : '#333333',
                    Thumbnail:(teamB) ? teamB.Thumbnail : '',
                    ScoreboardThumbnail:(teamB) ? teamB.ScoreboardThumbnail : ''
                },
                PhaseID: parseInt( config.PhaseID ),
                PhaseName: config.PhaseName,
                PhaseStatus: config.PhaseStatus,
                ConfirmStatus: config.ConfirmStatus,
                BoardStatus: config.BoardStatus
            }
        });
    },

    /**
     * Handles keyboard events for the Scoreboard
     * @param {KeyEvent} ev 
     */
    onKeyUp(ev) {
        switch(ev.keyCode) {
            //toggle jam clock
            case keycodes.SPACEBAR :
            case keycodes.ENTER :
                ScoreboardController.ToggleJamClock();
            break;

            //toggle break clock
            //call official timeout
            case keycodes.UP :
                if(ev.ctrlKey) {
                    ScoreboardController.OfficialTimeout();
                } else {
                    ScoreboardController.ToggleGameClock();
                }
            break;

            //toggle break clock
            //call injury timeout
            case keycodes.DOWN :
                if(ev.ctrlKey) {
                    ScoreboardController.InjuryTimeout();
                } else {
                    ScoreboardController.ToggleBreakClock();
                }
            break;

            //increase / decrease left-side score
            case keycodes.LEFT :
                if(ev.shiftKey) {
                    ScoreboardController.DecreaseTeamScore(ScoreboardController.getState().TeamA, 1);
                } else {
                    ScoreboardController.IncreaseTeamScore(ScoreboardController.getState().TeamA, 1);
                }
            break;

            //toggle left-side jammer status
            case keycodes.Q :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamA, vars.Team.Status.PowerJam)
                else
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamA, vars.Team.Status.LeadJammer)
            break;

            //toggle left-side timeout / challenge status
            case keycodes.OPENBRACKET :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamA, vars.Team.Status.Challenge)
                else
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamA, vars.Team.Status.Timeout)
            break;

            //increase / decrease right-side score
            case keycodes.RIGHT :
                if(ev.shiftKey) {
                    ScoreboardController.DecreaseTeamScore(ScoreboardController.getState().TeamB, 1);
                } else {
                    ScoreboardController.IncreaseTeamScore(ScoreboardController.getState().TeamB, 1);
                }
            break;

            //toggle right-side jammer status
            case keycodes.W :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamB, vars.Team.Status.PowerJam)
                else
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamB, vars.Team.Status.LeadJammer)
            break;

            //toggle right-side timeout / challenge status
            case keycodes.CLOSEBRACKET :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamB, vars.Team.Status.Challenge)
                else
                    ScoreboardController.SetTeamStatus(ScoreboardController.getState().TeamB, vars.Team.Status.Timeout)
            break;

            case keycodes.A :
                ScoreboardController.ToggleConfirm();
            break;

            case keycodes.ADD :
            case keycodes.EQUAL :
                ScoreboardController.IncreaseJamCounter(1);
            break;

            case keycodes.SUBTRACT :
            case keycodes.DASH :
                ScoreboardController.DecreaseJamCounter(1);
            break;

            case keycodes.P :
                ScoreboardController.IncreasePhase();
            break;

            case keycodes.U :
                ScoreboardController.IncreaseJamCounter(1);
            break;

            case keycodes.I :
                ScoreboardController.DecreaseJamCounter(1);
            break;

            default :

            break;
        }
    },

    onMidiButtonPressed(button, controller) {
        //console.log(MidiControllers[controller.Name][button]);
        if(MidiControllers[controller.Name] && MidiControllers[controller.Name][button]) {
            MidiControllers[controller.Name][button]();
        }
    },

    /**
     * Gets the store.
     */
    getStore() {
        return ScoreboardStore;
    },

    /**
     * Gets the current state.
     */
    getState() {
        return ScoreboardController.getStore().getState();
    },

    /**
     * Subscribes to the store changes, and returns a function to unsubscribe.
     * @param {Function} f 
     */
    subscribe(f) {
        return ScoreboardController.getStore().subscribe(f);
    },

    /**
     * Builds the API for the scoreboard
     */
    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/scoreboard(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(ScoreboardController.getState())));
            res.end();
        });
    }
}

export default ScoreboardController;