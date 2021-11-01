import { MainController } from "tools/MainController"
import {__BaseRecord} from '../vars';

namespace Announcers {
    export const Get = (index:1|2) : __BaseRecord|undefined => {
        if(index === 1)
            return MainController.GetState().Announcer1;
        else if(index === 2)
            return MainController.GetState().Announcer2;
        return undefined;
    };

    export const SetName = (name:string, index:1|2) => MainController.SetAnnouncer(name, index);

    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);
}

export {Announcers};