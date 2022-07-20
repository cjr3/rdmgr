import { SMainController, SeasonCollection, Season } from "tools/vars";

const __Set = (state:SMainController, result:SeasonCollection) : SMainController => {
    return {...state, Seasons:result, UpdateTimeSeasons:Date.now()};
}

/**
 * 
 * @param state 
 * @param ids 
 * @returns 
 */
export const Remove = (state:SMainController, ids:number[]) : SMainController => {
    return Set(state, Object.values(state.Seasons).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
};

/**
 * 
 * @param state 
 * @param records 
 * @returns 
 */
export const Set = (state:SMainController, records:Season[]) : SMainController => {
    const result:SeasonCollection = {};
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
export const Write = (state:SMainController, records:Season[]) : SMainController => {
    const result = {...state.Seasons};
    records.forEach(r => {
        if(r.RecordID) {
            result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
        }
    });
    return __Set(state, result);
};
