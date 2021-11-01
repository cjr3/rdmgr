import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Season } from "tools/vars";

namespace Seasons {
    /**
     * Get a record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Seasons[`R-${id}`];

    /**
     * Get records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Seasons);

    export const GetUpdateTime = () => MainController.GetState().UpdateTimeSeasons;

    /**
     * Load season records
     * @returns 
     */
    export const Load = () : Promise<Season[]> => {
        return new Promise((res, rej) => {
            Data.LoadSeasons().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    }

    /**
     * Save season records
     * @returns 
     */
    export const Save = () => Data.SaveSeasons(GetRecords());

    /**
     * Set season records
     * @param records 
     * @returns 
     */
    export const Set = (records:Season[]) => MainController.SetSeasons(records);

    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Create/update season records
     * @param records 
     * @returns 
     */
    export const Write = (records:Season[]) => MainController.WriteSeasons(records);
}

export {Seasons};