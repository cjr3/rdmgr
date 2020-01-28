import {CreateController, BaseReducer} from './functions.controllers';
import {IController} from './vars';

interface IClockController extends IController {
    SetJamClockTenths:{(amount:number)};
    SetGameClockTenths:{(amount:number)};
}

interface SClockController {
    JamClockTenths:number;
    GameClockTenths:number;
}

enum Actions {
    SET_JAM_TENTHS = 'SET_JAM_TENTHS',
    SET_GAME_TENTHS = 'SET_GAME_TENTHS'
}

const InitState:SClockController = {
    JamClockTenths:0,
    GameClockTenths:0
}

const SetJamClockTenths = (state:SClockController, amount:number) => {
    return {...state, JamClockTenths:amount};
};

const SetGameClockTenths = (state:SClockController, amount:number) => {
    return {...state, GameClockTenths:amount};
};

const ClockReducer = (state:SClockController = InitState, action:any) => {
    try {
        switch(action.type) {
            case Actions.SET_JAM_TENTHS :
                return SetJamClockTenths(state, action.amount);
            case Actions.SET_GAME_TENTHS :
                return SetGameClockTenths(state, action.amount);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const ClockController:IClockController = CreateController('CLOCKS', ClockReducer);
ClockController.Save = () => {};
ClockController.Load = () => {};
ClockController.SetGameClockTenths = async (amount:number) => {
    ClockController.Dispatch({
        type:Actions.SET_GAME_TENTHS,
        amount:amount
    });
};

ClockController.SetJamClockTenths = async (amount:number) => {
    ClockController.Dispatch({
        type:Actions.SET_JAM_TENTHS,
        amount:amount
    });
};

export default ClockController;