import {createStore, Unsubscribe, Store} from 'redux';

export enum Actions {
    SET_STATE,
    SET_CURRENT_PANEL,
    TOGGLE_DISPLAY,
    SET_DISPLAY
}

interface UIControllerState {
    Scoreboard:{
        Panel:string;
        Shown:boolean;
    },
    Chat:{
        Shown:boolean;
    },
    Scorekeeper:{
        Shown:boolean;
    },
    PenaltyTracker:{
        Shown:boolean;
    },
    Roster:{
        Shown:boolean;
    },
    CaptureControl:{
        Shown:boolean;
    },
    MediaQueue:{
        Shown:boolean;
    },
    DisplayControls:{
        Shown:boolean;
    },
    ConfigPanel:{
        Shown:boolean;
    }
};

export const InitState:UIControllerState = {
    Scoreboard:{
        Panel:'',
        Shown:false
    },
    Chat:{
        Shown:false
    },
    Scorekeeper:{
        Shown:false
    },
    PenaltyTracker:{
        Shown:false
    },
    Roster:{
        Shown:false
    },
    CaptureControl:{
        Shown:false
    },
    MediaQueue:{
        Shown:false
    },
    DisplayControls:{
        Shown:false
    },
    ConfigPanel:{
        Shown:false
    }
}

function UIControllerReducer(state:UIControllerState = InitState, action:any) {
    try {
        switch(action.type) {
            case Actions.SET_STATE : {
                return Object.assign({}, state, action.values);
            }
            break;

            case Actions.SET_CURRENT_PANEL : {
                if(!state[action.index])
                    return state;

                let current:string = state[action.index].Panel;
                if(current === action.value)
                    current = '';
                else
                    current = action.value;

                return Object.assign({}, state, {
                    [action.index]:Object.assign({}, state[action.index], {
                        Panel:current
                    })
                });
            }
            break;

            case Actions.TOGGLE_DISPLAY : {
                if(!state[action.index])
                    return state;
                return Object.assign({}, state, {
                    [action.index]:Object.assign({}, state[action.index], {
                        Shown:!state[action.index].Shown
                    })
                });
            }
            break;

            case Actions.SET_DISPLAY : {
                if(!state[action.index])
                    return state;

                let obj = Object.assign({}, state);
                for(let key in obj) {
                    obj[key].Shown = false;
                }

                obj[action.index].Shown = action.shown;

                console.log(action.index);

                return obj;
            }
            break;

            default : {
                return state;
            }
            break;
        }
    } catch(er) {
        return state;
    }
}

const UIControllerStore = createStore(UIControllerReducer);

const UIController = {
    Key:'UI',
    Init() {

    },

    async SetState(state:any) {
        UIController.getStore().dispatch({
            type:Actions.SET_STATE,
            values:state
        });
    },

    async SetCurrentPanel(index:string, value:string) {
        UIController.getStore().dispatch({
            type:Actions.SET_CURRENT_PANEL,
            index:index,
            value:value
        });
    },

    async ToggleDisplay(index:string) {
        UIController.getStore().dispatch({
            type:Actions.TOGGLE_DISPLAY,
            index:index
        });
    },

    async SetDisplay(index:string, shown:boolean) {
        UIController.getStore().dispatch({
            type:Actions.SET_DISPLAY,
            index:index,
            shown:shown
        });
    },

    SetScoreboardPanel(value:string) {
        UIController.SetCurrentPanel('Scoreboard', value);
    },

    ShowScoreboard() {
        UIController.SetDisplay('Scoreboard', true);
    },

    ShowCaptureController() {
        UIController.SetDisplay('CaptureControl', true);
    },

    ShowPenaltyTracker() {
        UIController.SetDisplay('PenaltyTracker', true);
    },

    ShowScorekeeper() {
        UIController.SetDisplay('Scorekeeper', true);
    },

    ShowMediaQueue() {
        UIController.SetDisplay('MediaQueue', true);
    },

    ShowRoster() {
        UIController.SetDisplay('Roster', true);
    },

    ToggleChat() {
        UIController.ToggleDisplay('Chat');
    },

    getState() : UIControllerState {
        return UIControllerStore.getState();
    },

    getStore() : Store<UIControllerState> {
        return UIControllerStore;
    },

    subscribe(f) : Unsubscribe {
        return UIController.getStore().subscribe(f);
    }
}

export default UIController;