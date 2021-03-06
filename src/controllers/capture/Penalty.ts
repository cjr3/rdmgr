import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';

interface IPenaltyController extends ICaptureController {
}

interface SPenalty extends SCaptureControllerState {
    
}

export const InitState:SPenalty = {
    Shown:false,
    className:'',
    Duration:7500,
    Delay:0,
    AutoHide:true
};

const PenaltyReducer = (state:SPenalty = InitState, action) => {
    return BaseReducer(state, action);
}

const PenaltyCaptureController:IPenaltyController = CreateController('CC-PEN', PenaltyReducer);
export default PenaltyCaptureController;