import Data from "tools/data";
import { MainController } from "tools/MainController";
import { SPenaltyTracker } from "tools/vars";

/**
 * Get current state.
 * @returns 
 */
const Get = () => MainController.GetState().PenaltyTracker;

/**
 * Get the latest timestamp of changes relevant to the penalty tracker.
 * @returns 
 */
const GetUpdateTime = () : number => {
    const state = MainController.GetState();
    return Math.max(state.UpdateTimePenalties, state.UpdateTimePenaltyTracker, state.UpdateTimeSkaters, state.UpdateTimeRoster, state.UpdateTimeScoreboard);
}

/**
 * Initialize penalty tracker
 * - Start state saver.
 */
const Init = async () : Promise<boolean> => {
    try {
        await Load();
        let lastState = Get();
        let saving = false;
        setInterval(async () => {
            const state = Get();
            if(!saving && lastState !== state) {
                saving = true;
                lastState = state;
                try {
                    await Data.SavePenaltyTracker(state);
                } catch(er) {

                } finally {
                    saving = false;
                }
            }
        }, 1000);
        return true;
    } catch(er) {
        return false;
    }
};

/**
 * Load penalty tracker state.
 * @returns 
 */
const Load = async () : Promise<SPenaltyTracker> => {
    const state = await Data.LoadPenaltyTracker();
    Update(state);
    return state;
}

/**
 * 
 */
const Reset = () => {
    Update({Skaters:[]});
};

/**
 * 
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => MainController.Subscribe(f);

/**
 * Toggle a penalty assessed to a skater.
 * @param skaterId 
 * @param penaltyId 
 * @returns 
 */
const ToggleSkaterPenalty = (skaterId:number, penaltyId:number) => MainController.ToggleSkaterPenalty(skaterId, penaltyId);

/**
 * 
 * @param state 
 * @returns 
 */
const Update = (state:SPenaltyTracker) => MainController.UpdatePenaltyTrackerState(state);

const PenaltyTracker = {
    Get:Get,
    GetUpdateTime:GetUpdateTime,
    Init:Init,
    Load:Load,
    Reset:Reset,
    Subscribe:Subscribe,
    ToggleSkaterPenalty:ToggleSkaterPenalty,
    Update:Update
}

export {PenaltyTracker};