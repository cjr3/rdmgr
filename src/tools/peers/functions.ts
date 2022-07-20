import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Peer } from "tools/vars";

/**
 * Get a specific peer record
 * @param id 
 * @returns 
 */
const Get = (id?:number|null) => MainController.GetState().Peers[`R-${id}`];

/**
 * Get peer records
 * @returns 
 */
const GetRecords = () => Object.values(MainController.GetState().Peers);

/**
 * Load peer records
 * @returns 
 */
const Load = async () : Promise<Peer[]> => {
    try {
        const records = Data.LoadPeers();
        if(Array.isArray(records))
            Set(records);
        return records;
    } catch(er) {
        throw er;
    }
};

/**
 * Save peer records
 * @returns 
 */
const Save = () => Data.SavePeers(GetRecords());

/**
 * Set peer records
 * @param records 
 * @returns 
 */
const Set = (records:Peer[]) => MainController.SetPeers(records);

/**
 * Write records to the main store.
 * @param records 
 * @returns 
 */
const Write = (records:Peer[]) => MainController.WritePeers(records);

const Peers = {
    Get:Get,
    GetRecords:GetRecords,
    Load:Load,
    Save:Save,
    Set:Set,
    Write:Write
}

export {Peers};