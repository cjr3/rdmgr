import ScoreboardController from 'controllers/ScoreboardController';
import {SkaterRecord, TeamRecord, PenaltyRecord, SkaterTeamRecord} from 'tools/vars';
import keycodes from 'tools/keycodes';
import {IController} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import RosterCaptureController from './capture/Roster';
import {SCaptureControllerState} from './capture/vars';
import { PrepareObjectForSending, MoveElement } from './functions';
import TeamsController from './TeamsController';
import SkatersController from './SkatersController';
import { Unsubscribe } from 'redux';
import PenaltyController, { SPenaltyController } from './PenaltyController';
import ScorekeeperController, { SScorekeeperState } from './ScorekeeperController';
import { IGamepadButtonMap } from './GameController';

interface IRosterController extends IController {
    //Skater Records
    AddSkater:{(side:Sides, record:SkaterRecord)};
    RemoveSkater:{(side:Sides, id:number)};
    SwapSkaters:{(side:Sides, a:number, b:number, right:boolean)};
    SetSkaters:{(side:Sides,records:Array<SkaterRecord>)};
    LoadSkaters:Function;

    //Intro 
    Next:Function;
    Prev:Function;
    SetSkater:{(side:Sides, id:number)};

    //Roles
    SetRole:{(side:string, id:number, role:string)};

    //Penalties (Penalty Tracker)
    updatePenaltyTracker:Unsubscribe;

    //Positions (Scorekeeper)
    updateScorekeeper:Unsubscribe;

    //Skaters Controller
    updateSkaters:Unsubscribe;

    //misc
    onKeyUp:Function;
    onGamepadButtonPress:Function;
};

enum Actions {
    SET_TEAM = 'SET_TEAM',
    SET_SKATERS = 'SET_SKATERS',
    ADD_SKATER = 'ADD_SKATER',
    REMOVE_SKATER = 'REMOVE_SKATER',
    SWAP_SKATERS = 'SWAP_SKATERS',
    SET_CURRENT_SKATER = 'SET_CURRENT_SKATER',
    NEXT_SKATER = 'NEXT_SKATER',
    PREV_SKATER = 'PREV_SKATER',
    SET_ROLE = 'SET_ROLE',
    UPDATE_PENALTY_TRACKER = 'UPDATE_PENALTY_TRACKER',
    UPDATE_SCOREKEEPER = 'UPDATE_SCOREKEEPER',
    UPDATE_SKATERS = 'UPDATE_SKATERS'
};

export type Sides = "A" | "B";
export type Roles = '' | 'Coach' | 'Captain' | 'CoCaptain' | 'Penalty';

export interface STeamRoles {
    Coach:number;
    Penalty:number;
    Captain:number;
    CoCaptain:number;
}

export interface SRosterTeam {
    ID:number;
    /**
     * Side of the scoreboard
     */
    Side:Sides;
    /**
     * Team thumbnail / logo
     */
    Thumbnail:string;
    /**
     * Team slide (potential future use)
     */
    Slide:string;
    /**
     * Skaters assigned to this team.
     */
    Skaters:Array<SkaterRecord>;
    /**
     * Roles (captain, coach, etc.)
     */
    Roles:STeamRoles;
}

export interface SRosterController {
    /**
     * Current team to show
     */
    CurrentTeam:Sides;
    /**
     * Current skater to show
     */
    SkaterIndex:number;
    /**
     * Left-side team
     */
    TeamA:SRosterTeam;
    /**
     * Right-side team
     */
    TeamB:SRosterTeam;
    /**
     * True if the remote peer that controls the roster
     * has it visible on their screen.
     */
    RemoteShown:boolean;
}

export const InitState:SRosterController = {
    CurrentTeam:'A',
    SkaterIndex:-1,
    TeamA:{
        ID:0,
        Side:'A',
        Thumbnail:'',
        Slide:'',
        Skaters:new Array<SkaterRecord>(),
        Roles:{
            Coach:0,
            Penalty:0,
            Captain:0,
            CoCaptain:0
        }
    },
    TeamB:{
        ID:0,
        Side:'B',
        Thumbnail:'',
        Slide:'',
        Skaters:new Array<SkaterRecord>(),
        Roles:{
            Coach:0,
            Penalty:0,
            Captain:0,
            CoCaptain:0
        }
    },
    RemoteShown:false
};

const GetSkaterIndex = (records:Array<SkaterRecord>, id:number) => {
    return records.findIndex(r => r.RecordID == id);
};

