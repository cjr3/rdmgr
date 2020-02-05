import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';
import APIStandingsController from 'controllers/api/Standings';

interface IStandingsController extends ICaptureController {
    SetRecords:Function;
}

interface SStandingsState extends SCaptureControllerState {
    Records:Array<any>;
};

enum Actions {
    SET_RECORDS = 'SET_RECORDS'
}

export const InitState:SStandingsState = {
    Shown:false,
    className:'',
    Records:new Array<any>(),
    Duration:10000,
    Delay:0,
    AutoHide:true
};

const SetRecords = (state:SStandingsState, records:Array<any>) => {
    return {...state, Records:records}
};

const StandingsReducer = (state:SStandingsState = InitState, action) => {
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

const StandingsCaptureController:IStandingsController = CreateController('CC-STANDINGS', StandingsReducer);
StandingsCaptureController.SetRecords = async (records:Array<any>) => {
    StandingsCaptureController.Dispatch({
        type:Actions.SET_RECORDS,
        records:records
    });
};

StandingsCaptureController.Get = () => {
    return StandingsCaptureController.GetState().Records;
};

StandingsCaptureController.Load = async () : Promise<boolean> => {
    return new Promise((res, rej) => {
        APIStandingsController.Load().then((records) => {
            if(typeof(records) === 'object') {
                StandingsCaptureController.SetRecords(records);
                res(true);
            } else {
                res(false);
            }
        }).catch((er) => {
            rej(er);
        });
    });
};

APIStandingsController.Subscribe(() => {
    StandingsCaptureController.SetRecords(APIStandingsController.Get());
});

export default StandingsCaptureController;