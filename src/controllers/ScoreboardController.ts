/**
 * Scoreboard Controller
 */

import {createStore, Unsubscribe} from 'redux';
import DataController from 'controllers/DataController'
import vars, { PhaseRecord } from 'tools/vars'
import keycodes from 'tools/keycodes'
import RosterController from './RosterController';
import { IGamepadButtonMap, IGamepadAxes } from './GameController';

export enum Actions {
    SET_STATE,
    RESET_STATE,
    RESET_JAM,
    TOGGLE_JAM_CLOCK,
    TOGGLE_GAME_CLOCK,
    TOGGLE_BREAK_CLOCK,
    TOGGLE_CONFIRM,
    SET_BOARD_STATUS,
    SET_OFFICIAL_TIMEOUT,
    SET_INJURY_TIMEOUT,
    SET_PHASES,
    SET_PHASE,
    SET_PHASE_TIME,
    SET_JAM_COUNTER,
    SET_GAME_TIME,
    COPY_PHASE_TIME,
    SET_TEAM,
    SET_TEAMS,
    SET_TEAM_COLOR,
    SET_TEAM_CHALLENGES,
    SET_TEAM_JAMPOINTS,
    SET_TEAM_SCORE,
    SET_TEAM_TIMEOUTS,
    SET_TEAM_NAME,
    SET_TEAM_STATUS
}

export interface SScoreboardTeam {
    /**
     * A = Left, B = Right
     */
    Side:string;
    /**
     * RecordID of assigned team
     */
    ID:number;
    /**
     * Current score
     */
    Score:number;
    /**
     * Remaining timeouts
     */
    Timeouts:number;
    /**
     * Remaining challenges
     */
    Challenges:number;
    /**
     * Jam points
     */
    JamPoints:number;
    /**
     * Status value (timeout, challenge, lead jammer, power jam, injury)
     */
    Status:number;
    /**
     * Color of score background
     */
    Color:string;
    /**
     * Team name
     */
    Name:string;
    /**
     * Logo for main scoreboard
     */
    Thumbnail:string;
    /**
     * Logo for score banner
     */
    ScoreboardThumbnail:string;
}

export interface SScoreboardState {
    /**
     * State's record ID (to be implemented at a later date)
     */
    ID:number;
    /**
     * Current jam #
     */
    JamCounter:number;
    /**
     * Hours of the jam clock
     */
    JamHour:number;
    /**
     * Minutes on the jam clock
     */
    JamMinute:number;
    /**
     * Seconds on the jam clock
     */
    JamSecond:number;
    /**
     * Status of the jam clock
     */
    JamState:number;
    /**
     * Hours on the game clock
     */
    GameHour:number;
    /**
     * Minutes on the game clock
     */
    GameMinute:number;
    /**
     * Seconds on the game clock
     */
    GameSecond:number;
    /**
     * Status of the game clock
     */
    GameState:number;
    /**
     * Hours on the break clock
     */
    BreakHour:number;
    /**
     * Minutes on the break clock
     */
    BreakMinute:number;
    /**
     * Seconds on the break clock
     */
    BreakSecond:number;
    /**
     * Status of the break clock
     */
    BreakState:number;
    /**
     * Current phase/quarter
     */
    PhaseID:number;
    /**
     * Name of quarter
     */
    PhaseName:string;
    /**
     * Index of quarter (for cycling through quarters)
     */
    PhaseIndex:number;
    /**
     * Hours of the selected phase
     * (does not reflect game clock)
     */
    PhaseHour:number;
    /**
     * Minutes of the selected phase
     */
    PhaseMinute:number;
    /**
     * Seconds of the selected phase
     */
    PhaseSecond:number;
    /**
     * Board status (official timeouts, injury, upheld, under review, etc)
     */
    BoardStatus:number;
    /**
     * Determines if elements for confirming changes to the scoreboard
     * are displayed to the referees
     */
    ConfirmStatus:number;
    /**
     * Left side team
     */
    TeamA:SScoreboardTeam;
    /**
     * Right side team
     */
    TeamB:SScoreboardTeam;
    /**
     * Hour of the game clock when the last jam started
     */
    StartGameHour:number;
    /**
     * Minute of the game clock when the last jam started
     */
    StartGameMinute:number;
    /**
     * Second of the game clock when the last jam started
     */
    StartGameSecond:number;
    /**
     * Maximum number of challenges per team
     */
    MaxChallenges:number;
    /**
     * Maximum number of timeouts per team
     */
    MaxTimeouts:number;
    /**
     * Maximum seconds on the break clock
     */
    MaxBreakSeconds:number;
    /**
     * Maximum seconds on the jam clock
     */
    MaxJamSeconds:number;
    /**
     * Maximum seconds for a team challenge
     */
    MaxChallengeSeconds:number;
    /**
     * Maximum seconds for a team timeout
     */
    MaxTimeoutSeconds:number;
    /**
     * Determines how the jam clock changes between steps:
     * true (default) = Ready > Jam > Stopped > Ready > Jam ...
     * false = Ready > Jam > Ready > Jam ...
     */
    JamChangeMode:boolean;
}

