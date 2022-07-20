import {SMainController, SkaterPenalty, SPenaltyTracker} from '../vars';

/**
 * Reset the penalty tracker.
 * Should be called when a jam finishes (not when it starts).
 * @param state 
 * @returns 
 */
export const Reset = (state:SMainController) : SMainController => {
    return {
        ...state,
        PenaltyTracker:{
            Skaters:[]
        },
        UpdateTimePenaltyTracker:Date.now()
    }
};

/**
 * Add/remove a penalty from a skater (and adds the skater to the penalty tracker if not already)
 * @param state 
 * @param skaterId 
 * @param penaltyId 
 */
export const TogglePenalty = (state:SMainController, skaterId:number, penaltyId:number) : SMainController => {
    if(skaterId <= 0 || penaltyId <= 0)
        return state;
    const skater = state.Skaters[`R-${skaterId}`];
    const penalty = state.Penalties[`R-${penaltyId}`];
    if(!skater || !penaltyId || !penalty.Code)
        return state;
    const records = state.PenaltyTracker.Skaters.slice();
    const index = records.findIndex(r => r.RecordID === skaterId);
    const jamNumber = state.Scoreboard.JamNumber || 0;
    if(index >= 0) {
        const record = records[index];
        record.JamNumber = jamNumber;
        const penalties = (record.Penalties || []).slice();
        const pindex = penalties.indexOf(penaltyId);
        if(pindex < 0) {
            penalties.push(penaltyId);
            records[index].Codes = (record.Codes || []);
            records[index].Codes?.push(penalty.Code);
        } else {
            penalties.splice(pindex, 1);
            records[index].Codes = (record.Codes || []).filter(c => c !== penalty.Code);
        }
        records[index].Penalties = penalties;
        records[index] = record;
    } else {
        const record:SkaterPenalty = {
            ...skater,
            JamNumber:jamNumber,
            Penalties:[penaltyId],
            Codes:[penalty.Code]
        }
        records.push(record);
    }

    return {
        ...state,
        PenaltyTracker:{
            ...state.PenaltyTracker,
            Skaters:records
        },
        UpdateTimePenaltyTracker:Date.now()
    };
};

/**
 * 
 * @param state 
 * @param skaterId 
 * @returns 
 */
export const ToggleSkater = (state:SMainController, skaterId:number) : SMainController => {
    const records = state.PenaltyTracker.Skaters.slice();
    const index = records.findIndex(r => r.RecordID === skaterId);
    if(index < 0) {
        records.push({
            JamNumber:state.Scoreboard.JamNumber || 0,
            Penalties:[],
            Codes:[],
            RecordID:skaterId
        })
    } else {
        records.splice(index, 1);
    }

    return {
        ...state,
        PenaltyTracker:{
            ...state.PenaltyTracker,
            Skaters:records
        },
        UpdateTimePenaltyTracker:Date.now()
    }
};
/**
 * Update the state of the penalty tracker.
 * @param state 
 * @param values 
 * @returns 
 */
export const UpdateState = (state:SMainController, values:SPenaltyTracker) : SMainController => {
    return {
        ...state,
        PenaltyTracker:{
            ...state.PenaltyTracker,
            ...values
        },
        UpdateTimePenaltyTracker:Date.now()
    }
};