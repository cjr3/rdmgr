import { SMainController, AnthemSinger, AnthemSingerCollection, SAnthem } from "tools/vars";

const __Set = (state:SMainController, result:AnthemSingerCollection) : SMainController => {
    return {...state, AnthemSingers:result, UpdateTimeAnthemSingers:Date.now()};
};

namespace AnthemState {
    /**
     * Update the national anthem state.
     * @param state 
     * @param values 
     * @returns 
     */
    export const UpdateState = (state:SMainController, values:SAnthem) : SMainController => {
        return {
            ...state,
            Anthem:{
                ...state.Anthem,
                ...values
            },
            UpdateTimeAnthem:Date.now()
        };
    };
};

namespace AnthemRecords {
    /**
     * Remove 
     * @param state 
     * @param ids 
     * @returns 
     */
    export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, Object.values(state.AnthemSingers).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
    };

    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:AnthemSinger[]) : SMainController => {
        const result:AnthemSingerCollection = {};
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
    export const Write = (state:SMainController, records:AnthemSinger[]) : SMainController => {
        const result = {...state.AnthemSingers};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

export {AnthemState, AnthemRecords};