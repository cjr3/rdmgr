import {createStore} from 'redux'

const SET_STATE = 'SET_STATE';
const ADD_SKATER = 'ADD_SKATER';
const REMOVE_SKATER = 'REMOVE_SKATER';
const UPDATE_SKATER = 'UPDATE_SKATER';

const InitState = {
    Skaters:[]
};

function PenaltyReducer(state = InitState, action) {
    var skaters = null;
    switch(action.type) {
        case SET_STATE :
            return Object.assign({}, state, action.values);

        case ADD_SKATER :
            if(state.Skaters[action.Record.RecordID])
                return state;
            skaters = state.Skaters.splice();
            skaters[action.Record.RecordID] = action.Record;
            return Object.assign({}, state, {Skaters:skaters});

        case REMOVE_SKATER :
            if(state.Skaters[action.RecordID]) {
                skaters = state.Skaters.splice();
                delete skaters[action.RecordID];
                return Object.assign({}, state, {Skaters:skaters});
            }
            return state;

        case UPDATE_SKATER :
            if(!state.Skaters[action.RecordID])
                return state;
            skaters = state.Skaters.splice();
            skaters[action.RecordID].Penalties = action.Penalties;
            return Object.assign({}, state, {Skaters:skaters});

        default :
            return state;
    }
}

const PenaltyStore = createStore(PenaltyReducer);

const PenaltyController = {
    Key:'PT',
    SetState(state) {
        PenaltyController.getStore().dispatch({
            type:SET_STATE,
            values:state
        });
    },

    Add(record) {
        PenaltyController.getStore().dispatch({
            type:ADD_SKATER,
            Record:record
        });
    },

    Remove(id) {
        PenaltyController.getStore().dispatch({
            type:REMOVE_SKATER,
            RecordID:id
        });
    },

    Update(id, penalties) {
        PenaltyController.getStore().dispatch({
            type:REMOVE_SKATER,
            RecordID:id,
            Penalties:penalties
        });
    },

    Clear() {
        PenaltyController.getStore().dispatch({
            type:SET_STATE,
            values:{Skaters:[]}
        });
    },

    SetSkaters(records) {
        PenaltyController.getStore().dispatch({
            type:SET_STATE,
            values:{Skaters:records}
        });
    },

    getState() {
        return PenaltyStore.getState();
    },

    getStore() {
        return PenaltyStore;
    },

    subscribe(f) {
        return PenaltyStore.subscribe(f);
    }
};

export default PenaltyController;