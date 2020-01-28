import {CreateController, BaseReducer} from './functions';
import { ICaptureController, SCaptureControllerState } from './vars';

interface IBannerController extends ICaptureController {
    ToggleClocks:Function;
    SetBackground:Function;
}

interface SScorebanner extends SCaptureControllerState {
    ClocksShown:boolean;
    BackgroundImage?:string|null;
}

export const InitBannerState:SScorebanner = {
    Shown:false,
    className:'',
    ClocksShown:true,
    BackgroundImage:''
};

enum BannerActions {
    TOGGLE_CLOCKS = "TOGGLE_CLOCKS",
    SET_BACKGROUND = 'SET_BACKGROUND'
}

const SetBannerBackground = (state:SScorebanner, background:string|null) => {
    return {...state, BackgroundImage:background};
}

const ToggleBannerClocks = (state:SScorebanner) => {
    return {...state, ClocksShown:!state.ClocksShown};
}

const BannerReducer = (state:SScorebanner = InitBannerState, action) => {
    try {
        switch(action.type) {
            case BannerActions.SET_BACKGROUND :
                return SetBannerBackground(state, action.src);
            case BannerActions.TOGGLE_CLOCKS :
                return ToggleBannerClocks(state);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const ScoreboardCaptureController:ICaptureController = CreateController('CC-SB');
const JamClockCaptureController:ICaptureController = CreateController('CC-SB-JCLOCK');
const JamCounterCaptureController:ICaptureController = CreateController('CC-SB-JAM');

const ScorebannerCaptureController:IBannerController = CreateController('CC-SB-BANNER', BannerReducer);
ScorebannerCaptureController.ToggleClocks = () => {
    ScorebannerCaptureController.Dispatch({
        type:BannerActions.TOGGLE_CLOCKS
    });
};

ScorebannerCaptureController.SetBackground = (src:string|null) => {
    ScorebannerCaptureController.Dispatch({
        type:BannerActions.SET_BACKGROUND,
        src:src
    });
};

export default ScoreboardCaptureController;
export {
    JamClockCaptureController,
    JamCounterCaptureController,
    ScorebannerCaptureController
};