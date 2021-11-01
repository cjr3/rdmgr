import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Phase } from "tools/vars";

namespace Phases {
    /**
     * Get a phase record
     * @param id 
     * @returns 
     */
    export const Get = (id?:number|null) => GetRecords().find(r => r.RecordID === id);
    
    /**
     * Get phase records
     * @returns 
     */
    export const GetRecords = () => MainController.GetState().Phases;

    /**
     * Load phase records
     * @returns 
     */
    export const Load = () : Promise<Phase[]> => {
        return new Promise((res, rej) => {
            Data.LoadPhases().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    };

    /**
     * Remove phase records.
     * @param records 
     * @returns 
     */
    export const Remove = (records:number[]) => MainController.RemovePhases(records);

    /**
     * Save phase records
     * @returns 
     */
    export const Save = () => Data.SavePhases(GetRecords());

    /**
     * Set phase records
     * @param records 
     * @returns 
     */
    export const Set = (records:Phase[]) => MainController.SetPhases(records);

    /**
     * Create/update phase records.
     * @param records 
     * @returns 
     */
    export const Write = (records:Phase[]) => MainController.WritePhases(records);
}

export {Phases};