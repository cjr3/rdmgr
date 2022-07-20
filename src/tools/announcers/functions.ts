import { MainController } from "tools/MainController"
import {__BaseRecord} from '../vars';

/**
 * Get an announcer record
 * @param index 
 * @returns 
 */
const Get = (index:1|2) : __BaseRecord|undefined => {
    if(index === 1)
        return MainController.GetState().Announcer1;
    else if(index === 2)
        return MainController.GetState().Announcer2;
    return undefined;
};

/**
 * Set the name of an anthem singer
 * @param name 
 * @param index 
 * @returns 
 */
const SetName = (name:string, index:1|2) => MainController.SetAnnouncer(name, index);

/**
 * Subscribe to changes to the main store.
 * @param f 
 * @returns 
 */
const Subscribe = (f:{():void}) => MainController.Subscribe(f);

const Announcers = {
    Get:Get,
    SetName:SetName,
    Subscribe:Subscribe
}

export {Announcers};