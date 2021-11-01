import { SMainController, Video, VideoCollection } from "tools/vars";

const __Set = (state:SMainController, result:VideoCollection) : SMainController => {
    return {...state, Videos:result, UpdateTimeVideos:Date.now()};
};

namespace VideoRecords {

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
    export const Set = (state:SMainController, records:Video[]) : SMainController => {
        const result:VideoCollection = {};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = r;
            }
        });
        // console.log(result);
        return __Set(state, result);
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Write = (state:SMainController, records:Video[]) : SMainController => {
        const result = {...state.Videos};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

export {VideoRecords};