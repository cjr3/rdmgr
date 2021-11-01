import { SMainController, Sponsor, SponsorCollection } from "tools/vars";

namespace SponsorRecords {
    const __Set = (state:SMainController, values:SponsorCollection) : SMainController => {
        return {...state, Sponsors:values, UpdateTimeSponsors:Date.now()}
    };

    /**
     * 
     * @param state 
     * @param ids 
     * @returns 
     */
     export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, Object.values(state.Sponsors).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:Sponsor[]) : SMainController => {
        const result:SponsorCollection = {};
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
    export const Write = (state:SMainController, records:Sponsor[]) : SMainController => {
        const result = {...state.Sponsors};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

export {SponsorRecords};