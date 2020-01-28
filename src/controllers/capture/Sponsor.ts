import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';
import { Files } from 'controllers/vars';

interface ISponsorController extends ICaptureController {
    SetDelay:Function;
}

interface SSponsor extends SCaptureControllerState {
    Delay:number;
}

enum Actions {
    SET_DELAY = 'SET_DELAY'
}

export const InitState:SSponsor = {
    Shown:false,
    className:'',
    Delay:10000
}

const SetDelay = (state:SSponsor, delay:number) => {
    return {...state, Delay:delay};
}

const SponsorReducer = (state:SSponsor = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_DELAY :
                return SetDelay(state, action.delay);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const SponsorCaptureController:ISponsorController = CreateController('CC-SPN', SponsorReducer);
SponsorCaptureController.SetDelay = (delay:number) => {
    SponsorCaptureController.Dispatch({
        type:Actions.SET_DELAY,
        delay:delay
    });
};

export default SponsorCaptureController;