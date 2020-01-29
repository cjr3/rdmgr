import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';
import APIScheduleController from '../api/Schedule';

interface IScheduleController extends ICaptureController {
    SetRecords:Function;
}

interface SScheduleState extends SCaptureControllerState {
    Records:Array<any>;
};

enum Actions {
    SET_RECORDS = "SET_RECORDS"
}

export const InitState:SScheduleState = {
    Shown:false,
    className:'',
    Records:new Array<any>(),
    Duration:10000,
    Delay:0
};

const SetRecords = (state:SScheduleState, records:Array<any>) => {
    return {...state, Records:records}
};

const ScheduleReducer = (state:SScheduleState = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_RECORDS :
                return SetRecords(state, action.records);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const ScheduleCaptureController:IScheduleController = CreateController('CC-SCHEDULE', ScheduleReducer);
ScheduleCaptureController.SetRecords = async (records:Array<any>) => {
    ScheduleCaptureController.Dispatch({
        type:Actions.SET_RECORDS,
        records:records
    });
};

ScheduleCaptureController.Get = () : Array<any> => {
    return ScheduleCaptureController.GetState().Records;
};

ScheduleCaptureController.Load = async () : Promise<boolean> => {
    return new Promise((res, rej) => {
        APIScheduleController.Load().then((records) => {
            if(typeof(records) === 'object') {
                ScheduleCaptureController.SetRecords(records);
                res(true);
            } else {
                res(false);
            }
        }).catch((er) => {
            rej(er);
        });
    });
};

export default ScheduleCaptureController;