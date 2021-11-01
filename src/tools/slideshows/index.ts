import { SMainController, SlideshowCollection, Slideshow, SSlideshow } from "tools/vars";

const __Set = (state:SMainController, result:SlideshowCollection) : SMainController => {
    return {...state, Slideshows:result, UpdateTimeSlideshows:Date.now()};
}

namespace SlideshowRecords {

    /**
     * 
     * @param state 
     * @param ids 
     * @returns 
     */
    export const Remove = (state:SMainController, ids:number[]) : SMainController => {
        return Set(state, Object.values(state.Slideshows).filter(r => typeof(r.RecordID) === 'number' && ids.indexOf(r.RecordID) < 0));
    };
    
    /**
     * 
     * @param state 
     * @param records 
     * @returns 
     */
    export const Set = (state:SMainController, records:Slideshow[]) : SMainController => {
        const result:SlideshowCollection = {};
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
    export const Write = (state:SMainController, records:Slideshow[]) : SMainController => {
        const result = {...state.Slideshows};
        records.forEach(r => {
            if(r.RecordID) {
                result['R-' + r.RecordID] = {...result['R-' + r.RecordID], ...r}
            }
        });
        return __Set(state, result);
    };
}

namespace SlideshowState {
    export const Update = (state:SMainController, values:SSlideshow) : SMainController => {
        return {
            ...state,
            Slideshow:{
                ...state.Slideshow,
                ...values
            },
            UpdateTimeSlideshow:Date.now()
        }
    }
}

export {SlideshowRecords, SlideshowState};