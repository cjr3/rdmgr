/**
 * Scoreboard Controller
 */
import DataController from 'controllers/DataController'
import vars, { PhaseRecord, TeamRecord } from 'tools/vars'
import keycodes from 'tools/keycodes'
import RosterController from './RosterController';
import { IGamepadButtonMap, IGamepadAxes } from './GameController';
import PhasesController from 'controllers/PhasesController';

import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import TeamsController from './TeamsController';
import { PrepareObjectForSending, Compare } from './functions';

export type Sides = 'A' | 'B';

interface IScoreboardController extends IController {
    ToggleJamClock:Function;
    StartJamClock:Function;
    StopJamClock:Function;
    ToggleGameClock:Function;
    StartGameClock:Function;
    StopGameClock:Function;
    StopBreakGameClock:Function;
    ToggleBreakClock:Function;
    StartBreakClock:Function;
    StopBreakClock:Function;
    ToggleConfirm:Function;
    Reset:Function;
    SetGameTime:Function;
    CopyGameTime:Function;
    SetBreakTime:Function;
    SetJamTime:Function;
    SetBoardStatus:Function;
    SetPhase:Function;
    SetPhaseTime:Function;
    IncreasePhase:Function;
    DecreasePhase:Function;
    SetJamCounter:Function;
    IncreaseJamCounter:Function;
    DecreaseJamCounter:Function;
    SetTeam:Function;
    SetTeams:Function;
    SetTeamScore:Function;
    SetTeamTimeouts:Function;
    SetTeamChallenges:Function;
    SetTeamJamPoints:Function;
    SetTeamStatus:Function;
    SetTeamName:Function;
    SetTeamColor:Function;
    IncreaseTeamScore:Function;
    DecreaseTeamScore:Function;
    IncreaseTeamJamPoints:Function;
    DecreaseTeamJamPoints:Function;
    IncreaseTeamChallenges:Function;
    DecreaseTeamChallenges:Function;
    IncreaseTeamTimeouts:Function;
    DecreaseTeamTimeouts:Function;
    OfficialTimeout:Function;
    InjuryTimeout:Function;
    ResetJam:Function;
    ApplyConfig:Function;
    onKeyUp:Function;
    onGamepadButtonPress:Function;
    onGamepadButtonDown:Function;
    onGamepadButtonUp:Function;
    onGamepadAxis:Function;
    getConfig:Function;
    saveConfig:Function;
}