const SetTeam = (state:SRosterController, side:Sides, team:TeamRecord) => {
    if(side === 'A') {
        return {
            ...state, 
            SkaterIndex:-1, 
            TeamA:{
                ...state.TeamA, 
                ID:team.RecordID,
                Thumbnail:team.Thumbnail,
                Slide:team.Slide
            }
        };
    } else {
        return {
            ...state, 
            SkaterIndex:-1, 
            TeamB:{
                ...state.TeamB, 
                ID:team.RecordID,
                Thumbnail:team.Thumbnail,
                Slide:team.Slide
            }
        };
    }
};

const SetSkaters = (state:SRosterController, side:Sides, records:Array<SkaterRecord>) => {
    let skaters:Array<SkaterRecord> = records.slice();
    let team:SRosterTeam = {...state.TeamA}
    if(side == 'B')
        team = {...state.TeamB};
    team.Roles.Captain = 0;
    team.Roles.CoCaptain = 0;
    team.Roles.Coach = 0;
    team.Roles.Penalty = 0;

    skaters.forEach((skater:SkaterRecord) => {
        skater.Penalties = new Array<PenaltyRecord>();
        skater.Position = '';
        if(skater.Teams && skater.Teams.forEach) {
            skater.Teams.forEach((steam:SkaterTeamRecord) => {
                if(steam.TeamID == team.ID) {
                    if(steam.Captain)
                        team.Roles.Captain = skater.RecordID;
                    else if(steam.CoCaptain)
                        team.Roles.CoCaptain = skater.RecordID;
                    else if(steam.Coach)
                        team.Roles.Coach = skater.RecordID;
                    else if(steam.PenaltyTracker || steam.Manager)
                        team.Roles.Penalty = skater.RecordID;
                }
            });
        }
    });

    if(side === 'A') {
        return {...state, CurrentTeam:'A', SkaterIndex:-1, TeamA:{
            ...team,
            Skaters:skaters
        }};
    } else {
        return {...state, CurrentTeam:'A', SkaterIndex:-1, TeamB:{
            ...team,
            Skaters:skaters
        }};
    }
};

const SetCurrentSkater = (state:SRosterController, side:Sides, index:number) => {
    return {...state, CurrentTeam:side, SkaterIndex:index};
};

const AddSkater = (state:SRosterController, side:Sides, record:SkaterRecord) => {
    if(GetSkaterIndex(state.TeamA.Skaters, record.RecordID) >= 0 || GetSkaterIndex(state.TeamB.Skaters, record.RecordID) >= 0)
        return state;
    if(side === 'A') {
        let skaters:Array<SkaterRecord> = state.TeamA.Skaters.slice();
        skaters.push(record);
        return {...state, 
            TeamA:{
                ...state.TeamA,
                Skaters:skaters
            }
        };
    } else {
        let skaters:Array<SkaterRecord> = state.TeamB.Skaters.slice();
        skaters.push(record);
        return {...state, 
            TeamB:{
                ...state.TeamB,
                Skaters:skaters
            }
        };
    }
};

const RemoveSkater = (state:SRosterController, side:Sides, record:SkaterRecord) => {
    if(side == 'A') {
        let index:number = GetSkaterIndex(state.TeamA.Skaters, record.RecordID);
        if(index < 0)
            return state;
        return {...state, 
            TeamA:{
                ...state.TeamA,
                Skaters:state.TeamA.Skaters.filter(r => r.RecordID != record.RecordID)
            }
        };
    } else {
        let index:number = GetSkaterIndex(state.TeamB.Skaters, record.RecordID);
        if(index < 0)
            return state;
        return {...state, 
            TeamB:{
                ...state.TeamB,
                Skaters:state.TeamB.Skaters.filter(r => r.RecordID != record.RecordID)
            }
        };
    }
};

const SwapSakters = (state:SRosterController, side:Sides, a:number, b:number, right:boolean) => {
    if(side === 'A') {
        let skaters:Array<SkaterRecord> = state.TeamA.Skaters.slice();
        MoveElement(skaters, a, b, right);
        return {...state, TeamA:{
            ...state.TeamA,
            Skaters:skaters
        }};
    } else {
        let skaters:Array<SkaterRecord> = state.TeamB.Skaters.slice();
        MoveElement(skaters, a, b, right);
        return {...state, TeamB:{
            ...state.TeamB,
            Skaters:skaters
        }};
    }
};

