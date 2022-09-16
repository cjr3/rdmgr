import Data from "tools/data";
import { MainController } from "tools/MainController";
import { ClockStatus, SClock } from "tools/vars";
import {GameClock} from '../scoreboard/gameclock'

/**
 * Get state of current clocks
 * @returns 
 */
const GetState = () : SClock => MainController.GetClockState();

/**
 * Initialize clock stuff.
 * - Save listener.
 */
const Init = async () : Promise<boolean> => {
    try {
        await Load();
        let lastState = GetState();
        let saving = false;
        setInterval(async () => {
            const state = GetState();
            if(!saving && lastState !== state) {
                saving = true;
                lastState = state;
                try {
                    await Data.SaveClocks(state);
                } catch(er) {

                } finally {
                    saving = false;
                }
            }
        }, 5000);
    } catch(er) {

    }

    return true;
};

/**
 * Load the game clock state from disk.
 */
const Load = async () => {
    try {
        const state = await Data.LoadClock();
        // console.log(state);
        if(state) {
            MainController.UpdateClockState({
                GameHour:state.GameHour || 0,
                GameMinute:state.GameMinute || 0,
                GameSecond:state.GameSecond || 0,
                JamStatus:ClockStatus.STOPPED,
                GameStatus:ClockStatus.STOPPED,
                BreakStatus:ClockStatus.STOPPED
            });

            GameClock.set(state.GameHour || 0, state.GameMinute || 0, state.GameSecond || 0, 0);
        }
    } catch(er) {

    }
};

/**
 * Subscribe to changes to the clocks
 */
const Subscribe = (f:{():void}) => MainController.SubscribeClocks(f);

const Clocks = {
    GetState:GetState,
    Init:Init,
    Load:Load,
    Subscribe:Subscribe
};

export {Clocks};