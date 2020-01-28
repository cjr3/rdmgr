import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';

interface IPenaltyController extends ICaptureController {
    SetDuration:Function;
}

interface SPenalty extends SCaptureControllerState {
    Duration:number;
}

enum Actions {
    SET_DURATION = "SET_DURATION"
}

export const InitState:SPenalty = {
    Shown:false,
    className:'',
    Duration:7500
};

const SetDuration = (state:SPenalty, duration:number) => {
    return {...state, Duration:duration};
}

const PenaltyReducer = (state:SPenalty = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_DURATION :
                return SetDuration(state, action.duration);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const PenaltyCaptureController:IPenaltyController = CreateController('CC-PEN', PenaltyReducer);
PenaltyCaptureController.SetDuration = (duration:number) => {
    PenaltyCaptureController.Dispatch({
        type:Actions.SET_DURATION,
        duration:duration
    });
};

export default PenaltyCaptureController;