const NextSkater = (state:SRosterController) => {
    let index:number = state.SkaterIndex + 1;
    let side:Sides = state.CurrentTeam;
    if(side == 'A') {
        if(index >= state.TeamA.Skaters.length) {
            index = -1;
            side = 'B';
        }
    } else {
        if(index >= state.TeamB.Skaters.length) {
            index = -1;
        }
    }

    return {...state, CurrentTeam:side, SkaterIndex:index};
};

const PreviousSkater = (state:SRosterController) => {
    let index:number = state.SkaterIndex - 1;
    let team:Sides = state.CurrentTeam;
    if(team === 'B') {
        if(index < -1) {
            index = state.TeamA.Skaters.length - 1;
            team = 'A';
        }
    }

    if(index < -1) {
        index = -1;
    }

    return {...state, CurrentTeam:team, SkaterIndex:index};
};

const UpdatePenaltyTracker = (state:SRosterController, pt:SPenaltyController) => {
    let skatersA:Array<SkaterRecord> = state.TeamA.Skaters.slice();
    let skatersB:Array<SkaterRecord> = state.TeamB.Skaters.slice();
    skatersA.forEach((skater:SkaterRecord) => {
        let pskater:SkaterRecord|undefined = pt.Skaters.find((r) => r.RecordID == skater.RecordID);
        if(pskater) {
            skater.Penalties = pskater.Penalties;
        } else {
            skater.Penalties = new Array<PenaltyRecord>();
        }
    });
    skatersB.forEach((skater:SkaterRecord) => {
        skater.Penalties = new Array<PenaltyRecord>();
        let pskater:SkaterRecord|undefined = pt.Skaters.find((r) => r.RecordID == skater.RecordID);
        if(pskater) {
            skater.Penalties = pskater.Penalties;
        } else {
            skater.Penalties = new Array<PenaltyRecord>();
        }
    });
    return {
        ...state,
        TeamA:{
            ...state.TeamA,
            Skaters:skatersA
        },
        TeamB:{
            ...state.TeamB,
            Skaters:skatersB
        }
    }
};

/**
 * Updates the skater positions from the scorekeeper
 * @param state 
 * @param sk 
 */
const UpdateScorekeeper = (state:SRosterController, sk:SScorekeeperState) => {
    
    let skatersA:Array<SkaterRecord> = state.TeamA.Skaters.slice();
    let skatersB:Array<SkaterRecord> = state.TeamB.Skaters.slice();
    skatersA.forEach((skater:SkaterRecord) => {
        if(skater.RecordID > 0) {
            let position:string = '';
            let deck:string = '';
            for(let key in sk.TeamA.Track) {
                let sskater:SkaterRecord = sk.TeamA.Track[key];
                if(sskater && sskater.RecordID == skater.RecordID) {
                    position = key;
                    deck = 'Track';
                    break;
                }
            }
    
            if(!position) {
    
                for(let key in sk.TeamA.Deck) {
                    let sskater:SkaterRecord = sk.TeamA.Deck[key];
                    if(sskater && sskater.RecordID == skater.RecordID) {
                        position = key;
                        deck = 'Deck';
                        break;
                    }
                }
            }
    
            skater.Position = position;
            skater.Deck = deck;
        }
    });
    skatersB.forEach((skater:SkaterRecord) => {
        if(skater.RecordID > 0) {
            let position:string = '';
            let deck:string = '';
            for(let key in sk.TeamB.Track) {
                let sskater:SkaterRecord = sk.TeamB.Track[key];
                if(sskater && sskater.RecordID == skater.RecordID) {
                    position = key;
                    deck = 'Track';
                    break;
                }
            }
            
            if(!position) {
    
                for(let key in sk.TeamB.Deck) {
                    let sskater:SkaterRecord = sk.TeamB.Deck[key];
                    if(sskater && sskater.RecordID == skater.RecordID) {
                        position = key;
                        deck = 'Deck';
                        break;
                    }
                }
            }
    
            skater.Position = position;
            skater.Deck = deck;
        }
    });

    return {
        ...state,
        TeamA:{
            ...state.TeamA,
            Skaters:skatersA
        },
        TeamB:{
            ...state.TeamB,
            Skaters:skatersB
        }
    }
};

