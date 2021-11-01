import { SMainController, Team, TeamCollection } from "tools/vars";

const __Set = (state:SMainController, result:TeamCollection) : SMainController => {
    return {...state, Teams:result, UpdateTimeTeams:Date.now()};
};

namespace TeamRecords {

    /**
     * 
     * @param state 
     * @param ids 
     * @returns 
     */
    export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, Object.values(state.Teams).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:Team[]) : SMainController => {
        const result:TeamCollection = {};
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
    export const Write = (state:SMainController, records:Team[]) : SMainController => {
        const result = {...state.Teams};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

export {TeamRecords};