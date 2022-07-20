import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Phase } from "tools/vars";

/**
 * Get a phase record
 * @param id 
 * @returns 
 */
const Get = (id?:number|null) => GetRecords().find(r => r.RecordID === id);

/**
 * Get phase records
 * @returns 
 */
const GetRecords = () => MainController.GetState().Phases;

/**
 * Load phase records
 * @returns 
 */
const Load = async () : Promise<Phase[]> => {
    const records = await Data.LoadPhases();
    if(Array.isArray(records))
        Set(records);
    return records;
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

const Phases = {
    Get:Get,
    GetRecords:GetRecords,
    Load:Load,
    Remove:Remove,
    Save:Save,
    Set:Set,
    Write:Write
}

export {Phases};