const UpdateSkaters = (state:SRosterController, records:Array<SkaterRecord>) => {
    let skatersA:Array<SkaterRecord> = state.TeamA.Skaters.slice();
    let skatersB:Array<SkaterRecord> = state.TeamB.Skaters.slice();
    skatersA.forEach((skater, index) => {
        if(skater.RecordID > 0) {
            let record:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(record) {
                skatersA[index] = {
                    ...skater,
                    ...record,
                    Penalties:skater.Penalties,
                    Position:skater.Position
                };
            }
        }
    });
    
    skatersB.forEach((skater, index) => {
        if(skater.RecordID > 0) {
            let record:SkaterRecord|undefined = records.find((r) => r.RecordID == skater.RecordID);
            if(record) {
                skatersB[index] = {
                    ...skater,
                    ...record,
                    Penalties:skater.Penalties,
                    Position:skater.Position
                };
            }
        }
    });

    return {
        ...state,
        TeamA:{
            ...state.TeamA,
            Skaters:skatersA
        },
        TeamB:{
            ...state.TeamB,
            Skaters:skatersB
        }
    };
};

const SetRole = (state:SRosterController, side:Sides, role:Roles, id:number) => {
    if(side == 'A') {
        return {...state, TeamA:{
            ...state.TeamA,
            Roles:{
                ...state.TeamA.Roles,
                [role]:id
            }
        }};
    } else {
        return {...state, TeamB:{
            ...state.TeamB,
            Roles:{
                ...state.TeamB.Roles,
                [role]:id
            }
        }};
    }
};

/**
 * Reducer for the Roster
 * @param {Object} state 
 * @param {Object} action 
 */
