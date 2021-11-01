import { SMainController, Skater, SkaterCollection } from "tools/vars";

const __Set = (state:SMainController, result:SkaterCollection) : SMainController => {
    return {...state, Skaters:result, UpdateTimeSkaters:Date.now()};
}

namespace SkaterRecords {

    /**
     * 
     * @param state 
     * @param ids 
     * @returns 
     */
    export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, Object.values(state.Skaters).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:Skater[]) : SMainController => {
        const result:SkaterCollection = {};
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
    export const Write = (state:SMainController, records:Skater[]) : SMainController => {
        const result = {...state.Skaters};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

export {SkaterRecords};