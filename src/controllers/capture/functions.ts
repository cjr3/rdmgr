import { Store, createStore } from 'redux';
import { SCaptureControllerState, Actions, ICaptureController } from './vars';
import { LoadJsonFile, RecordSavers, StateSavers } from 'controllers/functions.io';

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
    console.trace();
    return {...state, Shown:true};
};

const SetClass = (state:SCaptureControllerState, className:string) => {
    return {...state, className:className};
};

const SetVisibility = (state:SCaptureControllerState, value:boolean) => {
    return {...state, Shown:value};
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
            className:''
        });
    }

    const controller:ICaptureController = {
        Key:key,
        Init(){},
        async Show() {
            controller.Dispatch({type:Actions.SHOW});
        },
        async Hide() {
            controller.Dispatch({type:Actions.HIDE});
        },
        async Toggle() {
            controller.Dispatch({type:Actions.TOGGLE});
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