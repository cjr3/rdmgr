import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Skater, SkaterTeam } from "tools/vars";

namespace Skaters {
    /**
     * Get skater record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Skaters[`R-${id}`];

    /**
     * Get skater records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Skaters);

    /**
     * Get teams a skater is assigned to.
     * @param id 
     * @returns 
     */
    export const GetTeams = (id?:number|null) : SkaterTeam[] => Get(id)?.Teams || [];

    /**
     * Load skater records
     * @returns 
     */
    export const Load = () : Promise<Skater[]> => {
        return new Promise((res, rej) => {
            Data.LoadSkaters().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    }

    /**
     * Save skater records
     * @returns 
     */
    export const Save = () => Data.SaveSkaters(GetRecords());

    /**
     * Set skater records
     * @param records 
     * @returns 
     */
    export const Set = (records:Skater[]) => MainController.SetSkaters(records);

    /**
     * Create/update skater records
     * @param records 
     * @returns 
     */
    export const Write = (records:Skater[]) => MainController.WriteSkaters(records);
}

export {Skaters};