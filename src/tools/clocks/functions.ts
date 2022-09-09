import { MainController } from "tools/MainController";
import { SClock } from "tools/vars";

/**
 * Get state of current clocks
 * @returns 
 */
const GetState = () : SClock => MainController.GetClockState();

/**
 * Subscribe to changes to the clocks
 */
const Subscribe = (f:{():void}) => MainController.SubscribeClocks(f);

const Clocks = {
    GetState:GetState,
    Subscribe:Subscribe
};

export {Clocks};