const RosterReducer = (state:SRosterController = InitState, action) => {
    try {
        switch(action.type) {
            //update a team
            case Actions.SET_TEAM :
                return SetTeam(state, action.team, action.record);

            //set a team's skaters
            case Actions.SET_SKATERS :
                return SetSkaters(state, action.team, action.records);

            //Sets the current skater to display from the roster
            case Actions.SET_CURRENT_SKATER :
                return SetCurrentSkater(state, action.team, action.index);

            //add a skater to a team
            case Actions.ADD_SKATER :
                return AddSkater(state, action.team, action.record);

            //remove a skater from a team
            case Actions.REMOVE_SKATER :
                return RemoveSkater(state, action.team, action.record);

            //Swaps skaters on a given team
            case Actions.SWAP_SKATERS :
                return SwapSakters(state, action.side, action.a, action.b, action.right);

            case Actions.NEXT_SKATER :
                return NextSkater(state);

            case Actions.PREV_SKATER :
                return PreviousSkater(state);

            case Actions.UPDATE_PENALTY_TRACKER :
                return UpdatePenaltyTracker(state, action.state);

            case Actions.UPDATE_SCOREKEEPER :
                return UpdateScorekeeper(state, action.state);

            case Actions.UPDATE_SKATERS :
                return UpdateSkaters(state, action.records);

            case Actions.SET_ROLE :
                return SetRole(state, action.side, action.role, action.id);
            
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const RosterController:IRosterController = CreateController('ROS', RosterReducer);

RosterController.AddSkater = async (side:Sides, record:SkaterRecord) => {
    RosterController.Dispatch({
        type:Actions.ADD_SKATER,
        side:side,
        record:record
    });
};

RosterController.RemoveSkater = async (side:Sides, id:number) => {
    RosterController.Dispatch({
        type:Actions.REMOVE_SKATER,
        side:side,
        id:id
    });
};

RosterController.SwapSkaters = async (side:Sides, a:number, b:number, right:boolean = false) => {
    RosterController.Dispatch({
        type:Actions.SWAP_SKATERS,
        side:side,
        a:a,
        b:b,
        right:right
    });
};

RosterController.SetSkaters = async (team:Sides, records:Array<SkaterRecord>) => {
    RosterController.Dispatch({
        type:Actions.SET_SKATERS,
        team:team,
        records:records
    })
};

RosterController.LoadSkaters = async () => {
    RosterController.SetSkaters('A', TeamsController.GetTeamSkaters(ScoreboardController.GetState().TeamA.ID, true));
    RosterController.SetSkaters('B', TeamsController.GetTeamSkaters(ScoreboardController.GetState().TeamB.ID, true));
};

RosterController.Next = async () => {
    
    let state:SRosterController = RosterController.GetState();
    let capture:SCaptureControllerState = RosterCaptureController.GetState();
    let team = state.CurrentTeam;
    let index = state.SkaterIndex;

    //starting from the beginning
    if(!capture.Shown && team === 'A' && index < 0) {
        RosterCaptureController.Toggle();
        return;
    }

    //reached the end of both teams skaters
    if(!capture.Shown && team === 'B' && (index+1) >= state.TeamB.Skaters.length) {
         RosterController.SetSkater('A', -1);
         return;
    }

    if(team === 'A' && (index+1) >= state.TeamA.Skaters.length) {
        if(!capture.Shown) {
            RosterController.Dispatch({
                type:Actions.NEXT_SKATER
            });
        }
        RosterCaptureController.Toggle();
    } else {
        if(capture.Shown) {
            if(team === 'B' && (index+1) >= state.TeamB.Skaters.length) {
                RosterCaptureController.Toggle();
            } else {
                RosterController.Dispatch({
                    type:Actions.NEXT_SKATER
                });
            }
        } else {
            RosterCaptureController.Toggle();
        }
    }
};

RosterController.Prev = async () => {
    
    let state:SRosterController = RosterController.GetState();
    let capture:SCaptureControllerState = RosterCaptureController.GetState();
    let team = state.CurrentTeam;
    let index = state.SkaterIndex;
    if(team === 'A' && index < 0) {
        RosterCaptureController.Toggle();
        return;
    }
    
    if((index - 1) === -1) {
        RosterController.Dispatch({
            type:Actions.PREV_SKATER
        });
        return;
    }
    
    if(team === 'B' && (index-1) < 0) {
        if(!capture.Shown) {
            RosterController.Dispatch({
                type:Actions.PREV_SKATER
            });
        }
        RosterCaptureController.Toggle();
    } else {
        if(capture.Shown) {
            RosterController.Dispatch({
                type:Actions.PREV_SKATER
            });
        } else {
            RosterCaptureController.Toggle();
        }
    }
};

RosterController.SetSkater = async (side:Sides, index:number) => {
    RosterController.Dispatch({
        type:Actions.SET_CURRENT_SKATER,
        team:side,
        index:index
    });
};

RosterController.updatePenaltyTracker = PenaltyController.Subscribe(() => {
    RosterController.Dispatch({
        type:Actions.UPDATE_PENALTY_TRACKER,
        state:PenaltyController.GetState()
    });
});

RosterController.updateScorekeeper = ScorekeeperController.Subscribe(() => {
    RosterController.Dispatch({
        type:Actions.UPDATE_SCOREKEEPER,
        state:ScorekeeperController.GetState()
    });
});

RosterController.updateSkaters = SkatersController.Subscribe(() => {
    RosterController.Dispatch({
        type:Actions.UPDATE_SKATERS,
        records:SkatersController.Get()
    });
});

RosterController.onKeyUp = (ev) => {
    switch(ev.keyCode) {
        case keycodes.ENTER :
        case keycodes.SPACEBAR :
        case keycodes.RIGHT :
        case keycodes.DOWN :
            RosterController.Next();
        break;
        case keycodes.UP :
        case keycodes.LEFT :
            RosterController.Prev();
        break;
        case keycodes.V :
            RosterCaptureController.Toggle();
        break;
    }
};

RosterController.onGamepadButtonPress = async (buttons:IGamepadButtonMap) => {
    //Y
    if(buttons.Y.pressed) {
        if(buttons.L2.pressed) {
            RosterCaptureController.Toggle();
        } else if(buttons.R2.pressed) {
            RosterController.Prev();
        } else {
            RosterController.Next();
        }
        return;
    }
};

RosterController.SetRole = (side:string, id:number, role:string) => {
    RosterController.Dispatch({
        type:Actions.SET_ROLE,
        side:side,
        id:id,
        role:role
    });
};

RosterController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/v1\/roster(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(RosterController.GetState())));
        res.end();
    });

    //add skater
    exp.post(/^\/api\/v1\/roster\/skater(\/?)$/i, (req, res) => {
        if(req.body && req.body.team && req.body.id) {
            let skater:SkaterRecord = SkatersController.GetRecord(req.body.id);
            if(skater) {
                RosterController.AddSkater(req.body.team, skater);
            }
        }
        res.end();
    });

    //remove skater from team
    exp.delete(/^\/api\/v1\/roster\/skater(\/?)$/i, (req, res) => {
        if(req.body && req.body.team && req.body.id)
            RosterController.RemoveSkater(req.body.team, req.body.id);
        res.end();
    });

    //reload roster
    exp.purge(/^\/api\/v1\/roster(\/?)$/i, (req, res) => {
        RosterController.LoadSkaters();
        res.end();
    });
};

/*
const remoteCapture = CaptureController.subscribe(() => {
    if(window && window.remoteApps && !window.remoteApps.ROS)
        RosterController.SetState({RemoteShown:CaptureController.getState().Roster.Shown});
});
*/

export default RosterController;