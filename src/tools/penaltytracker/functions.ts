import Data from "tools/data";
import { MainController } from "tools/MainController";
import { SPenaltyTracker } from "tools/vars";

namespace PenaltyTracker {
    /**
     * Get current state.
     * @returns 
     */
    export const Get = () => MainController.GetState().PenaltyTracker;

    /**
     * Get the latest timestamp of changes relevant to the penalty tracker.
     * @returns 
     */
    export const GetUpdateTime = () : number => {
        const state = MainController.GetState();
        return Math.max(state.UpdateTimePenalties, state.UpdateTimePenaltyTracker, state.UpdateTimeSkaters, state.UpdateTimeRoster, state.UpdateTimeScoreboard);
    }

    /**
     * Initialize penalty tracker
     * - Start state saver.
     */
    export const Init = () : Promise<boolean> => {
        return new Promise((res) => {
            Load().then().catch().finally(() => {
                let lastState = Get();
                let saving = false;
                setInterval(() => {
                    const state = Get();
                    if(!saving && lastState !== state) {
                        saving = true;
                        lastState = state;
                        Data.SavePenaltyTracker(state).then().catch().finally(() => {
                            saving = false;
                        });
                    }
                }, 1000);
            });
            return res(true);
        });
    };

    /**
     * Load penalty tracker state.
     * @returns 
     */
    export const Load = () : Promise<SPenaltyTracker> => {
        return new Promise((res, rej) => {
            Data.LoadPenaltyTracker().then(state => {
                Update(state);
                return res(state);
            }).catch(er => rej(er));
        });
    }

    /**
     * 
     */
    export const Reset = () => {
        Update({Skaters:[]});
    };

    /**
     * 
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Toggle a penalty assessed to a skater.
     * @param skaterId 
     * @param penaltyId 
     * @returns 
     */
    export const ToggleSkaterPenalty = (skaterId:number, penaltyId:number) => MainController.ToggleSkaterPenalty(skaterId, penaltyId);

    /**
     * 
     * @param state 
     * @returns 
     */
    export const Update = (state:SPenaltyTracker) => MainController.UpdatePenaltyTrackerState(state);
};

export {PenaltyTracker};