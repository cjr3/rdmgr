import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Penalty } from "tools/vars";

/**
 * Get penalty record.
 * @param id
 * @returns 
 */
const Get = (id?:number|null) => MainController.GetState().Penalties[`R-${id}`];

/**
 * Get penalty records.
 * @returns 
 */
const GetRecords = () => Object.values(MainController.GetState().Penalties);

/**
 * Load penalty records
 * @returns 
 */
const Load = async () : Promise<Penalty[]> => {
    try {
        const records = await Data.LoadPenalties();
        if(Array.isArray(records))
            Set(records);
        return records;
    } catch(er) {
        throw er;
    }
};

/**
 * Set penalty records
 * @param records 
 */
const Set = (records:Penalty[]) => MainController.SetPenalties(records);

/**
 * Save penalty records.
 * @returns 
 */
const Save = () => Data.SavePenalties(GetRecords());

/**
 * Update penalty records.
 * @param records 
 */
const Write = (records:Penalty[]) => MainController.WritePenalties(records);

const Penalties = {
    Get:Get,
    GetRecords:GetRecords,
    Load:Load,
    Set:Set,
    Save:Save,
    Write:Write
};

export {Penalties};