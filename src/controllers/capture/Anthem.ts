import {CreateController, BaseReducer} from './functions';
import vars, { AnthemRecord } from 'tools/vars';
import { ICaptureController, SCaptureControllerState } from './vars';
import { Files } from 'controllers/vars';

interface IAnthemController extends ICaptureController {
    SetRecord:Function;
    SetName:{(name:string)};
}

interface SAnthemController extends SCaptureControllerState {
    Record:AnthemRecord;
}

enum Actions {
    SET_RECORD = "SET_RECORD",
    SET_NAME = 'SET_NAME'
}

export const InitState:SAnthemController = {
    Shown:false,
    className:'',
    Duration:0,
    Delay:0,
    AutoHide:false,
    Record:{
        RecordID:0,
        RecordType:vars.RecordType.Anthem,
        Name:'',
        ShortName:'',
        Number:'',
        Color:'',
        Thumbnail:'',
        Photo:'',
        Background:'',
        Slide:'',
        Acronym:'',
        Biography : ''
    }
};

const SetRecord = (state:SAnthemController, record:AnthemRecord) => {
    return {...state, Record:record};
}

const SetName = (state:SAnthemController, name:string) => {
    return {...state, Record:{...state.Record, Name:name}};
};

const AnthemReducer = (state:SAnthemController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_RECORD :
                return SetRecord(state, action.record);
            case Actions.SET_NAME :
                return SetName(state, action.name);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const AnthemCaptureController:IAnthemController = CreateController('CC-ANT', AnthemReducer);
AnthemCaptureController.SetRecord = async (record:AnthemRecord) => {
    AnthemCaptureController.Dispatch({
        type:Actions.SET_RECORD,
        record:record
    });
};

AnthemCaptureController.SetName = async (name:string) => {
    AnthemCaptureController.Dispatch({
        type:Actions.SET_NAME,
        name:name
    });
};

export default AnthemCaptureController;