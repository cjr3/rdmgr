import {createStore} from 'redux';
import DataController from 'controllers/DataController';
import ScoreboardController from 'controllers/ScoreboardController';
import {SkaterRecord} from 'tools/vars';
import { IGamepadButtonMap } from './GameController';
import CaptureController from './CaptureController';

const SET_STATE = 'SET_STATE';
const SET_TEAM = 'SET_TEAM';
const SET_SKATERS = 'SET_SKATERS';
const ADD_SKATER = 'ADD_SKATER';
const REMOVE_SKATER = 'REMOVE_SKATER';
const SWAP_SKATERS = 'SWAP_SKATERS';
const SET_CURRENT_SKATER = 'SET_CURRENT_SKATER';
const NEXT_SKATER = 'NEXT_SKATER';
const PREV_SKATER = 'PREV_SKATER';

export interface SRosterController {
    CurrentTeam:string,
    SkaterIndex:number,
    TeamA:{
        Side:string,
        Thumbnail:string,
        Slide:string,
        Skaters:Array<SkaterRecord>
    },
    TeamB:{
        Side:string,
        Thumbnail:string,
        Slide:string,
        Skaters:Array<SkaterRecord>
    }
}

export const InitState:SRosterController = {
    CurrentTeam:'A',
    SkaterIndex:-1,
    TeamA:{
        Side:'A',
        Thumbnail:'',
        Slide:'',
        Skaters:[]
    },
    TeamB:{
        Side:'B',
        Thumbnail:'',
        Slide:'',
        Skaters:[]
    }
};

/**
 * Reducer for the Roster
 * @param {Object} state 
 * @param {Object} action 
 */
function RosterReducer(state:SRosterController = InitState, action) {
    var key = (action.team === 'A') ? 'TeamA' : 'TeamB';
    var index = 0;
    var skaters:Array<SkaterRecord> = [];
    var team = state.CurrentTeam;
    switch(action.type) {
        //set the state
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //update a team
        case SET_TEAM :
            return Object.assign({}, state, {
                SkaterIndex:-1,
                [key]:Object.assign({}, state[key], {
                    Thumbnail:action.record.Thumbnail,
                    Slide:action.record.Slide
                })
            });

        //set a team's skaters
        case SET_SKATERS :
            action.records.forEach((s) => {
                s.Penalties = [];
                s.Position = null;
            });
            return Object.assign({}, state, {
                SkaterIndex:-1,
                [key]:Object.assign({}, state[key], {
                    Skaters:action.records
                })
            });

        //Sets the current skater to display from the roster
        case SET_CURRENT_SKATER :
            return Object.assign({}, state, {
                CurrentTeam:action.team,
                SkaterIndex:action.index
            });

        //add a skater to a team
        case ADD_SKATER :
            skaters = state[key].Skaters.slice();
            index = skaters.findIndex((s) => {
                return (s.RecordID === action.record.RecordID);
            });
            if(index >= 0) {
                skaters[index] = Object.assign({}, action.record);
            } else {
                action.record.Penalties = [];
                action.record.Position = null;
                skaters.push(Object.assign({}, action.record));
            }
            return Object.assign({}, state, {
                SkaterIndex:-1,
                [key]:Object.assign({}, state[key], {
                    Skaters:skaters
                })
            });

        //remove a skater from a team
        case REMOVE_SKATER :
            skaters = state[key].Skaters.slice();
            index = skaters.findIndex((s) => {
                return (s.RecordID === action.record.RecordID);
            });
            if(index < 0)
                return state;
            skaters.splice(index, 1);
            return Object.assign({}, state, {
                SkaterIndex:-1,
                [key]:Object.assign({}, state[key], {
                    Skaters:skaters
                })
            });

        //Swaps skaters on a given team
        case SWAP_SKATERS :
            skaters = state[key].Skaters.slice();
            DataController.MoveElement(skaters, action.indexA, action.indexB, action.right);
            return Object.assign({}, state, {
                SkaterIndex:-1,
                [key]:Object.assign({}, state[key], {
                    Skaters:skaters
                })
            });

        case NEXT_SKATER :
            index = state.SkaterIndex + 1;
            team = state.CurrentTeam;
            if(team === 'A') {
                if(index >= state.TeamA.Skaters.length) {
                    index = -1;
                    team = 'B';
                }
            } else {
                if(index >= state.TeamB.Skaters.length) {
                    index = -1;
                }
            }

            return Object.assign({}, state, {
                CurrentTeam:team,
                SkaterIndex:index
            });

        case PREV_SKATER :
            index = state.SkaterIndex - 1;
            team = state.CurrentTeam;
            if(team === 'B') {
                if(index < -1) {
                    index = state.TeamA.Skaters.length - 1;
                    team = 'A';
                }
            }

            if(index < -1) {
                index = -1;
            }

            return Object.assign({}, state, {
                CurrentTeam:team,
                SkaterIndex:index
            });


        default :
            return state;
    }
}

