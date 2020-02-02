import { Store, createStore } from 'redux';
import { SCaptureControllerState, Actions, ICaptureController } from './vars';
import { LoadJsonFile, RecordSavers, StateSavers } from 'controllers/functions.io';
import { delay } from 'tools/functions';

let DurationTimer:any = 0;
let DelayTimer:any = 0;
const Interrupt = () => {
    try {clearTimeout(DurationTimer);} catch(er) {}
    try {clearTimeout(DelayTimer);} catch(er) {}
}

const SetState = (state:any, values:any) => {
    return {...state, ...values};
};

const Toggle = (state:SCaptureControllerState) => {
    return {...state, Shown:!state.Shown};
};

const Hide = (state:SCaptureControllerState) => {
    return {...state, Shown:false};
};

const Show = (state:SCaptureControllerState) => {
    return {...state, Shown:true};
};

const SetClass = (state:SCaptureControllerState, className:string) => {
    return {...state, className:className};
};

const SetVisibility = (state:SCaptureControllerState, value:boolean) => {
    return {...state, Shown:value};
};

const SetDelay = (state:SCaptureControllerState, value:number) => {
    return {...state, Delay:Math.abs(value)};
};

const SetDuration = (state:SCaptureControllerState, value:number) => {
    return {...state, Duration:Math.abs(value)};
};

const SetAutoHide = (state:SCaptureControllerState, value:boolean) => {
    return {...state, AutoHide:value};
};

const ToggleAutoHide = (state:SCaptureControllerState) => {
    return {...state, AutoHide:!state.AutoHide};
};

export const BaseReducer = (state:any, action:any) => {
    try {
        switch(action.type) {
            case Actions.SET_STATE :
                return SetState(state, action.state);
            case Actions.SHOW :
                return Show(state);
            case Actions.HIDE :
                return Hide(state);
            case Actions.TOGGLE :
                return Toggle(state);
            case Actions.SET_CLASS :
                return SetClass(state, action.className);
            case Actions.SET_VISIBILITY :
                return SetVisibility(state, action.value);
            case Actions.SET_DELAY :
                return SetDelay(state, action.value);
            case Actions.SET_DURATION :
                return SetDuration(state, action.value);
            case Actions.SET_AUTO_HIDE :
                return SetAutoHide(state, action.value);
            case Actions.TOGGLE_AUTO_HIDE :
                return ToggleAutoHide(state);
            default :
                return state;
        }
    } catch(er) {
        return state;
    }
}

const CreateController = (key:string, reducer?:any) : any => {
    let store:Store;
    if(reducer)
        store = createStore(reducer);
    else {
        store = createStore(BaseReducer, {
            Shown:false,
            className:'',
            Duration:0,
            Delay:0,
            AutoHide:false
        });
    }

    const controller:ICaptureController = {
        Key:key,
        Init(){},
        async Show() {
            Interrupt();
            controller.Dispatch({type:Actions.SHOW});
            if(controller.GetState().Duration > 0 && controller.GetState().AutoHide)
                DurationTimer = setTimeout(controller.Hide, controller.GetState().Duration);
        },
        async Hide() {
            Interrupt();
            controller.Dispatch({type:Actions.HIDE});
        },
        async Toggle() {
            Interrupt();
            controller.Dispatch({type:Actions.TOGGLE});
            if(controller.GetState().Duration > 0 && controller.GetState().AutoHide)
                DurationTimer = setTimeout(controller.Hide, controller.GetState().Duration);
        },
        async SetClass(className:string) {
            controller.Dispatch({
                type:Actions.SET_CLASS,
                className:className
            });
        },
        async SetState(state:any) {
            return new Promise((res) => {
                controller.Dispatch({
                    type:Actions.SET_STATE,
                    state:state
                });
                res(true);
            });
        },
        async SetVisibility(shown:boolean) {
            controller.Dispatch({
                type:Actions.SET_VISIBILITY,
                value:shown
            });
        },
        async SetDelay(value:number) {
            controller.Dispatch({
                type:Actions.SET_DELAY,
                value:value
            });
        },
        async SetDuration(value:number) {
            controller.Dispatch({
                type:Actions.SET_DURATION,
                value:value
            });
        },
        async SetAutoHide(value:boolean) {
            controller.Dispatch({
                type:Actions.SET_AUTO_HIDE,
                value:value
            });
        },
        async ToggleAutoHide() {
            controller.Dispatch({
                type:Actions.TOGGLE_AUTO_HIDE
            });
        },
        GetState() : any {
            return store.getState();
        },
        GetStore() {
            return store;
        },
        Dispatch(action:any) {
            store.dispatch(action);
        },
        Get() {
            return controller.GetStore();
        },
        async Load() : Promise<boolean> {
            return new Promise((res, rej) => {
                if(StateSavers[controller.Key]) {
                    LoadJsonFile(StateSavers[controller.Key].FileName).then((state) => {
                        controller.SetState(state);
                        res(true);
                    }).catch((er) => {
                        rej(`Failed to load capture state: ${er}`);
                    });
                } else {
                    res(false);
                }
            });
        },
        async Save() {
            return new Promise((res, rej) => {
                if(StateSavers[controller.Key]) {
                    StateSavers[controller.Key].Save(JSON.stringify(controller.GetState()))
                    res(true);
                } else {
                    res(false);
                }
            });
        },
        async Set(state:any) {
            return controller.SetState(state);
        },
        Subscribe(f:any) {
            return store.subscribe(f);
        },
        BuildAPI(){},
        _StateSaver(){}
    };
    
    controller._StateSaver = controller.Subscribe(controller.Save);

    return controller;
};

export {
    CreateController
};