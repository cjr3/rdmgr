import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';
import { PrepareObjectForSending } from './functions';
import keycodes from 'tools/keycodes';

interface IRaffleController extends IController {
    Add:Function;
    Remove:Function;
    Clear:Function;
    onKeyUp:Function;
}

enum Actions {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    CLEAR = 'CLEAR'
}

interface SRaffleController {
    Tickets:Array<string>;
}

//Initial state
export const InitState:SRaffleController = {
    Tickets:[]
};

const AddTicket = (state:SRaffleController, ticket:string) => {
    let tickets:Array<string> = state.Tickets.slice();
    if(tickets.length >= 3) {
        tickets.shift();
    }
    tickets.push(ticket);
    return {...state, Tickets:tickets.filter(t => (t != ''))};
};

const RemoveTicket = (state:SRaffleController, index?:number) => {
    if(state.Tickets.length <= 0)
        return state;

    if(index === undefined) {
        let tickets:Array<string> = state.Tickets.slice();
        tickets.shift();
        return {...state, Tickets:tickets}
    }
    
    if(state.Tickets[index] === undefined)
        return state;
    return {...state, Tickets:state.Tickets.filter((t, i) => (i != index && t != ''))};
};

const RemoveLastTicket = (state:SRaffleController) => {
    if(state.Tickets.length <= 0)
        return state;
    //let tickets:Array<string> = state.Tickets.slice(0, state.Tickets.length - 1);
    return {...state, Tickets:state.Tickets.slice(0, state.Tickets.length - 1)};
};

const ClearTickets = (state:SRaffleController) => {
    return {...state, Tickets:new Array<string>()};
};

/**
 * Reducer for the raffle controller.
 * @param {Object} state 
 * @param {Object} action 
 */
const RaffleReducer = (state:SRaffleController = InitState, action) => {
    try {
        switch(action.type) {
            //Adds a ticket
            case Actions.ADD :
                return AddTicket(state, action.ticket);
    
            //Remove a ticket
            case Actions.REMOVE :
                if(!Number.isNaN(action.index))
                    return RemoveTicket(state, action.index);
                return RemoveLastTicket(state);
    
            //Clear all tickets
            case Actions.CLEAR :
                return ClearTickets(state);
    
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const RaffleController:IRaffleController = CreateController('RAF', RaffleReducer);

RaffleController.Get = () : Array<string> => {
    return RaffleController.GetState().Tickets;
};

RaffleController.Add = (ticket:string) => {
    RaffleController.Dispatch({
        type:Actions.ADD,
        ticket:ticket
    });
};

RaffleController.Remove = (index?:number) => {
    RaffleController.Dispatch({
        type:Actions.REMOVE,
        index:index
    });
};

RaffleController.Clear = () => {
    RaffleController.Dispatch({
        type:Actions.CLEAR
    });
};

RaffleController.BuildAPI = async () => {
    const server = window.LocalServer;
    const exp = server.ExpressApp;

    //get state
    exp.get(/^\/api\/raffle(\/?)$/i, (req, res) => {
        res.send(server.PrepareObjectForSending(PrepareObjectForSending(RaffleController.GetState())));
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
};

export default RaffleController;