export enum Actions {
    SET_STATE = 'SET_STATE',
    RESET_STATE = 'RESET_STATE',
    RESET_JAM = 'RESET_JAM',
    TOGGLE_JAM_CLOCK = 'TOGGLE_JAM_CLOCK',
    TOGGLE_GAME_CLOCK = 'TOGGLE_GAME_CLOCK',
    TOGGLE_BREAK_CLOCK = 'TOGGLE_BREAK_CLOCK',
    TOGGLE_CONFIRM = 'TOGGLE_CONFIRM',
    SET_BOARD_STATUS = 'SET_BOARD_STATUS',
    SET_OFFICIAL_TIMEOUT = 'SET_OFFICIAL_TIMEOUT',
    SET_INJURY_TIMEOUT = 'SET_INJURY_TIMEOUT',
    SET_PHASES = 'SET_PHASES',
    SET_PHASE = 'SET_PHASE',
    SET_PHASE_TIME = 'SET_PHASE_TIME',
    SET_JAM_COUNTER = 'SET_JAM_COUNTER',
    SET_GAME_TIME = 'SET_GAME_TIME',
    COPY_PHASE_TIME = 'COPY_PHASE_TIME',
    SET_TEAM = 'SET_TEAM',
    SET_TEAMS = 'SET_TEAMS',
    SET_TEAM_COLOR = 'SET_TEAM_COLOR',
    SET_TEAM_CHALLENGES = 'SET_TEAM_CHALLENGES',
    SET_TEAM_JAMPOINTS = 'SET_TEAM_JAMPOINTS',
    SET_TEAM_SCORE = 'SET_TEAM_SCORE',
    SET_TEAM_TIMEOUTS = 'SET_TEAM_TIMEOUTS',
    SET_TEAM_NAME = 'SET_TEAM_NAME',
    SET_TEAM_STATUS = 'SET_TEAM_STATUS'
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
    /**
     * Full-screen slide
     */
    Slide?:string;
    Photo?:string;
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
        ScoreboardThumbnail:"default/TeamAScoreboard.png",
        Slide:"",
        Photo:""
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
        ScoreboardThumbnail:"default/TeamBScoreboard.png",
        Slide:"",
        Photo:""
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

const SetState = (state:SScoreboardState, values) => {
    let maxTimeouts:number = state.MaxTimeouts;
    let maxChallenges:number = state.MaxChallenges;

    let obj:SScoreboardState = {...state, ...values};
    if(values.TeamA) {
        obj.TeamA = {...state.TeamA, ...values.TeamA};
    }

    if(values.TeamB) {
        obj.TeamB = {...state.TeamB, ...values.TeamB};
    }

    if(!Number.isNaN(values.MaxTimeouts))
        maxTimeouts = values.MaxTimeouts;

    if(!Number.isNaN(values.MaxChallenges))
        maxChallenges = values.MaxChallenges;

    if(state.JamState == vars.Clock.Status.Ready) {
        obj.JamSecond = obj.MaxJamSeconds;
    }

    if(obj.TeamA.Timeouts > maxTimeouts)
        obj.TeamA.Timeouts = maxTimeouts;

    if(obj.TeamA.Challenges > maxChallenges)
        obj.TeamA.Challenges = maxChallenges;

    if(obj.TeamB.Timeouts > maxTimeouts)
        obj.TeamB.Timeouts = maxTimeouts;

    if(obj.TeamB.Challenges > maxChallenges)
        obj.TeamB.Challenges = maxChallenges;

    return obj;
};

const ResetState = (state:SScoreboardState, values) => {
    //ignore reset if game/jam clock is running
    if(state.JamState === vars.Clock.Status.Running || state.GameState === vars.Clock.Status.Running)
        return state;

    let phases:Array<PhaseRecord> = PhasesController.Get();
    let phase:any = {
        PhaseID:0,
        PhaseName:"DERBY!",
        PhaseIndex:0,
        PhaseHour:0,
        PhaseMinute:0,
        PhaseSecond:0
    };
    let index:number = phases.findIndex((p) => {
        return (p.PhaseQtr && p.PhaseQtr >= 1);
    });

    let maxJamSeconds:number = state.MaxJamSeconds;
    if(values.MaxJamSeconds && !Number.isNaN(values.MaxJamSeconds))
        maxJamSeconds = values.MaxJamSeconds;

    if(index >= 0) {
        phase.PhaseIndex = index;
        phase.PhaseID = phases[index].RecordID;
        if(typeof(phases[index].Name) === "string")
            phase.PhaseName = phases[index].Name;
        if(phases[index].Duration) {
            let duration:any = phases[index].Duration;
            if(duration) {
                phase.PhaseHour = duration[0];
                phase.PhaseMinute = duration[1];
                phase.PhaseSecond = duration[2];
            }
        }
    }

    return {
        ...InitState,
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
        TeamA:{
            ...state.TeamA,
            Score:0,
            Timeouts:state.MaxTimeouts,
            Challenges:state.MaxChallenges,
            JamPoints:0,
            Status:0
        },
        TeamB:{
            ...state.TeamB,
            Score:0,
            Timeouts:state.MaxTimeouts,
            Challenges:state.MaxChallenges,
            JamPoints:0,
            Status:0
        }
    };
};

const OfficialTimeout = (state:SScoreboardState) => {
    if(state.BoardStatus === vars.Scoreboard.Status.Timeout) {
        return {...state, BoardStatus:vars.Scoreboard.Status.Normal};
    } else {
        return {...state,
            JamState:vars.Clock.Status.Stopped,
            GameState:vars.Clock.Status.Stopped,
            BreakState:vars.Clock.Status.Ready,
            BoardStatus:vars.Scoreboard.Status.Timeout,
            TeamA:{...state.TeamA, Status:vars.Team.Status.Normal},
            TeamB:{...state.TeamB, Status:vars.Team.Status.Normal}
        };
    }
};

const InjuryTimeout = (state:SScoreboardState) => {
    if(state.BoardStatus === vars.Scoreboard.Status.Injury) {
        return {...state, BoardStatus:vars.Scoreboard.Status.Normal};
    } else {
        return {...state,
            JamState:vars.Clock.Status.Stopped,
            GameState:vars.Clock.Status.Stopped,
            BreakState:vars.Clock.Status.Ready,
            BoardStatus:vars.Scoreboard.Status.Injury,
            TeamA:{...state.TeamA, Status:vars.Team.Status.Normal},
            TeamB:{...state.TeamB, Status:vars.Team.Status.Normal}
        };
    }
};

const ToggleJamClock = (state:SScoreboardState) => {
    let teamAStatus = state.TeamA.Status;
    let teamBStatus = state.TeamB.Status;

    if(teamAStatus !== vars.Team.Status.PowerJam)
        teamAStatus = vars.Team.Status.Normal;

    if(teamBStatus !== vars.Team.Status.PowerJam)
        teamBStatus = vars.Team.Status.Normal;
        
    if(state.JamChangeMode) {
        switch(state.JamState) {
            case vars.Clock.Status.Ready :

                if(teamAStatus !== vars.Team.Status.PowerJam)
                    teamAStatus = vars.Team.Status.Normal;

                if(teamBStatus !== vars.Team.Status.PowerJam)
                    teamBStatus = vars.Team.Status.Normal;

                return {...state, 
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
                    TeamA:{...state.TeamA, 
                        Status:teamAStatus,
                        JamPoints:0
                    },
                    TeamB:{...state.TeamB, 
                        Status:teamAStatus,
                        JamPoints:0
                    }
                };

            //stop jam clock, start break clock
            case vars.Clock.Status.Running :
                return {...state, 
                    JamState:vars.Clock.Status.Stopped,
                    BreakState:vars.Clock.Status.Running,
                    BreakSecond:state.MaxBreakSeconds
                };

            //reset jam clock, board status, and team status
            case vars.Clock.Status.Stopped :
                return {...state, 
                    JamState:vars.Clock.Status.Ready,
                    JamSecond:state.MaxJamSeconds,
                    BoardStatus:vars.Scoreboard.Status.Normal,
                    TeamA:{...state.TeamA, Status:vars.Team.Status.Normal},
                    TeamB:{...state.TeamB, Status:vars.Team.Status.Normal}
                };

            default :
                return state;
        }
    } else {
        switch(state.JamState) {
            case vars.Clock.Status.Ready :;

                if(teamAStatus !== vars.Team.Status.PowerJam)
                    teamAStatus = vars.Team.Status.Normal;

                if(teamBStatus !== vars.Team.Status.PowerJam)
                    teamBStatus = vars.Team.Status.Normal;

                return {...state, 
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
                    TeamA:{...state.TeamA, 
                        Status:teamAStatus,
                        JamPoints:0
                    },
                    TeamB:{...state.TeamB, 
                        Status:teamAStatus,
                        JamPoints:0
                    }
                };

            //stop jam clock, start break clock
            case vars.Clock.Status.Running :
            case vars.Clock.Status.Stopped :
                return {...state,
                    JamState:vars.Clock.Status.Ready,
                    JamSecond:state.MaxJamSeconds,
                    BreakState:vars.Clock.Status.Running,
                    BreakSecond:state.MaxBreakSeconds,
                    BoardStatus:vars.Scoreboard.Status.Normal,
                    TeamA:{...state.TeamA, Status:vars.Team.Status.Normal},
                    TeamB:{...state.TeamB, Status:vars.Team.Status.Normal}
                }

            default :
                return state;
        }
    }
};

const ToggleGameClock = (state:SScoreboardState) => {
    //ignore if jam clock is running
    if(state.JamState === vars.Clock.Status.Running)
        return state;
    switch(state.GameState) {
        case vars.Clock.Status.Stopped :
        case vars.Clock.Status.Ready :
            return {...state, GameState:vars.Clock.Status.Running};
        case vars.Clock.Status.Running :
            return {...state, GameState:vars.Clock.Status.Stopped};
        default :
            return state;
    }
};

const ToggleBreakClock = (state:SScoreboardState) => {
    if(state.JamState === vars.Clock.Status.Running)
        return state;
    switch(state.BreakState) {
        case vars.Clock.Status.Stopped :
            return {...state, 
                BreakState:vars.Clock.Status.Ready,
                BreakSecond:state.MaxBreakSeconds
            };
        case vars.Clock.Status.Ready :
            return {...state,
                BreakState:vars.Clock.Status.Running
            };
        case vars.Clock.Status.Running :
            return {...state, 
                BreakState:vars.Clock.Status.Ready,
                BreakSecond:state.MaxBreakSeconds
            };
        default :
            return state;
    }
};

const SetGameTime = (state:SScoreboardState, hour:number, minute:number, second:number) => {
    return {...state, 
        GameHour:hour,
        GameMinute:minute,
        GameSecond:second
    };
};

const CopyPhaseToGameClock = (state:SScoreboardState) => {
    //ignore if the game or jam clock are running
    if(state.GameState === vars.Clock.Status.Running || state.JamState === vars.Clock.Status.Running)
            return state;
    return {...state,
        GameHour:state.PhaseHour,
        GameMinute:state.PhaseMinute,
        GameSecond:state.PhaseSecond
    };
};

const SetBoardStatus = (state:SScoreboardState, status:number) => {
    //if the jam clock is running or status is the same, set to Normal
    if(state.JamState === vars.Clock.Status.Running || state.BoardStatus === status) {
        return {...state, BoardStatus:vars.Scoreboard.Status.Normal};
    }

    let clockStatus = state.GameState;
    let breakState = state.BreakState;

    if(status === vars.Scoreboard.Status.Timeout || status === vars.Scoreboard.Status.Injury) {
        clockStatus = vars.Clock.Status.Stopped;
        breakState = vars.Clock.Status.Ready;
    }

    return {...state, 
        BoardStatus:status,
        GameState:clockStatus,
        BreakState:breakState
    };
};

const ToggleConfirm = (state:SScoreboardState) => {
    return {...state, ConfirmStatus:(state.ConfirmStatus) ? 0 : 1};
};

const SetPhase = (state:SScoreboardState, index:number) => {
    let duration:Array<number> = [0,0,0];
    let name:any = "";
    let id:number = 0;
    let Phases:Array<PhaseRecord> = PhasesController.Get();
    if(Phases[index]) {
        if(Phases[index].Duration !== undefined) {
            let d:any = duration;
            duration = d;
        }
        name = Phases[index].Name;
        id = Phases[index].RecordID;
    }

    if(typeof(duration[0]) === "string")
        duration[0] = parseInt(duration[0]);

    if(typeof(duration[1]) === "string")
        duration[1] = parseInt(duration[1]);

    if(typeof(duration[2]) === "string")
        duration[2] = parseInt(duration[2]);

    return {...state,
        PhaseIndex:index,
        PhaseID:id,
        PhaseName:name,
        PhaseHour:duration[0],
        PhaseMinute:duration[1],
        PhaseSecond:duration[2]
    };
};

const SetPhaseTime = (state:SScoreboardState, hour:number, minute:number, second:number) => {
    
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

    return {...state, PhaseHour:hour, PhaseMinute:minute, PhaseSecond:second};
};

const SetJamCounter = (state:SScoreboardState, amount:number) => {
    if(amount <= 0)
        return {...state, JamCounter:0};
    return {...state, JamCounter:amount};
};

const SetTeam = (state:SScoreboardState, side:Sides, team:TeamRecord) => {

    if(side === 'A') {
        return {...state,
            TeamA:{
                ...state.TeamA,
                ID:team.RecordID,
                Name:team.Name,
                Color:team.Color,
                Thumbnail:team.Thumbnail,
                ScoreboardThumbnail:team.ScoreboardThumbnail,
                Slide:team.Slide
            }
        };
    } else if(side === 'B') {
        return {...state,
            TeamB:{
                ...state.TeamB,
                ID:team.RecordID,
                Name:team.Name,
                Color:team.Color,
                Thumbnail:team.Thumbnail,
                ScoreboardThumbnail:team.ScoreboardThumbnail,
                Slide:team.Slide
            }
        };
    } else {
        return state;
    }
};

const SetTeams = (state:SScoreboardState, TeamA:TeamRecord, TeamB:TeamRecord) => {
    return {...state,
        TeamA:{...state.TeamA,
            ID:TeamA.RecordID,
            Name:TeamA.Name,
            Color:TeamA.Color,
            Thumbnail:TeamA.Thumbnail,
            ScoreboardThumbnail:TeamA.ScoreboardThumbnail,
            Slide:TeamA.Slide,
            Photo:TeamA.Photo
        },
        TeamB:{...state.TeamB,
            ID:TeamB.RecordID,
            Name:TeamB.Name,
            Color:TeamB.Color,
            Thumbnail:TeamB.Thumbnail,
            ScoreboardThumbnail:TeamB.ScoreboardThumbnail,
            Slide:TeamB.Slide,
            Photo:TeamB.Photo
        }
    };
};

const SetTeamColor = (state:SScoreboardState, side:Sides, color:string) => {
    if(side === 'A') {
        return {...state, TeamA:{...state.TeamA, Color:color}};
    } else {
        return {...state, TeamB:{...state.TeamB, Color:color}};
    }
};

const SetTeamName = (state:SScoreboardState, side:Sides, name:string) => {
    if(side === 'A') {
        return {...state, TeamA:{...state.TeamA, Name:name}};
    } else {
        return {...state, TeamB:{...state.TeamB, Name:name}};
    }
};

const SetTeamScore = (state:SScoreboardState, side:Sides, score:number, jpoints?:number) => {
    if(score > 999)
        score = 999;
    else if(score < 0)
        score = 0;
    if(side === 'A') {
        let jampoints = state.TeamA.JamPoints;
        if(typeof(jpoints) === 'number')
            jampoints += jpoints;
        return {...state, TeamA:{
            ...state.TeamA,
            Score:score,
            JamPoints:jampoints
        }};
    } else {
        let jampoints = state.TeamB.JamPoints;
        if(typeof(jpoints) === 'number')
            jampoints += jpoints;
        return {...state, TeamB:{
            ...state.TeamB,
            Score:score,
            JamPoints:jampoints
        }};
    }
};

const SetTeamJamPoints = (state:SScoreboardState, side:Sides, amount:number) => {
    if(side == 'A') {
        return {...state, TeamA:{...state.TeamA, JamPoints:amount}};
    } else {
        return {...state, TeamB:{...state.TeamB, JamPoints:amount}};
    }
};

const SetTeamTimeouts = (state:SScoreboardState, side:Sides, amount:number) => {
    if(amount > state.MaxTimeouts)
        amount = state.MaxTimeouts;
    if(amount < 0)
        amount = 0;
    if(side === 'A') {
        return {...state, TeamA:{...state.TeamA, Timeouts:amount}};
    } else {
        return {...state, TeamB:{...state.TeamB, Timeouts:amount}};
    }
};


const SetTeamChallenges = (state:SScoreboardState, side:Sides, amount:number) => {
    if(amount > state.MaxChallenges)
        amount = state.MaxChallenges;
    if(amount < 0)
        amount = 0;
    if(side === 'A') {
        return {...state, TeamA:{...state.TeamA, Challenges:amount}};
    } else {
        return {...state, TeamB:{...state.TeamB, Challenges:amount}};
    }
};

const SetTeamStatus = (state:SScoreboardState, side:Sides, status:number) => {
    //when the jam clock is running, ignore any status
    //other than power jam and lead jammer
    if(state.JamState === vars.Clock.Status.Running) {
        if(status !== vars.Team.Status.PowerJam 
            && status !== vars.Team.Status.LeadJammer) {
            return state;
        }
    }
    
    let bseconds = state.MaxBreakSeconds;

    if(side === 'A') {
        if(status == state.TeamA.Status)
            status = vars.Team.Status.Normal;
            
        if(status == vars.Team.Status.Timeout || status == vars.Team.Status.Challenge)
            bseconds = state.MaxTimeoutSeconds;

        return {...state, 
            BreakSeconds:bseconds,
            TeamA:{...state.TeamA, Status:status},
            TeamB:{...state.TeamB, Status:vars.Team.Status.Normal}
        };
    } else {
        if(status == state.TeamB.Status)
            status = vars.Team.Status.Normal;

        if(status == vars.Team.Status.Timeout || status == vars.Team.Status.Challenge)
            bseconds = state.MaxTimeoutSeconds;

        return {...state, 
            BreakSeconds:bseconds,
            TeamA:{...state.TeamA, Status:vars.Team.Status.Normal},
            TeamB:{...state.TeamB, Status:status}
        };
    }
};

const ResetJam = (state:SScoreboardState) => {
    return {...state,
        GameHour:state.StartGameHour,
        GameMinute:state.StartGameMinute,
        GameSecond:state.StartGameSecond,
        GameState:vars.Clock.Status.Stopped,
        JamState:vars.Clock.Status.Ready,
        BreakState:vars.Clock.Status.Ready,
        JamHour:InitState.JamHour,
        JamMinute:InitState.JamMinute,
        JamSecond:state.MaxJamSeconds
    };
};

/**
 * Reducer for the scoreboard ScoreboardController.
 * @param {Object} state 
 * @param {object} action 
 */
const ScoreboardReducer = (state:SScoreboardState = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_STATE :
                return SetState(state, action.state);
            case Actions.RESET_STATE :
                return ResetState(state, action.values);

            //calls an official timeout
            case Actions.SET_OFFICIAL_TIMEOUT :
                return OfficialTimeout(state);
                
            //calls an injury timeout
            case Actions.SET_INJURY_TIMEOUT :
                return InjuryTimeout(state);

            //toggle the jam clock
            case Actions.TOGGLE_JAM_CLOCK :
                return ToggleJamClock(state);

            //toggles the game clock
            case Actions.TOGGLE_GAME_CLOCK :
                return ToggleGameClock(state);

            case Actions.TOGGLE_BREAK_CLOCK :
                return ToggleBreakClock(state);

            //sets the game clock time
            case Actions.SET_GAME_TIME :
                return SetGameTime(state, action.hour, action.minute, action.second);

            //sets the game clock time to match the phase time
            case Actions.COPY_PHASE_TIME :
                return CopyPhaseToGameClock(state);
                
            case Actions.SET_BOARD_STATUS :
                return SetBoardStatus(state, action.BoardStatus);

            case Actions.TOGGLE_CONFIRM :
                return ToggleConfirm(state);

            case Actions.SET_PHASE :
                return SetPhase(state, action.index);

            case Actions.SET_PHASE_TIME :
                return SetPhaseTime(state, action.hour, action.minute, action.second);

            case Actions.SET_PHASES :
                return Object.assign({}, state, {
                    Phases:action.records
                });

            case Actions.SET_JAM_COUNTER :
                return SetJamCounter(state, action.amount);

            /* Team Actions */
            case Actions.SET_TEAM :
                return SetTeam(state, action.side, action.record);

            //set both teams
            case Actions.SET_TEAMS :
                return SetTeams(state, action.TeamA, action.TeamB);

            case Actions.SET_TEAM_COLOR :
                return SetTeamColor(state, action.side, action.color);

            case Actions.SET_TEAM_NAME :
                return SetTeamName(state, action.side, action.name);

            case Actions.SET_TEAM_SCORE :
                return SetTeamScore(state, action.side, action.amount, action.jampoints);

            case Actions.SET_TEAM_JAMPOINTS :
                return SetTeamJamPoints(state, action.side, action.amount);

            case Actions.SET_TEAM_TIMEOUTS :
                return SetTeamTimeouts(state, action.side, action.amount);

            case Actions.SET_TEAM_CHALLENGES :
                return SetTeamChallenges(state, action.side, action.amount);

            //Sets the team status
            //The status is toggled between teams, as no two teams
            //can have the same status
            case Actions.SET_TEAM_STATUS :
                return SetTeamStatus(state, action.side, action.value);

            case Actions.RESET_JAM :
                return ResetJam(state);

            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

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
        let state = ScoreboardController.GetState();
        let compare = {
            MaxBreakSeconds:state.MaxBreakSeconds,
            //MaxJamSeconds:state.MaxJamSeconds,
            MaxTimeouts:state.MaxTimeouts,
            MaxChallenges:state.MaxChallenges,
            MaxTimeoutSeconds:state.MaxTimeoutSeconds,
            MaxChallengeSeconds:state.MaxChallengeSeconds,
            JamChangeMode:state.JamChangeMode
        };

        if(!Compare(data, compare)) {
            ScoreboardController.SetState(data);
        }
    }
};

