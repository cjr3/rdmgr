import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';

interface IStateAnnouncer extends SCaptureControllerState {
    Announcer1:string;
    Announcer2:string;
    Duration:number;
}

interface IAnnouncerController extends ICaptureController {
    SetAnnouncers:Function;
}

export const InitState:IStateAnnouncer = {
    Shown:false,
    className:'',
    Announcer1:'',
    Announcer2:'',
    Duration:10000,
    Delay:0,
    AutoHide:false
};

let Timer:any = 0;

enum Actions {
    SET_ANNOUNCERS = "SET_ANNOUNCERS"
}

const SetAnnouncers = (state:IStateAnnouncer, name1:string, name2:string) => {
    return {...state, Announcer1:name1, Announcer2:name2};
};

const AnnouncerReducer = (state:IStateAnnouncer = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.SET_ANNOUNCERS : 
                return SetAnnouncers(state, action.name1, action.name2);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const AnnouncerCaptureController:IAnnouncerController = CreateController('CC-ANC', AnnouncerReducer);
AnnouncerCaptureController.SetAnnouncers = async (name1:string, name2:string) => {
    AnnouncerCaptureController.Dispatch({
        type:Actions.SET_ANNOUNCERS,
        name1:name1,
        name2:name2
    });
};

export default AnnouncerCaptureController;