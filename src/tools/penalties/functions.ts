import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Penalty } from "tools/vars";

namespace Penalties {
    /**
     * Get penalty record.
     * @param id
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Penalties[`R-${id}`];

    /**
     * Get penalty records.
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Penalties);

    /**
     * Load penalty records
     * @returns 
     */
    export const Load = () : Promise<Penalty[]> => {
        return new Promise((res, rej) => {
            Data.LoadPenalties().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    };

    /**
     * Set penalty records
     * @param records 
     */
    export const Set = (records:Penalty[]) => MainController.SetPenalties(records);

    /**
     * Save penalty records.
     * @returns 
     */
    export const Save = () => Data.SavePenalties(GetRecords());

    /**
     * Update penalty records.
     * @param records 
     */
    export const Write = (records:Penalty[]) => MainController.WritePenalties(records);
}

export {Penalties};