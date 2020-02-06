import {Store, Unsubscribe, createStore} from 'redux';
import {IController, ControllerActions} from './vars';
import { LoadJsonFile, SaveFile, StateSavers } from './functions.io';

const SetState = (state:any, values:object) => {
    return {...state, ...values};
};

const SetControllerState = async (controller:IController, state:any) : Promise<boolean> => {
    return new Promise((res) => {
        controller.Dispatch({
            type:ControllerActions.SET_STATE,
            state:state
        });
        res(true);
    });
};

export const BaseReducer = (state:any, action:any) => {
    try {
        switch(action.type) {
            case ControllerActions.SET_STATE :
                return SetState(state, action.state);
            default :
                return state;
        }
    } catch(er) {
        return state;
    }
};

const CreateController = (key:string, reducer?:any) : any => {
    let store:Store;
    if(reducer)
        store = createStore(reducer);
    else {
        store = createStore(BaseReducer, {});
    }
    let controller:IController = {
        Key:key,
        Init() {},
        async Set() : Promise<boolean> {
            return new Promise((res) => res(true));
        },

        Get() : any {
            return store.getState();
        },

        SetState(state:any) : Promise<boolean> {
            return SetControllerState(controller, state);
        },

        async Load() : Promise<boolean> {
            return new Promise((res, rej) => {
                if(StateSavers[controller.Key]) {
                    LoadJsonFile(StateSavers[controller.Key].FileName).then((data) => {
                        if(data) {
                            controller.SetState(data);
                            res(true);
                        } else {
                            rej('Failed to load controller state: Data is invalid or missing.');
                        }
                    }).catch((er) => {
                        rej(er);
                    })
                } else {
                    res(false);
                }
            })
        },

        async Save() : Promise<boolean> {
            return new Promise((res, rej) => {
                if(StateSavers[controller.Key]) {
                    try {
                        StateSavers[controller.Key].Save(JSON.stringify(controller.GetState(), null, 4));
                    } catch(er) {
                        
                    } finally {
                        res(true);
                    }
                } else {
                    //rej(`No state saver for ${controller.Key}`);
                    res(false);
                }
            });
        },

        Dispatch(action:any) {
            controller.GetStore().dispatch(action);
        },

        GetState() : any {
            return store.getState();
        },

        GetStore() : Store<any> {
            return store;
        },

        Subscribe(f:any) : Unsubscribe|undefined {
            if(store)
                return store.subscribe(f);
        },

        BuildAPI() {},
        _StateSaver(){}
    };

    controller._StateSaver = controller.Subscribe(controller.Save);

    return controller;
};

export {
    CreateController,
    SetControllerState
};