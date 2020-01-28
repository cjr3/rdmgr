import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';

interface ICaptureMonitor extends ICaptureController {
    SetBounds:Function;
}

enum Actions {
    SET_BOUNDS = "SET_BOUNDS"
}

interface SMonitor extends SCaptureControllerState {
    ID:string;
    Width:number;
    Height:number;
}

const InitState:SMonitor = {
    Shown:false,
    className:'',
    ID:'',
    Width:1280,
    Height:720
};

const SetMonitorBounds = (state:SMonitor, width:number, height:number) => {
    return {...state, Width:width, Height:height};
};

const MonitorReducer = (state:SMonitor = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_BOUNDS :
                return SetMonitorBounds(state, action.width, action.height);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const MonitorCaptureController:ICaptureMonitor = CreateController('CC-MON', MonitorReducer);
MonitorCaptureController.SetBounds = async (width:number, height:number) => {
    MonitorCaptureController.Dispatch({
        type:Actions.SET_BOUNDS,
        width:width,
        height:height
    });
};

export default MonitorCaptureController;