export const InitState:SScoreboardState = {
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
        ID:1,
        Score:0,
        Timeouts:2,
        Challenges:1,
        JamPoints:0,
        Status:vars.Team.Status.Normal,
        Color:"#990000",
        Name:"Team A",
        Thumbnail:"default/TeamA.jpg",
        ScoreboardThumbnail:"default/TeamAScoreboard.png"
    },
    TeamB:{
        Side:'B',
        ID:2,
        Score:0,
        Timeouts:2,
        Challenges:1,
        JamPoints:0,
        Status:vars.Team.Status.Normal,
        Color:"#000099",
        Name:"Team B",
        Thumbnail:"default/TeamB.jpg",
        ScoreboardThumbnail:"default/TeamBScoreboard.png"
    },
    StartGameHour:0,
    StartGameMinute:0,
    StartGameSecond:0,
    MaxChallenges:1,
    MaxTimeouts:2,
    MaxBreakSeconds:30,
    MaxJamSeconds:60,
    MaxChallengeSeconds:60,
    MaxTimeoutSeconds:60,
    JamChangeMode:false
}

/**
 * Reducer for the scoreboard ScoreboardController.
 * @param {Object} state 
 * @param {object} action 
 */
function ControllerReducer(state:SScoreboardState = InitState, action) {
    switch(action.type) {
        case Actions.SET_STATE : {
            let maxTimeouts:number = state.MaxTimeouts;
            let maxChallenges:number = state.MaxChallenges;

            let obj:SScoreboardState = Object.assign({}, state, action.state, {
                TeamA:Object.assign({}, state.TeamA),
                TeamB:Object.assign({}, state.TeamB)
            });

            if(!Number.isNaN(action.state.MaxTimeouts))
                maxTimeouts = action.state.MaxTimeouts;

            if(!Number.isNaN(action.state.MaxChallenges))
                maxChallenges = action.state.MaxChallenges;

            if(state.JamState == vars.Clock.Status.Ready) {
                obj.JamSecond = obj.MaxJamSeconds;
            }

            if(action.state.TeamA)
                obj.TeamA = Object.assign(obj.TeamA, action.state.TeamA);
            if(action.state.TeamB)
                obj.TeamB = Object.assign(obj.TeamB, action.state.TeamB);

            if(obj.TeamA.Timeouts > maxTimeouts)
                obj.TeamA.Timeouts = maxTimeouts;

            if(obj.TeamA.Challenges > maxChallenges)
                obj.TeamA.Challenges = maxChallenges;

            if(obj.TeamB.Timeouts > maxTimeouts)
                obj.TeamB.Timeouts = maxTimeouts;

            if(obj.TeamB.Challenges > maxChallenges)
                obj.TeamB.Challenges = maxChallenges;

            return obj;
        }

        //reset the state
        case Actions.RESET_STATE : {
            //ignore reset if game/jam clock is running
            if(state.JamState === vars.Clock.Status.Running || state.GameState === vars.Clock.Status.Running)
                return state;

            let phases:Array<PhaseRecord> = DataController.getPhases();
            let phase:any = {
                PhaseID:0,
                PhaseName:"DERBY!",
                PhaseIndex:0,
                PhaseHour:0,
                PhaseMinute:0,
                PhaseSecond:0
            };
            let index:number = phases.findIndex((p) => {
                return (p.PhaseQtr >= 1);
            });

            let maxJamSeconds:number = state.MaxJamSeconds;
            if(action.MaxJamSeconds && !Number.isNaN(action.MaxJamSeconds))
                maxJamSeconds = action.MaxJamSeconds;

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
            return Object.assign({}, InitState, {
                JamSecond:maxJamSeconds,
                MaxJamSeconds:maxJamSeconds,
                MaxBreakSeconds:state.MaxBreakSeconds,
                MaxTimeouts:state.MaxTimeouts,
                MaxChallenges:state.MaxChallenges,
                MaxTimeoutSeconds:state.MaxTimeoutSeconds,
                MaxChallengeSeconds:state.MaxChallengeSeconds,
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
                    Timeouts:state.MaxTimeouts,
                    Challenges:state.MaxChallenges,
                    JamPoints:0,
                    Status:0
                }),
                TeamB:Object.assign({}, state.TeamB, {
                    Score:0,
                    Timeouts:state.MaxTimeouts,
                    Challenges:state.MaxChallenges,
                    JamPoints:0,
                    Status:0
                })
            });
        }
        break;

        //calls an official timeout
        case Actions.SET_OFFICIAL_TIMEOUT :
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
        case Actions.SET_INJURY_TIMEOUT :
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
        case Actions.TOGGLE_JAM_CLOCK : {
            if(state.JamChangeMode) {

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
                            JamSecond:state.MaxJamSeconds,
                            JamState:vars.Clock.Status.Running,
                            GameState:vars.Clock.Status.Running,
                            BreakState:vars.Clock.Status.Ready,
                            BoardStatus:vars.Scoreboard.Status.Normal,
                            BreakSecond:state.MaxBreakSeconds,
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
                            BreakSecond:state.MaxBreakSeconds
                        });
    
                    //reset jam clock, board status, and team status
                    case vars.Clock.Status.Stopped :
                        return Object.assign({}, state, {
                            JamState:vars.Clock.Status.Ready,
                            JamSecond:state.MaxJamSeconds,
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
            } else {

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
                            JamSecond:state.MaxJamSeconds,
                            GameState:vars.Clock.Status.Running,
                            BreakState:vars.Clock.Status.Ready,
                            BoardStatus:vars.Scoreboard.Status.Normal,
                            BreakSecond:state.MaxBreakSeconds,
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
                    case vars.Clock.Status.Stopped :
                        return Object.assign({}, state, {
                            JamState:vars.Clock.Status.Ready,
                            JamSecond:state.MaxJamSeconds,
                            BreakState:vars.Clock.Status.Running,
                            BreakSecond:state.MaxBreakSeconds,
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
            }
        } //end toggle_jam_clock

        //toggles the game clock
        case Actions.TOGGLE_GAME_CLOCK :
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

        case Actions.TOGGLE_BREAK_CLOCK :
            if(state.JamState === vars.Clock.Status.Running)
                return state;
            switch(state.BreakState) {
                case vars.Clock.Status.Stopped :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Ready,
                        BreakSecond:state.MaxBreakSeconds
                    });
                case vars.Clock.Status.Ready :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Running
                    });
                case vars.Clock.Status.Running :
                    return Object.assign({}, state, {
                        BreakState:vars.Clock.Status.Ready,
                        BreakSecond:state.MaxBreakSeconds
                    });
                default :
                    return state;
            }

        //sets the game clock time
        case Actions.SET_GAME_TIME : {
            return Object.assign({}, state, {
                GameHour:action.hour,
                GameMinute:action.minute,
                GameSecond:action.second
            });
        }

        //sets the game clock time to match the phase time
        case Actions.COPY_PHASE_TIME :
            if(state.GameState === vars.Clock.Status.Running || state.JamState === vars.Clock.Status.Running)
                return state;

            return Object.assign({}, state, {
                GameHour:state.PhaseHour,
                GameMinute:state.PhaseMinute,
                GameSecond:state.PhaseSecond
            });
            
        case Actions.SET_BOARD_STATUS :
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

        case Actions.TOGGLE_CONFIRM :
            return Object.assign({}, state, {
                ConfirmStatus:(state.ConfirmStatus) ? 0 : 1
            });

        case Actions.SET_PHASE :
            var duration = [0,0,0];
            var name:any = "";
            var id:any = 0;
            var Phases = DataController.getState().Phases;
            if(Phases[action.index]) {
                duration = Phases[action.index].Duration;
                name = Phases[action.index].Name;
                id = Phases[action.index].RecordID;
            }

            if(typeof(duration[0]) === "string")
                duration[0] = parseInt(duration[0]);

            if(typeof(duration[1]) === "string")
                duration[1] = parseInt(duration[1]);

            if(typeof(duration[2]) === "string")
                duration[2] = parseInt(duration[2]);
                
            return Object.assign({}, state, {
                PhaseIndex:action.index,
                PhaseID:id,
                PhaseName:name,
                PhaseHour:duration[0],
                PhaseMinute:duration[1],
                PhaseSecond:duration[2]
            });

        case Actions.SET_PHASE_TIME :
            return Object.assign({}, state, {
                PhaseHour:parseInt(action.hour),
                PhaseMinute:parseInt(action.minute),
                PhaseSecond:parseInt(action.second)
            });

        case Actions.SET_PHASES :
            return Object.assign({}, state, {
                Phases:action.records
            });

        case Actions.SET_JAM_COUNTER :
            var amount = action.amount;
            if(amount < 0)
                amount = 0;
            return Object.assign({}, state, {
                JamCounter:amount
            });

        /* Team Actions */
        case Actions.SET_TEAM :
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
        case Actions.SET_TEAMS :
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

        case Actions.SET_TEAM_COLOR :
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

        case Actions.SET_TEAM_NAME :
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

        case Actions.SET_TEAM_SCORE :
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

        case Actions.SET_TEAM_JAMPOINTS :
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

        case Actions.SET_TEAM_TIMEOUTS : {
            let amount = action.amount;
            if(amount > state.MaxTimeouts)
                amount = state.MaxTimeouts;
            else if(amount < 0)
                amount = 0;
            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Timeouts:amount
                });
                return Object.assign({}, state, {
                    TeamA:team
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Timeouts:amount
                });
                return Object.assign({}, state, {
                    TeamB:team
                });
            }
        }

        case Actions.SET_TEAM_CHALLENGES : {
            let amount = action.amount;
            if(amount > state.MaxChallenges)
                amount = state.MaxChallenges;
            else if(amount < 0)
                amount = 0;
            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Challenges:amount
                });
                return Object.assign({}, state, {
                    TeamA:team
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Challenges:amount
                });
                return Object.assign({}, state, {
                    TeamB:team
                });
            }
        }

        //Sets the team status
        //The status is toggled between teams, as no two teams
        //can have the same status
        case Actions.SET_TEAM_STATUS : {
            let status = action.value;
            if(state.JamState === vars.Clock.Status.Running) {
                if(status !== vars.Team.Status.PowerJam && status !== vars.Team.Status.LeadJammer) {
                    return state;
                }
            }

            if(Object.is(action.Team, state.TeamA)) {
                let team = Object.assign({}, state.TeamA, {
                    Status:(action.value === state.TeamA.Status) ? vars.Team.Status.Normal : status
                });
                let bseconds = state.MaxBreakSeconds;
                if(team.Status == vars.Team.Status.Timeout || team.Status == vars.Team.Status.Challenge)
                    bseconds = state.MaxTimeoutSeconds;
                return Object.assign({}, state, {
                    BreakSecond:bseconds,
                    TeamA:team,
                    TeamB:Object.assign({}, state.TeamB, {
                        Status:vars.Team.Status.Normal
                    })
                });
            } else {
                let team = Object.assign({}, state.TeamB, {
                    Status:(action.value === state.TeamB.Status) ? vars.Team.Status.Normal : status
                });
                let bseconds = state.MaxBreakSeconds;
                if(team.Status == vars.Team.Status.Timeout || team.Status == vars.Team.Status.Challenge)
                    bseconds = state.MaxTimeoutSeconds;
                return Object.assign({}, state, {
                    BreakSecond:bseconds,
                    TeamB:team,
                    TeamA:Object.assign({}, state.TeamA, {
                        Status:vars.Team.Status.Normal
                    })
                });
            }
        }

        case Actions.RESET_JAM :
            return Object.assign({}, state, {
                GameHour:state.StartGameHour,
                GameMinute:state.StartGameMinute,
                GameSecond:state.StartGameSecond,
                GameState:vars.Clock.Status.Stopped,
                JamState:vars.Clock.Status.Ready,
                BreakState:vars.Clock.Status.Ready,
                JamHour:InitState.JamHour,
                JamMinute:InitState.JamMinute,
                JamSecond:state.MaxJamSeconds
            });

        default :
            return state;
    }
}

