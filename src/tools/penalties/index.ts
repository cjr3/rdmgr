import { SMainController, PenaltyCollection, Penalty } from "tools/vars";

const __Set = (state:SMainController, result:PenaltyCollection) : SMainController => {
    return {...state, Penalties:result, UpdateTimePenalties:Date.now()};
}

/**
 * 
 * @param state 
 * @param ids 
 * @returns 
 */
export const Remove = (state:SMainController, ids:number[]) : SMainController => {
    return Set(state, Object.values(state.Penalties).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
};

/**
 * 
 * @param state 
 * @param records 
 * @returns 
 */
export const Set = (state:SMainController, records:Penalty[]) : SMainController => {
    const result:PenaltyCollection = {};
    records.forEach(r => {
        if(r.RecordID) {
            result['R-' + r.RecordID] = r;
        }
    });
    return __Set(state, result);
};

/**
 * 
 * @param state 
 * @param records 
 * @returns 
 */
export const Write = (state:SMainController, records:Penalty[]) : SMainController => {
    const result = {...state.Penalties};
    records.forEach(r => {
        if(r.RecordID) {
            result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
        }
    });
    return __Set(state, result);
};