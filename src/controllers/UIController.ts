import {IController, Files} from './vars';
import {CreateController, BaseReducer} from './functions.controllers';


type Panels = 
    'Scoreboard' | 'Chat' | 'Scorekeeper' | 'PenaltyTracker' |
    'Roster' | 'CaptureControl' | 'MediaQueue' | 'DisplayControls' |
    'ConfigPanel' | 'APILogin';

interface IUIController extends IController {
    SetCurrentPanel:{(index:Panels, value:string)};
    ToggleDisplay:{(index:Panels)};
    SetDisplay:{(index:Panels, shown:boolean)};
    SetScoreboardPanel:{(value:string)};
    ShowScoreboard:Function;
    ShowCaptureController:Function;
    ShowPenaltyTracker:Function;
    ShowScorekeeper:Function;
    ShowMediaQueue:Function;
    ShowRoster:Function;
    ToggleChat:Function;
};

export enum Actions {
    SET_CURRENT_PANEL = 'SET_CURRENT_PANEL',
    TOGGLE_DISPLAY = 'TOGGLE_DISPLAY',
    SET_DISPLAY = 'SET_DISPLAY'
}

interface SUIControllerDisplay {
    Panel:string;
    Shown:boolean;
    Application:boolean;
}

interface SUIController {
    Scoreboard:SUIControllerDisplay;
    Chat:SUIControllerDisplay;
    Scorekeeper:SUIControllerDisplay;
    PenaltyTracker:SUIControllerDisplay;
    Roster:SUIControllerDisplay;
    CaptureControl:SUIControllerDisplay;
    MediaQueue:SUIControllerDisplay;
    DisplayControls:SUIControllerDisplay;
    ConfigPanel:SUIControllerDisplay;
    APILogin:SUIControllerDisplay;
};

export const InitState:SUIController = {
    Scoreboard:{
        Panel:'',
        Shown:true,
        Application:true
    },
    Chat:{
        Panel:'',
        Shown:false,
        Application:false
    },
    Scorekeeper:{
        Panel:'',
        Shown:false,
        Application:true
    },
    PenaltyTracker:{
        Panel:'',
        Shown:false,
        Application:true
    },
    Roster:{
        Panel:'',
        Shown:false,
        Application:true
    },
    CaptureControl:{
        Panel:'',
        Shown:false,
        Application:true
    },
    MediaQueue:{
        Panel:'',
        Shown:false,
        Application:true
    },
    DisplayControls:{
        Panel:'',
        Shown:false,
        Application:false
    },
    ConfigPanel:{
        Panel:'',
        Shown:false,
        Application:false
    },
    APILogin:{
        Panel:'',
        Shown:false,
        Application:false
    }
}

const SetCurrentPanel = (state:SUIController, index:Panels, value:string) => {
    let current:string = state[index].Panel;
    if(current == value)
        current = '';
    else
        current = value;
    
    return Object.assign({}, state, {
        [index]:Object.assign({}, state[index], {
            Panel:current
        })
    });
};

const ToggleDisplay = (state:SUIController, index:Panels) => {
    return Object.assign({}, state, {
        [index]:Object.assign({}, state[index], {
            Shown:!state[index].Shown
        })
    });
};

const SetDisplay = (state:SUIController, index:Panels, shown:boolean) => {
    let obj = {...state};
    if(obj[index].Application) {
        for(let key in obj) {
            if(obj[key].Application)
                obj[key].Shown = false;
        }
    }
    obj[index].Shown = shown;
    return obj;
};

const UIReducer = (state:SUIController = InitState, action:any) => {
    try {
        switch(action.type) {
            case Actions.SET_CURRENT_PANEL :
                return SetCurrentPanel(state, action.index, action.value);
            case Actions.TOGGLE_DISPLAY :
                return ToggleDisplay(state, action.index);
            case Actions.SET_DISPLAY :
                return SetDisplay(state, action.index, action.shown);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
};

const UIController:IUIController = CreateController('UI', UIReducer);
UIController.SetCurrentPanel = async (index:Panels, value:string) => {
    UIController.Dispatch({
        type:Actions.SET_CURRENT_PANEL,
        index:index,
        value:value
    });
};
UIController.ToggleDisplay = async (index:Panels) => {
    UIController.Dispatch({
        type:Actions.TOGGLE_DISPLAY,
        index:index
    });
};

UIController.SetDisplay = async (index:Panels, shown:boolean) => {
    UIController.Dispatch({
        type:Actions.SET_DISPLAY,
        index:index,
        shown:shown
    });
};

UIController.SetScoreboardPanel = async (value:string) => {
    UIController.SetCurrentPanel('Scoreboard', value);
};

UIController.ShowScoreboard = async () => {
    UIController.SetDisplay('Scoreboard', true);
};
UIController.ShowCaptureController = async () => {
    UIController.SetDisplay('CaptureControl', true);
};
UIController.ShowPenaltyTracker = async () => {
    UIController.SetDisplay('PenaltyTracker', true);
};
UIController.ShowScorekeeper = async () => {
    UIController.SetDisplay('Scorekeeper', true);
};
UIController.ShowMediaQueue = async () => {
    UIController.SetDisplay('MediaQueue', true);
};
UIController.ShowRoster = async () => {
    UIController.SetDisplay('Roster', true);
};
UIController.ToggleChat = async () => {
    UIController.ToggleDisplay('Chat');
};

export default UIController;