import { SMainController } from "tools/vars";

namespace AnnouncerRecords {
    /**
     * Set the name of an announcer
     * @param state Current state
     * @param name Name to display
     * @param index 1 or 2
     * @returns 
     */
    export const SetAnnouncer = (state:SMainController, name:string, index:1|2) : SMainController => {
        if(index === 1) {
            return {
                ...state,
                Announcer1:{
                    ...state.Announcer1,
                    Name:name
                },
                UpdateTimeAnnouncer:Date.now()
            }
        } else if(index === 2) {
            return {
                ...state,
                Announcer2:{
                    ...state.Announcer2,
                    Name:name
                },
                UpdateTimeAnnouncer:Date.now()
            }
        }

        return state;
    }
}

export {AnnouncerRecords};