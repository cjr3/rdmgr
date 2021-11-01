import { SMainController, Phase } from "tools/vars";

const __Set = (state:SMainController, result:Phase[]) : SMainController => {
    return {...state, Phases:result, UpdateTimePhases:Date.now()};
}

namespace PhaseRecords {
    /**
     * 
     * @param state 
     * @param ids 
     * @returns 
     */
    export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, state.Phases.filter(r => typeof(r.RecordID) === 'number' &&  ids.indexOf(r.RecordID) < 0));
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:Phase[]) : SMainController => {
        return __Set(state, records);
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Write = (state:SMainController, records:Phase[]) : SMainController => {
        const result = state.Phases.slice();
        records.forEach(phase => {
            const index = result.findIndex(r => r.RecordID === phase.RecordID);
            if(index >= 0) {
                result[index] = {...result[index], ...phase}
            } else {
                result.push(phase);
            }
        });
        return __Set(state, result);
    };
}

export {PhaseRecords};