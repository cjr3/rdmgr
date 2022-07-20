import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Season } from "tools/vars";

/**
 * Get a record
 * @returns 
 */
const Get = (id?:number|null) => MainController.GetState().Seasons[`R-${id}`];

/**
 * Get records
 * @returns 
 */
const GetRecords = () => Object.values(MainController.GetState().Seasons);

const GetUpdateTime = () => MainController.GetState().UpdateTimeSeasons;

/**
 * Load season records
 * @returns 
 */
const Load = async () : Promise<Season[]> => {
    const records = await Data.LoadSeasons();
    if(Array.isArray(records))
        Set(records);
    return records;
}

/**
 * Save season records
 * @returns 
 */
const Save = () => Data.SaveSeasons(GetRecords());

/**
 * Set season records
 * @param records 
 * @returns 
 */
const Set = (records:Season[]) => MainController.SetSeasons(records);

const Subscribe = (f:{():void}) => MainController.Subscribe(f);

/**
 * Create/update season records
 * @param records 
 * @returns 
 */
const Write = (records:Season[]) => MainController.WriteSeasons(records);

const Seasons = {
    Get:Get,
    GetRecords:GetRecords,
    GetUpdateTime:GetUpdateTime,
    Load:Load,
    Save:Save,
    Set:Set,
    Subscribe:Subscribe,
    Write:Write
};

export {Seasons};