const ScoreboardController:IScoreboardController = CreateController('SB', ScoreboardReducer);
ScoreboardController.Init = () => {
    let data:any = DataController.GetMiscRecord('ScoreboardConfig');
    if(data && !Number.isNaN(data.MaxJamSeconds)) {
        ScoreboardController.SetState({MaxJamSeconds:data.MaxJamSeconds});
    }
};

ScoreboardController.SetState = (state:any) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:state
    });
};

ScoreboardController.ToggleJamClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.TOGGLE_JAM_CLOCK
    });
};
ScoreboardController.StartJamClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            JamState:vars.Clock.Status.Running,
            GameClock:vars.Clock.Status.Running,
            BreakClock:vars.Clock.Status.Ready
        }
    });
};
ScoreboardController.StopJamClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            JamState:vars.Clock.Status.Stopped,
            BreakState:vars.Clock.Status.Running
        }
    });
};
ScoreboardController.ToggleGameClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.TOGGLE_GAME_CLOCK
    });
};
ScoreboardController.StartGameClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            ClockState:vars.Clock.Status.Running
        }
    });
};
ScoreboardController.StopGameClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            GameState:vars.Clock.Status.Stopped
        }
    })
};
ScoreboardController.StopBreakGameClock = async () => {
    if(ScoreboardController.GetState().JamState !== vars.Clock.Status.Running) {
        ScoreboardController.Dispatch({
            type:Actions.SET_STATE,
            state:{
                GameState:vars.Clock.Status.Stopped,
                BreakState:vars.Clock.Status.Stopped
            }
        });
    }
};
ScoreboardController.ToggleBreakClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.TOGGLE_BREAK_CLOCK
    });
};
ScoreboardController.StartBreakClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            BreakState:vars.Clock.Status.Running
        }
    });
};
ScoreboardController.StopBreakClock = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            BreakState:vars.Clock.Status.Ready
        }
    });
};
ScoreboardController.ToggleConfirm = async () => {
    ScoreboardController.Dispatch({
        type:Actions.TOGGLE_CONFIRM
    });
};
ScoreboardController.Reset = async () => {
    let data:any = DataController.GetMiscRecord('ScoreboardConfig');
    let seconds:number = ScoreboardController.GetState().MaxJamSeconds;
    if(data && data.MaxJamSeconds && !Number.isNaN(data.MaxJamSeconds))
        seconds = data.MaxJamSeconds;
    ScoreboardController.Dispatch({
        type:Actions.RESET_STATE,
        values:{
            MaxJamSeconds:seconds
        }
    });
};
ScoreboardController.SetGameTime = async (hour:number, minute:number, second:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_GAME_TIME,
        hour:hour,
        minute:minute,
        second:second
    });
};
ScoreboardController.CopyGameTime = async () => {
    ScoreboardController.Dispatch({
        type:Actions.COPY_PHASE_TIME
    });
};
ScoreboardController.SetBreakTime = async (seconds:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            BreakHour:0,
            BreakMinute:0,
            BreakSecond:seconds
        }
    });
};
ScoreboardController.SetJamTime = async (second:number, minute:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_STATE,
        state:{
            JamHour:0,
            JamMinute:minute,
            JamSecond:second
        }
    });
};
ScoreboardController.SetBoardStatus = async (value:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_BOARD_STATUS,
        BoardStatus:value
    });
};
ScoreboardController.SetPhase = async (index:number) => {
    let Phases:Array<PhaseRecord> = PhasesController.Get();
    if(index < 0)
        index = Phases.length - 1;
    else if(index >= Phases.length)
        index = 0;
    ScoreboardController.Dispatch({
        type:Actions.SET_PHASE,
        index:index
    });
};
ScoreboardController.SetPhaseTime = async (hour:number, minute:number, second:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_PHASE_TIME,
        hour:hour,
        minute:minute,
        second:second
    });
};
ScoreboardController.IncreasePhase = async () => {
    ScoreboardController.SetPhase(ScoreboardController.GetState().PhaseIndex + 1);
};
ScoreboardController.DecreasePhase = async () => {
    ScoreboardController.SetPhase(ScoreboardController.GetState().PhaseIndex - 1);
};
ScoreboardController.SetJamCounter = async (amount:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_JAM_COUNTER,
        amount:amount
    });
};
ScoreboardController.IncreaseJamCounter = async (amount:number) => {
    ScoreboardController.SetJamCounter(ScoreboardController.GetState().JamCounter + amount);
};
ScoreboardController.DecreaseJamCounter = async (amount:number) => {
    ScoreboardController.SetJamCounter(ScoreboardController.GetState().JamCounter - amount);
};
ScoreboardController.SetTeam = async (side:Sides, record:TeamRecord) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM,
        side:side,
        record:record
    });
};
ScoreboardController.SetTeams = async (a:SScoreboardTeam, b:SScoreboardTeam, reset:boolean = false, resetRoster:boolean = false) => {
    if(a === null || typeof(a) !== "object" || b === null || typeof(b) !== "object")
        return;
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAMS,
        TeamA:a,
        TeamB:b
    });
    if(reset)
        ScoreboardController.Reset();
    if(resetRoster)
        RosterController.LoadSkaters();
};
ScoreboardController.SetTeamScore = async (side:Sides, amount:number, jampoints?:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_SCORE,
        side:side,
        amount:amount,
        jampoints:jampoints
    });
};
ScoreboardController.SetTeamTimeouts = async (side:Sides, amount:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_TIMEOUTS,
        side:side,
        amount:amount
    });
};
ScoreboardController.SetTeamChallenges = async (side:Sides, amount:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_CHALLENGES,
        side:side,
        amount:amount
    });
};
ScoreboardController.SetTeamJamPoints = async (side:Sides, amount:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_JAMPOINTS,
        side:side,
        amount:amount
    });
};
ScoreboardController.SetTeamStatus = async (side:Sides, status:number) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_STATUS,
        side:side,
        value:status
    });
};
ScoreboardController.SetTeamName = async (side:Sides, name:string) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_NAME,
        side:side,
        name:name
    });
};
ScoreboardController.SetTeamColor = async (side:Sides, color:string) => {
    ScoreboardController.Dispatch({
        type:Actions.SET_TEAM_COLOR,
        side:side,
        color:color
    });
};
ScoreboardController.IncreaseTeamScore = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    if(ScoreboardController.GetState().JamState !== vars.Clock.Status.Running) {
        ScoreboardController.SetTeamScore(side, team.Score + amount, amount);
    } else {
        ScoreboardController.SetTeamScore(side, team.Score + amount, 0);
    }
};
ScoreboardController.DecreaseTeamScore = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    if(ScoreboardController.GetState().JamState !== vars.Clock.Status.Running) {
        ScoreboardController.SetTeamScore(side, team.Score - amount, amount * -1);
    } else {
        ScoreboardController.SetTeamScore(side, team.Score - amount, 0);
    }
};
ScoreboardController.IncreaseTeamJamPoints = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamJamPoints(side, team.JamPoints + amount);
};
ScoreboardController.DecreaseTeamJamPoints = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamJamPoints(side, team.JamPoints - amount);
};

