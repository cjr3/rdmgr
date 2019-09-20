import {createStore} from 'redux';
import DataController from 'controllers/DataController';

const ADD_TICKET = 'ADD_TICKET';
const REMOVE_TICKET = 'REMOVE_TICKET';
const CLEAR_TICKETS = 'CLEAR_TICKETS';
const SET_STATE = 'SET_STATE';

export interface SRaffleController {
    Tickets:Array<string>
}

//Initial state
export const InitState:SRaffleController = {
    Tickets:[]
};

/**
 * Reducer for the raffle controller.
 * @param {Object} state 
 * @param {Object} action 
 */
function RaffleReducer(state:SRaffleController = InitState, action) {
    var tickets:Array<string> = [];
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        //Adds a ticket
        case ADD_TICKET :
            tickets = state.Tickets;
            if(tickets.length >= 3) {
                [tickets[0], tickets[1]] = [tickets[1], tickets[2]]
                tickets[2] = action.value;
            } else {
                tickets.push(action.value);
            }
            return Object.assign({}, state, {Tickets:tickets});

        //Remove a ticket
        case REMOVE_TICKET :
            if(state.Tickets.length <= 0)
                return state;
            tickets = state.Tickets;
            if(!Number.isNaN(action.index)) {
                if(tickets[action.index]) {
                    tickets.splice(action.index, 1);
                } else {
                    return state;
                }
            } else {
                //remove the last ticket
                tickets.pop();
            }
            return Object.assign({}, state, {Tickets:tickets});

        //Clear all tickets
        case CLEAR_TICKETS :
            return Object.assign({}, state, {Tickets:[]});

        default :
            return state;
    }
}

//main store
const RaffleStore = createStore(RaffleReducer);

/**
 * Controller for raffle tickets.
 */
const RaffleController = {
    Key:'RAF',
    /**
     * Sets the state of the raffle.
     * @param {Object} state 
     */
    SetState(state) {
        RaffleController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    /**
     * Adds a ticket.
     * @param {String} value 
     */
    Add(value) {
        RaffleController.getStore().dispatch({
            type:ADD_TICKET,
            value:value
        });
    },

    /**
     * Removes the given ticket. If index is not provided, the last ticket added is removed.
     * @param {Number} index 
     */
    Remove(index:number = 0) {
        RaffleController.getStore().dispatch({
            type:REMOVE_TICKET,
            index:index
        });
    },

    /**
     * Clears all tickets.
     */
    Clear() {
        RaffleController.getStore().dispatch({
            type:CLEAR_TICKETS
        });
    },

    /**
     * Gets the current state.
     * @return {Object}
     */
    getState() {
        return RaffleStore.getState();
    },

    /**
     * Gets the store.
     * @return {Object}
     */
    getStore() {
        return RaffleStore;
    },

    /**
     * Subscribes to state changes.
     * @param {Function} f A function to call when the state changes
     */
    subscribe(f) {
        return RaffleStore.subscribe(f);
    },

    /**
     * Builds the API for the RaffleController
     */
    buildAPI() {
        const server = window.LocalServer;
        const exp = server.ExpressApp;

        //get state
        exp.get(/^\/api\/raffle(\/?)$/i, (req, res) => {
            res.send(server.PrepareObjectForSending(DataController.PrepareObjectForSending(RaffleController.getState())));
            res.end();
        });

        //add ticket
        exp.post(/^\/api\/raffle(\/?)$/i, (req, res) => {
            if(req.body && req.body.ticket) {
                RaffleController.Add(req.body.ticket);
                res.send("OK");
            } else {
                res.send("Please provide a ticket number.");
            }
            res.end();
        });

        //remove ticket
        exp.delete(/^\/api\/raffle\/([0-9]?)$/i, (req, res) => {
            if(req.params && typeof(req.params[0]) !== 'undefined' && !Number.isNaN(req.params[0])) {
                RaffleController.Remove(parseInt( req.params[0] ) );
            } else {
                RaffleController.Remove(0);
            }
            res.send("OK");
            res.end();
        });

        //clear all
        exp.purge(/^\/api\/raffle(\/?)$/i, (req, res) => {
            RaffleController.Clear();
            res.send("OK");
            res.end();
        });
    }
}

export default RaffleController;