const RosterStore = createStore(RosterReducer);

/**
 * Controller for the roster, to set which skaters appear
 * on the scorekeeper, penalty tracker, and intros.
 */
const RosterController = {
    Key:'ROS',
    /**
     * Sets the state of the roster.
     * @param {Object} values 
     */
    SetState(values) {
        RosterController.getStore().dispatch({
            type:SET_STATE,
            values:values
        });
    },

    /**
     * Adds the skater to the given team.
     * @param {String} team 
     * @param {Object} skater 
     */
    AddSkater(team, skater) {
        RosterController.getStore().dispatch({
            type:ADD_SKATER,
            team:team,
            record:skater
        });
    },

    /**
     * Removes a skater from the given team.
     * @param {String} team 
     * @param {Object} skater 
     */
    RemoveSkater(team, skater) {
        RosterController.getStore().dispatch({
            type:REMOVE_SKATER,
            team:team,
            record:skater
        });
    },

    /**
     * Swaps skaters in the roster.
     * @param {String} team 
     * @param {Number} indexA 
     * @param {Number} indexB 
     * @param {Boolean} right
     */
    SwapSkaters(team, indexA, indexB, right = false) {
        RosterController.getStore().dispatch({
            type:SWAP_SKATERS,
            team:team,
            indexA:indexA,
            indexB:indexB,
            right:right
        });
    },

    /**
     * Sets the skaters for the given team.
     * @param {String} team 
     * @param {Array} skaters 
     */
    SetSkaters(team, skaters) {
        RosterController.getStore().dispatch({
            type:SET_SKATERS,
            team:team,
            records:skaters
        });
    },

    /**
     * Loads the skaters for both teams, based on the scoreboard.
     */
    async LoadSkaters() {
        RosterController.SetSkaters('A', DataController.getTeamSkaters(ScoreboardController.getState().TeamA.ID));
        RosterController.SetSkaters('B', DataController.getTeamSkaters(ScoreboardController.getState().TeamB.ID));
    },

    /**
     * Shows the next skater
     */
    Next() {
        let state = RosterController.getState();
        let capture = CaptureController.getState().Roster;
        let team = state.CurrentTeam;
        let index = state.SkaterIndex;
        if(!capture.Shown && team === 'A' && index < 0) {
            CaptureController.ToggleRoster();
            return;
        }

        if(!capture.Shown && team === 'B' && (index+1) >= state.TeamB.Skaters.length) {
             RosterController.SetSkater('A', -1);
             return;
        }

        if(team === 'A' && (index+1) >= state.TeamA.Skaters.length) {
            if(capture.Shown) {
                CaptureController.ToggleRoster();
            } else {
                RosterController.getStore().dispatch({
                    type:NEXT_SKATER
                });
                CaptureController.ToggleRoster();
            }
        } else {
            if(capture.Shown) {
                if(team === 'B' && (index+1) >= state.TeamB.Skaters.length) {
                    CaptureController.ToggleRoster();
                } else {
                    RosterController.getStore().dispatch({
                        type:NEXT_SKATER
                    });
                }
            } else {
                CaptureController.ToggleRoster();
            }
        }
        //RosterController.getStore().dispatch({
        //    type:NEXT_SKATER
        //});
    },

    /**
     * Shows the previous skater
     */
    Prev() {
        let state = RosterController.getState();
        let capture = CaptureController.getState().Roster;
        let team = state.CurrentTeam;
        let index = state.SkaterIndex;
        if(team === 'A' && index < 0) {
            CaptureController.ToggleRoster();
            return;
        } else if(team === 'A' && (index - 1) === -1) {
            RosterController.getStore().dispatch({
                type:PREV_SKATER
            });
            return;
        }

        if(team === 'B' && (index-1) === -1) {
            RosterController.getStore().dispatch({
                type:PREV_SKATER
            });
            return;
        }
        
        if(team === 'B' && (index-1) < 0) {
            if(capture.Shown) {
                CaptureController.ToggleRoster();
            } else {
                RosterController.getStore().dispatch({
                    type:PREV_SKATER
                });
                CaptureController.ToggleRoster();
            }
        } else {
            if(capture.Shown) {
                RosterController.getStore().dispatch({
                    type:PREV_SKATER
                });
            } else {
                CaptureController.ToggleRoster();
            }
        }

        // RosterController.getStore().dispatch({
        //     type:PREV_SKATER
        // });
    },

    /**
     * Sets the current skater.
     * @param {String} team 
     * @param {Number} index 
     */
    SetSkater(team, index) {
        RosterController.getStore().dispatch({
            type:SET_CURRENT_SKATER,
            team:team,
            index:index
        })
    },

    onKeyUp(e) {

    },

    /**
     * Triggered when the user presses a button on the game controller
     * @param buttons IGamepadButtonMap
     */
    onGamepadButtonPress(buttons:IGamepadButtonMap) {
        //LEFT
        if(buttons.LEFT.pressed || buttons.UP.pressed) {
            if(buttons.R2.pressed) {
                RosterController.SetSkater('A', -1);
                CaptureController.SetRosterVisibility(false);
            } else {
                RosterController.Prev();
            }
            return;
        }

        //RIGHT
        if(buttons.RIGHT.pressed || buttons.DOWN.pressed) {
            RosterController.Next();
            return;
        }

        //Y
        if(buttons.Y.pressed) {
            CaptureController.ToggleRoster();
            return;
        }
    },

    /**
     * Triggered when the user holds a button on the game controller
     * @param buttons IGamepadButtonMap
     */
    onGamepadButtonDown(buttons:IGamepadButtonMap) {
        if(buttons.LEFT.pressed) {

        }
    },

    /**
     * Gets the current state.
     */
    getState() {
        return RosterStore.getState();
    },

    /**
     * Gets the redux store.
     */
    getStore() {
        return RosterStore;
    },

    /**
     * Adds a clojure for state changes.
     * @param {Function} f 
     */
    subscribe(f) {
        return RosterStore.subscribe( f );
    },

    /**
     * Builds the REST API for this controller.
     */
    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/roster(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(RosterController.getState())));
            res.end();
        });

        //add skater
        exp.post(/^\/api\/roster\/skater(\/?)$/i, (req, res) => {
            if(req.body && req.body.team && req.body.id) {
                var skater = DataController.getSkater(req.body.id);
                if(skater) {
                    RosterController.AddSkater(req.body.team, skater);
                }
            }
            res.end();
        });

        //remove skater from team
        exp.delete(/^\/api\/roster\/skater(\/?)$/i, (req, res) => {
            if(req.body && req.body.team && req.body.id) {
                var skater = DataController.getSkater(req.body.id);
                if(skater) {
                    RosterController.RemoveSkater(req.body.team, skater);
                }
            }
            res.end();
        });

        //reload roster
        exp.purge(/^\/api\/roster(\/?)$/i, (req, res) => {
            RosterController.LoadSkaters();
            res.end();
        });
    }
};

export default RosterController;