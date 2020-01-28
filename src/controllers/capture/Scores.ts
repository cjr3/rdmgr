import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';
import APIScoresController from 'controllers/api/Scores';

interface IScoresController extends ICaptureController {
    SetRecords:Function;
}

interface SScoresState extends SCaptureControllerState {
    Records:Array<any>;
};

enum Actions {
    SET_RECORDS = 'SET_RECORDS'
}

export const InitState:SScoresState = {
    Shown:false,
    className:'',
    Records:new Array<any>()
};

const SetRecords = (state:SScoresState, records:Array<any>) => {
    return {...state, Records:records}
};

const ScoresReducer = (state:SScoresState = InitState, action) => {
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

const ScoresCaptureController:IScoresController = CreateController('CC-SCORES', ScoresReducer);
ScoresCaptureController.SetRecords = async (records:Array<any>) => {
    ScoresCaptureController.Dispatch({
        type:Actions.SET_RECORDS,
        records:records
    });
};

ScoresCaptureController.Get = () : Array<any> => {
    return ScoresCaptureController.GetState().Records;
};

ScoresCaptureController.Load = async () : Promise<boolean> => {
    return new Promise((res, rej) => {
        APIScoresController.Load().then((records) => {
            if(typeof(records) === 'object') {
                ScoresCaptureController.SetRecords(records);
                res(true);
            } else {
                res(false);
            }
        }).catch((er) => {
            rej(er);
        })
    });
};

export default ScoresCaptureController;