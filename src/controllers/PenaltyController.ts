import {SkaterRecord, PenaltyRecord} from 'tools/vars';
import { IController } from './vars';
import { CreateController, BaseReducer } from './functions.controllers';
import SkatersController from './SkatersController';

export type Sides = 'A' | 'B';

interface IPenaltyController extends IController {
    Add:Function;
    Remove:Function;
    Update:{(record:SkaterRecord,records:Array<PenaltyRecord>)};
    Clear:Function;
    SetSkaters:Function;
    SetCurrentSkater:{(record:SkaterRecord|null)};
    updateSkaters:Function;
}

enum Actions {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
    CLEAR = 'CLEAR',
    SET = 'SET',
    SET_CURRENT_SKATER = 'SET_CURRENT_SKATER',
    UPDATE_SKATERS = 'UPDATE_SKATERS'
};

export interface SPenaltyController {
    Skaters:Array<SkaterRecord>;
    Skater:SkaterRecord|null;
}

export const InitState:SPenaltyController = {
    Skaters:new Array<SkaterRecord>(),
    Skater:null
};

const GetSkaterIndex = (records:Array<SkaterRecord>, record:SkaterRecord) : number => {
    if(records.length <= 0)
        return 0;
    return records.findIndex(s => s.RecordID == record.RecordID);
};

const AddSkater = (state:SPenaltyController, record:SkaterRecord) => {
    let records:Array<SkaterRecord> = state.Skaters;
    if(GetSkaterIndex(records, record) >= 0)
        return state;
    return {...state, Skaters:[...records, record]};
};

const RemoveSkater = (state:SPenaltyController, id:number) => {
    let records:Array<SkaterRecord> = state.Skaters;
    let index:number = records.findIndex(r => r.RecordID == id);
    if(index < 0)
        return state;
    if(state.Skater && state.Skater.RecordID == id) {
        return {
            ...state,
            Skaters:records.filter(r => r.RecordID != id),
            Skater:null
        }
    }
    return {...state, Skaters:records.filter(r => r.RecordID != id)};
};

const UpdateSkater = (state:SPenaltyController, record:SkaterRecord, penalties:Array<PenaltyRecord>) => {
    if(penalties.length <= 0)
        return RemoveSkater(state, record.RecordID);
    let skaters:Array<SkaterRecord> = state.Skaters.slice();
    let index:number = skaters.findIndex(r => r.RecordID == record.RecordID);
    if(index < 0) {
        skaters.push({
            ...record,
            Penalties:penalties
        });
    } else {
        skaters[index].Penalties = penalties;
    }

    if(state.Skater && state.Skater.RecordID == record.RecordID) {
        return {
            ...state,
            Skaters:skaters,
            Skater:{
                ...state.Skater,
                Penalties:penalties
            }
        }
    }

    return {...state, Skaters:skaters};
};

/**
 * Updates skater details from the SkaterController
 * @param state 
 * @param records 
 */
const UpdateSkaters = (state:SPenaltyController, records:Array<SkaterRecord>) => {
    if(state.Skaters.length <= 0 || records.length <= 0)
        return state;
    let skaters:Array<SkaterRecord> = state.Skaters.slice();
    let cskater:SkaterRecord|null = state.Skater;
    if(cskater)
        cskater = {...cskater};
    skaters.forEach((skater, index) => {
        let rindex:number = records.findIndex(r => r.RecordID == skater.RecordID);
        if(rindex >= 0) {
            //let penalties = skater.Penalties;
            //let position = skater.Position;
            skaters[index] = {
                ...skaters[index],
                ...records[rindex],
                Penalties:skaters[index].Penalties,
                Position:skaters[index].Position
            }

            if(cskater && skater.RecordID == cskater.RecordID) {
                cskater.Penalties = skaters[index].Penalties;
            }
        }
    });
    return {...state, Skaters:skaters, Skater:cskater};
};

const ClearSkaters = (state:SPenaltyController) => {
    return {
        ...state, 
        Skaters:new Array<SkaterRecord>(),
        Skater:null
    };
};

const SetSkaters = (state:SPenaltyController, records:Array<SkaterRecord>) => {
    return {...state, Skaters:records};
};

const SetCurrentSkater = (state:SPenaltyController, record:SkaterRecord|null) => {
    if(record) {
        if(state.Skater && state.Skater.RecordID == record.RecordID) {}
        else {
            return {...state, Skater:{...record}};
        }
    }
    return {...state, Skater:null};
};

const PenaltyReducer = (state:SPenaltyController = InitState, action) => {
    try {
        switch(action.type) {
            case Actions.ADD :
                return AddSkater(state, action.record);
            case Actions.REMOVE :
                return RemoveSkater(state, action.id);
            case Actions.UPDATE :
                return UpdateSkater(state, action.record, action.records);
            case Actions.UPDATE_SKATERS :
                return UpdateSkaters(state, action.records);
            case Actions.CLEAR :
                return ClearSkaters(state);
            case Actions.SET :
                return SetSkaters(state, action.records);
            case Actions.SET_CURRENT_SKATER :
                return SetCurrentSkater(state, action.record);
            default :
                return BaseReducer(state, action);
        }
    } catch(er) {
        return state;
    }
}

const PenaltyController:IPenaltyController = CreateController('PT', PenaltyReducer);

PenaltyController.Add = async (record:SkaterRecord) => {
    PenaltyController.Dispatch({
        type:Actions.ADD,
        record:record
    });
};

PenaltyController.Remove = async (id:number) => {
    PenaltyController.Dispatch({
        type:Actions.REMOVE,
        id:id
    });
};
PenaltyController.Update = async (record:SkaterRecord, records:Array<PenaltyRecord>) => {
    PenaltyController.Dispatch({
        type:Actions.UPDATE,
        record:record,
        records:records
    });
};
PenaltyController.Clear = () => {
    PenaltyController.Dispatch({
        type:Actions.CLEAR
    });
};

PenaltyController.SetSkaters = (records:Array<SkaterRecord>) => {
    PenaltyController.Dispatch({
        type:Actions.SET,
        records:records
    });
};

PenaltyController.SetCurrentSkater = (record:SkaterRecord|null) => {
    PenaltyController.Dispatch({
        type:Actions.SET_CURRENT_SKATER,
        record:record
    });
};

PenaltyController.updateSkaters = SkatersController.Subscribe(() => {
    PenaltyController.Dispatch({
        type:Actions.UPDATE_SKATERS,
        records:SkatersController.Get()
    });
});

export default PenaltyController;