const ScoreboardStore = createStore(ControllerReducer);

/**
 * Updates the scoreboard state to match the configuration
 * - MaxJamSeconds is ignored until there is a board reset
 */
const updateData = async function() {
    let data:any = DataController.GetMiscRecord('ScoreboardConfig');
    if(data !== null && data !== undefined) {
        data = Object.assign({}, data);
        if(data.MaxJamSeconds !== undefined)
            delete data.MaxJamSeconds;
        let state = ScoreboardController.getState();
        let compare = {
            MaxBreakSeconds:state.MaxBreakSeconds,
            //MaxJamSeconds:state.MaxJamSeconds,
            MaxTimeouts:state.MaxTimeouts,
            MaxChallenges:state.MaxChallenges,
            MaxTimeoutSeconds:state.MaxTimeoutSeconds,
            MaxChallengeSeconds:state.MaxChallengeSeconds,
            JamChangeMode:state.JamChangeMode
        };

        if(!DataController.compare(data, compare)) {
            ScoreboardController.SetState(data);
        }
    }
};

let remoteData:Function|null = null;

const ScoreboardController = {
    Key:'SB',
    /**
     * Initialize the scoreboard controller
     * - Start listeners
     */
    Init() {
        remoteData = DataController.subscribe(updateData);
        updateData();
        let data:any = DataController.GetMiscRecord('ScoreboardConfig');
        if(data && !Number.isNaN(data.MaxJamSeconds)) {
            ScoreboardController.SetState({MaxJamSeconds:data.MaxJamSeconds});
        }
    },

    /**
     * Sets the state of the scoreboard.
     * @param {Object} state 
     */
    async SetState(state) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:state
        });
    },

    /**
     * Toggles the jam clock
     */
    async ToggleJamClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.TOGGLE_JAM_CLOCK
        });
    },

    /**
     * Starts the jam clock, game clock, and stops the break clock.
     */
    async StartJamClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
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
    async StopJamClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                JamState:vars.Clock.Status.Stopped,
                BreakState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Toggles the game clock
     */
    async ToggleGameClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.TOGGLE_GAME_CLOCK
        });
    },

    /**
     * Starts the game clock
     */
    async StartGameClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                ClockState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Stops the game clock.
     */
    async StopGameClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                GameState:vars.Clock.Status.Stopped
            }
        })
    },

    /**
     * Stops the game and break clock at the same time.
     */
    async StopBreakGameClock() {
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.getStore().dispatch({
                type:Actions.SET_STATE,
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
    async ToggleBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.TOGGLE_BREAK_CLOCK
        });
    },

    /**
     * Starts the break clock
     */
    async StartBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                BreakState:vars.Clock.Status.Running
            }
        });
    },

    /**
     * Stops the break clock
     */
    async StopBreakClock() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                BreakState:vars.Clock.Status.Ready
            }
        });
    },

    /**
     * Toggles the confirm status
     */
    async ToggleConfirm() {
        ScoreboardController.getStore().dispatch({
            type:Actions.TOGGLE_CONFIRM
        });
    },

    /**
     * Resets all values on the board.
     */
    async Reset() {
        let data:any = DataController.GetMiscRecord('ScoreboardConfig');
        let seconds:number = ScoreboardController.getState().MaxJamSeconds;
        if(data && data.MaxJamSeconds && !Number.isNaN(data.MaxJamSeconds))
            seconds = data.MaxJamSeconds;
        ScoreboardController.getStore().dispatch({
            type:Actions.RESET_STATE,
            MaxJamSeconds:seconds
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
            type:Actions.SET_GAME_TIME,
            hour:hour,
            minute:minute,
            second:second
        });
    },

    /**
     * Sets the game time
     */
    async CopyGameTime() {
        ScoreboardController.getStore().dispatch({
            type:Actions.COPY_PHASE_TIME
        });
    },

    /**
     * Sets the seconds on the break clock.
     * @param {Number} second Seconds on the break clock
     */
    async SetBreakTime(second) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
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
     * @param minute
     */
    async SetJamTime(second:number, minute:number) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
            state:{
                JamHour:0,
                JamMinute:minute,
                JamSecond:second
            }
        });
    },

    /**
     * Sets the board status, such as official timeout
     * @param {Number} value 
     */
    async SetBoardStatus(value) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_BOARD_STATUS,
            BoardStatus:value
        });
    },

    /**
     * Sets the phase / quarter
     * @param {Number} index 
     */
    async SetPhase(index:number) {
        var Phases = DataController.getState().Phases;
        if(index < 0)
            index = Phases.length - 1;
        else if(index >= Phases.length)
            index = 0;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_PHASE,
            index:index
        });
    },

    /**
     * Sets the phase time. (This does not change the game clock time.)
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     */
    async SetPhaseTime(hour, minute, second) {
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
            type:Actions.SET_PHASE_TIME,
            hour:hour,
            minute:minute,
            second:second
        });
    },

    /**
     * Move to the next phase
     */
    async IncreasePhase() {
        ScoreboardController.SetPhase(ScoreboardController.getState().PhaseIndex + 1);
    },

    /**
     * Move to the previous phase
     */
    async DecreasePhase() {
        ScoreboardController.SetPhase(ScoreboardController.getState().PhaseIndex - 1);
    },

    /**
     * Sets the Jam Counter / #
     * @param {Number} amount 
     */
    async SetJamCounter(amount) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_JAM_COUNTER,
            amount:amount
        });
    },

    /**
     * Increases the Jam Counter
     * @param {Number} amount 
     */
    async IncreaseJamCounter(amount) {
        ScoreboardController.SetJamCounter(ScoreboardController.getState().JamCounter + amount);
    },

    /**
     * Decreases the Jam Counter
     * @param {Number} amount 
     */
    async DecreaseJamCounter(amount) {
        ScoreboardController.SetJamCounter(ScoreboardController.getState().JamCounter - amount);
    },

    /**
     * Changes the given currentTeam to the new team.
     * @param {Object} currentTeam 
     * @param {Object} nextTeam 
     */
    async SetTeam(currentTeam, nextTeam) {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM,
            current:currentTeam,
            nextTeam:nextTeam
        });
    },

    /**
     * Sets both teams of the scoreboard.
     * @param {SScoreboardTeam} a 
     * @param {SScoreboardTeam} b 
     * @param {Boolean} reset
     * @param {Boolean} resetRoster
     */
    async SetTeams(a:SScoreboardTeam, b:SScoreboardTeam, reset:boolean = false, resetRoster:boolean = false) {
        if(a === null || typeof(a) !== "object" || b === null || typeof(b) !== "object")
            return;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAMS,
            TeamA:a,
            TeamB:b,
            Reset:reset
        });
        if(reset)
            ScoreboardController.Reset();
        if(resetRoster)
            RosterController.LoadSkaters();
    },

    /**
     * Sets the given team's score
     * @param {Object} team 
     * @param {Number} amount 
     * @param {Number} jampoints
     */
    async SetTeamScore(side:string, amount:number, jampoints?:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        if(amount < 0)
            amount = 0;
        else if(amount > 999)
            amount = 999;

        if(typeof(jampoints) === "number") {
            ScoreboardController.getStore().dispatch({
                type:Actions.SET_TEAM_SCORE,
                Team:team,
                amount:amount,
                jampoints:team.JamPoints + jampoints
            });
        } else {
            ScoreboardController.getStore().dispatch({
                type:Actions.SET_TEAM_SCORE,
                Team:team,
                amount:amount
            });
        }
    },

    /**
     * Sets the given team's timeouts
     * @param side
     * @param amount 
     */
    async SetTeamTimeouts(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_TIMEOUTS,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the given team's Challenges
     * @param side
     * @param amount 
     */
    async SetTeamChallenges(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_CHALLENGES,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the number of jam points for the given team.
     * @param side 
     * @param amount 
     */
    async SetTeamJamPoints(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        if(amount < -99)
            amount = 99;
        else if(amount > 99)
            amount = 99;

        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_JAMPOINTS,
            Team:team,
            amount:amount
        });
    },

    /**
     * Sets the given team's status.
     * @param side
     * @param status 
     */
    async SetTeamStatus(side:string, status:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_STATUS,
            Team:team,
            value:status
        });
    },

    /**
     * Changes the name of the given team on the scoreboard.
     * @param side The team to change
     * @param name The new name
     */
    async SetTeamName(side:string, name:string) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_NAME,
            Team:team,
            Name:name
        });
    },

    /**
     * Sets the team's color.
     * @param side
     * @param color 
     */
    async SetTeamColor(side:string, color:string) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_TEAM_COLOR,
            Team:team,
            Color:color
        });
    },

    /**
     * Increases the team's score by the given amount.
     * @param side 
     * @param amount 
     */
    async IncreaseTeamScore(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.SetTeamScore(side, team.Score + amount, amount);
        } else {
            ScoreboardController.SetTeamScore(side, team.Score + amount, 0);
        }
    },

    /**
     * Decreases the team's score by the given amount
     * @param side 
     * @param amount
     */
    async DecreaseTeamScore(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        if(ScoreboardController.getState().JamState !== vars.Clock.Status.Running) {
            ScoreboardController.SetTeamScore(side, team.Score - amount, amount * -1);
        } else {
            ScoreboardController.SetTeamScore(side, team.Score - amount, 0);
        }
    },

    /**
     * Increases the team's jam points
     * @param side
     * @param amount 
     */
    async IncreaseTeamJamPoints(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamJamPoints(side, team.JamPoints + amount);
    },

    /**
     * Decreases the team's jam points
     * @param side
     * @param amount 
     */
    async DecreaseTeamJamPoints(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamJamPoints(side, team.JamPoints - amount);
    },

    /**
     * Increases the team's challenges
     * @param side
     * @param amount
     */
    async IncreaseTeamChallenges(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamChallenges(side, team.Challenges + amount);
    },

    /**
     * Decreases the team's challenges
     * @param side
     * @param amount
     */
    async DecreaseTeamChallenges(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamChallenges(side, team.Challenges - amount);
    },

    /**
     * Increases the team's timeouts.
     * @param side
     * @param amount
     */
    async IncreaseTeamTimeouts(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamTimeouts(side, team.Timeouts + amount);
    },

    /**
     * Decreases the team's timeouts.
     * @param side
     * @param amount 
     */
    async DecreaseTeamTimeouts(side:string, amount:number) {
        let team = (side === 'A') ? ScoreboardController.getState().TeamA : ScoreboardController.getState().TeamB;
        ScoreboardController.SetTeamTimeouts(side, team.Timeouts - amount);
    },

    /**
     * Calls an official timeout
     */
    async OfficialTimeout() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_OFFICIAL_TIMEOUT
        });
    },

    /**
     * Calls an injury timeout.
     */
    async InjuryTimeout() {
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_INJURY_TIMEOUT
        });
    },

    /**
     * Resets the jam to the previous 
     */
    async ResetJam() {
        ScoreboardController.getStore().dispatch({
            type:Actions.RESET_JAM
        });
    },

    /**
     * Applies the given configuration options against the state of the scoreboard.
     * @param {Object} config 
     */
    async ApplyConfig(config) {
        if(config === null || typeof(config) !== "object")
            return;

        var teamA = DataController.getTeam(config.TeamA.ID);
        var teamB = DataController.getTeam(config.TeamB.ID);
        ScoreboardController.getStore().dispatch({
            type:Actions.SET_STATE,
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
    async onKeyUp(ev) {
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
                    ScoreboardController.DecreaseTeamScore('A', 1);
                } else {
                    ScoreboardController.IncreaseTeamScore('A', 1);
                }
            break;

            //toggle left-side jammer status
            case keycodes.Q :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus('A', vars.Team.Status.PowerJam)
                else
                    ScoreboardController.SetTeamStatus('A', vars.Team.Status.LeadJammer)
            break;

            //toggle left-side timeout / challenge status
            case keycodes.OPENBRACKET :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus('A', vars.Team.Status.Challenge)
                else
                    ScoreboardController.SetTeamStatus('A', vars.Team.Status.Timeout)
            break;

            //increase / decrease right-side score
            case keycodes.RIGHT :
                if(ev.shiftKey) {
                    ScoreboardController.DecreaseTeamScore('B', 1);
                } else {
                    ScoreboardController.IncreaseTeamScore('B', 1);
                }
            break;

            //toggle right-side jammer status
            case keycodes.W :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus('B', vars.Team.Status.PowerJam)
                else
                    ScoreboardController.SetTeamStatus('B', vars.Team.Status.LeadJammer)
            break;

            //toggle right-side timeout / challenge status
            case keycodes.CLOSEBRACKET :
                if(ev.shiftKey)
                    ScoreboardController.SetTeamStatus('B', vars.Team.Status.Challenge)
                else
                    ScoreboardController.SetTeamStatus('B', vars.Team.Status.Timeout)
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

            default :

            break;
        }
    },

    /**
     * Triggered when the user presses a button on a connected GamePad
     * @param button GameButton
     */
    async onGamepadButtonPress(buttons:IGamepadButtonMap) {
        let state = ScoreboardController.getState();
        //X
        if(buttons.X.pressed) {
            if(buttons.L2.pressed && buttons.R2.pressed) {
                ScoreboardController.ResetJam();
            } else {
                ScoreboardController.ToggleJamClock();
            }
            return;
        }

        //RESET
        if(buttons.SELECT.pressed 
            && buttons.START.pressed 
            && buttons.L2.pressed 
            && buttons.R2.pressed
            && buttons.L1.pressed
            && buttons.R1.pressed
            ) {
            ScoreboardController.Reset();
            return;
        }

        //Y
        if(buttons.Y.pressed) {
            
            return;
        }

        //UP - Game Clock / Official Timeout
        if(buttons.UP.pressed) {
            if(buttons.R2.pressed) {
                ScoreboardController.OfficialTimeout();
            } else {
                ScoreboardController.ToggleGameClock();
            }
            return;
        }

        //DOWN - Break Clock / Injury Timeout
        if(buttons.DOWN.pressed) {
            if(buttons.R2.pressed) {
                ScoreboardController.InjuryTimeout();
            } else {
                ScoreboardController.ToggleBreakClock();
            }

            return;
        }

        //LEFT 
        if(buttons.LEFT.pressed) {
            if(buttons.L2.pressed) {
                ScoreboardController.DecreaseJamCounter(1);
            } else if(buttons.R2.pressed) {
                ScoreboardController.DecreaseTeamScore('A', 1);
            } else {
                ScoreboardController.IncreaseTeamScore('A', 1);
            }

            return;
        }

        //RIGHT 
        if(buttons.RIGHT.pressed) {
            if(buttons.L2.pressed) {
                ScoreboardController.IncreaseJamCounter(1);
            } else if(buttons.R2.pressed) {
                ScoreboardController.DecreaseTeamScore('B', 1);
            } else {
                ScoreboardController.IncreaseTeamScore('B', 1);
            }

            return;
        }

        //L1
        if(buttons.L1.pressed) {
            if(buttons.R2.pressed)
                ScoreboardController.SetTeamStatus('A', vars.Team.Status.PowerJam);
            else
                ScoreboardController.SetTeamStatus('A', vars.Team.Status.LeadJammer);
            return;
        }

        //R1
        if(buttons.R1.pressed) {
            if(buttons.R2.pressed)
                ScoreboardController.SetTeamStatus('B', vars.Team.Status.PowerJam);
            else
                ScoreboardController.SetTeamStatus('B', vars.Team.Status.LeadJammer);
            return;
        }

        //A
        if(buttons.A.pressed) {
            ScoreboardController.ToggleConfirm();
            return;
        }

        //SELECT
        if(buttons.SELECT.pressed) {
            if(buttons.L2.pressed && buttons.R2.pressed) {
                ScoreboardController.CopyGameTime();
            } else if(buttons.R2.pressed) {
                ScoreboardController.DecreasePhase();
            } else {
                ScoreboardController.IncreasePhase();
            }
            return;
        }

        //START
        if(buttons.START.pressed) {
            if(buttons.L2.pressed && buttons.R2.pressed) {
                ScoreboardController.ResetJam();
            }
            return;
        }
    },

    /**
     * Triggered when the user holds a button down
     * @param buttons IGamepadButtonMap
     */
    async onGamepadButtonDown(buttons:IGamepadButtonMap) {
        let state = ScoreboardController.getState();
        //LEFT
        if(buttons.LEFT.pressed && buttons.LEFT.frames%12 === 0) {
            if(buttons.L2.pressed) {
                ScoreboardController.DecreaseJamCounter(1);
            } else if(buttons.R2.pressed) {
                ScoreboardController.DecreaseTeamScore('A', 1);
            } else {
                ScoreboardController.IncreaseTeamScore('A', 1);
            }
            return;
        }

        //RIGHT
        if(buttons.RIGHT.pressed && buttons.RIGHT.frames%12 === 0) {
            if(buttons.L2.pressed) {
                ScoreboardController.IncreaseJamCounter(1);
            } else if(buttons.R2.pressed) {
                ScoreboardController.DecreaseTeamScore('B', 1);
            } else {
                ScoreboardController.IncreaseTeamScore('B', 1);
            }
            return;
        }
    },

    /**
     * Triggered when the user releases a button on the gamepad
     * @param buttons IGamepadButtonMap
     */
    async onGamepadButtonUp(buttons:IGamepadButtonMap) {

    },

    /**
     * Triggered when the connected game controller's axes have moved
     * @param axes IGamepadAxes
     */
    async onGamepadAxis(axes:IGamepadAxes) {

    },

    /**
     * Gets the configuration for this controller
     * - MaxBreakSeconds = Maximum # of seconds on the break clock
     * - MaxJamSeconds = Maximum # of seconds on the jam clock
     * - MaxChallenges = Max # of challenges per team (per half)
     * - MaxTimeouts = Max # of timeouts per team (per half)
     * - JamChangeMode = true/false
     */
    getConfig() {
        let config:any = DataController.GetMiscRecord('ScoreboardConfig');
        return Object.assign({
            MaxBreakSeconds:30,
            MaxJamSeconds:60,
            MaxChallenges:1,
            MaxTimeouts:2,
            MaxTimeoutSeconds:60,
            MaxChallengeSeconds:60,
            JamChangeMode:false
        }, config);
    },

    /**
     * 
     * @param settings 
     */
    async saveConfig(settings:any) : Promise<boolean> {
        let config:any = Object.assign(ScoreboardController.getConfig(), settings);
        console.log('saving...')
        return DataController.SaveMiscRecord('ScoreboardConfig', config);
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
    subscribe(f) : Unsubscribe {
        return ScoreboardController.getStore().subscribe(f);
    },

    /**
     * Builds the API for the scoreboard
     */
    async buildAPI() {
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