import {createStore, Store, Unsubscribe} from 'redux';
import vars from 'tools/vars';

export enum Actions {
    SET_STATE,
    SET_TIME,
    SET_STATUS
}

interface ClockState {
    hour:number;
    minute:number;
    second:number;
    tenths:number;
    status:number;
    maxSeconds:number;
}

const InitState:ClockState = {
    hour:0,
    minute:0,
    second:0,
    tenths:0,
    status:vars.Clock.Status.Ready,
    maxSeconds:60
};

function ClockReducer(state:ClockState = InitState, action:any) {
    try {
        switch(action.type) {
            case Actions.SET_STATE : {
                return Object.assign({}, state, action.state);
            }
            case Actions.SET_TIME : {
                if(state.status === vars.Clock.Status.Running)
                    return state;
                
                let stenths = action.tenths;
                let hour = action.hour;
                let minute = action.minute;
                let second = action.second;
                let tenths = action.tenths;
                if(hour > state.hour)
                    stenths = tenths;
                else if(hour === state.hour && minute > state.minute)
                    stenths = tenths;
                return Object.assign({}, state, {
                    hour:hour,
                    minute:minute,
                    second:second,
                    tenths:stenths
                });
            }
            break;

            case Actions.SET_STATUS : {
                
            }
            break;

            default : {return state;}
            break;
        }
    } catch(er) {
        return state;
    }
}

class ClockController {

    protected onTick:Function|undefined;
    protected onDone:Function|undefined;
    protected store:Store<ClockState>|undefined;
    protected state:ClockState|undefined;

    constructor(props:{
        hour:number;
        minute:number;
        second:number;
        max:number;
        onTick:Function;
        onDone:Function;
        status?:number;
    }) {
        this.state = Object.assign({}, InitState);
        this.state.hour = props.hour;
        this.state.minute = props.minute;
        this.state.maxSeconds = props.max;
        if(props.status !== undefined)
            this.state.status = props.status;

        this.store = createStore(ClockReducer);
    }

    /**
     * Sets the clock time.
     * The time cannot be set when the clock is running.
     * @param {Number} hour 
     * @param {Number} minute 
     * @param {Number} second 
     * @param {Number} tenths 
     */
    set(hour:number, minute:number, second:number, tenths:number) {
        if(this.state && this.state.status !== vars.Clock.Status.Running) {
            
            let stenths = this.state.tenths;
            if(hour > this.state.hour)
                stenths = tenths;
            else if(hour === this.state.hour && minute > this.state.minute)
                stenths = tenths;
            this.setState({
                hour:hour,
                minute:minute,
                second:second,
                tenths:stenths
            });
        }
    }

    stop() {
        this.setState({status:vars.Clock.Status.Stopped});
    }

    play() {
        this.setState({status:vars.Clock.Status.Running});
    }

    reset() {
        this.setState({status:vars.Clock.Status.Ready});
    }

    protected async setState(state:any) {
        if(this.store) {
            this.store.dispatch({
                type:Actions.SET_STATE,
                state:state
            });
        }
    }

    getState() {
        if(this.store !== undefined)
            return this.store.getState();
        return Object.assign({}, InitState);
    }

    getStore() :Store|undefined {
        return this.store;
    }

    subscribe(f:any) : Unsubscribe|null {
        if(this.store !== undefined) {
            try {
                this.store.subscribe(f);
            } catch(er) {

            }
        }
        return null;
    }
}

export default ClockController;