ScoreboardController.IncreaseTeamChallenges = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamChallenges(side, team.Challenges + amount);
};
ScoreboardController.DecreaseTeamChallenges = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamChallenges(side, team.Challenges - amount);
};
ScoreboardController.IncreaseTeamTimeouts = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamTimeouts(side, team.Timeouts + amount);
};
ScoreboardController.DecreaseTeamTimeouts = async (side:Sides, amount:number) => {
    let team = (side === 'A') ? ScoreboardController.GetState().TeamA : ScoreboardController.GetState().TeamB;
    ScoreboardController.SetTeamTimeouts(side, team.Timeouts - amount);
};
ScoreboardController.OfficialTimeout = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_OFFICIAL_TIMEOUT
    });
};
ScoreboardController.InjuryTimeout = async () => {
    ScoreboardController.Dispatch({
        type:Actions.SET_INJURY_TIMEOUT
    });
};
ScoreboardController.ResetJam = async () => {
    ScoreboardController.Dispatch({
        type:Actions.RESET_JAM
    });
};
ScoreboardController.ApplyConfig = async (config:any) => {
    if(config === null || typeof(config) !== "object")
        return;

    let teamA:TeamRecord = TeamsController.GetRecord(config.TeamA.ID);
    let teamB:TeamRecord = TeamsController.GetRecord(config.TeamB.ID);
    ScoreboardController.Dispatch({
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
                ScoreboardThumbnail:(teamA) ? teamA.ScoreboardThumbnail : '',
                Slide:(teamA) ? teamA.Slide : '',
                Photo:(teamA) ? teamA.Photo : '',
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
                ScoreboardThumbnail:(teamB) ? teamB.ScoreboardThumbnail : '',
                Slide:(teamB) ? teamB.Slide : '',
                Photo:(teamB) ? teamB.Photo : '',
            },
            PhaseID: parseInt( config.PhaseID ),
            PhaseName: config.PhaseName,
            PhaseStatus: config.PhaseStatus,
            ConfirmStatus: config.ConfirmStatus,
            BoardStatus: config.BoardStatus
        }
    });
};

ScoreboardController.onKeyUp = async (ev:any) => {
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
};

ScoreboardController.onGamepadButtonPress = async (buttons:IGamepadButtonMap) => {
    let state = ScoreboardController.GetState();
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
};

ScoreboardController.onGamepadButtonDown = async (buttons:IGamepadButtonMap) => {
    
    let state = ScoreboardController.GetState();
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
};

ScoreboardController.onGamepadButtonUp = async () => {};
ScoreboardController.onGamepadAxis = async () => {};
ScoreboardController.getConfig = async () => {
    let config:any = DataController.GetMiscRecord('ScoreboardConfig');
    return {
        MaxBreakSeconds:30,
        MaxJamSeconds:60,
        MaxChallenges:1,
        MaxTimeouts:2,
        MaxTimeoutSeconds:60,
        MaxChallengeSeconds:60,
        JamChangeMode:false
    , ...config};
};

ScoreboardController.saveConfig = async (settings:any) : Promise<boolean> => {
    let config:any = Object.assign(ScoreboardController.getConfig(), settings);
    return DataController.SaveMiscRecord('ScoreboardConfig', config);
};

ScoreboardController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/scoreboard(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(ScoreboardController.GetState())));
        res.end();
    });
};

export default ScoreboardController;