import Data from "tools/data";
import { MainController } from "tools/MainController";
import { AnthemSinger, SAnthem } from "tools/vars";

/**
 * Get anthem singer record
 * @returns 
 */
 const GetRecord = (id?:number|null) => MainController.GetState().AnthemSingers[`R-${id}`];

/**
 * Get anthem singer records.
 * @returns 
 */
const GetRecords = () => Object.values(MainController.GetState().AnthemSingers);

/**
 * Get current state.
 * @returns 
 */
const GetState = () => MainController.GetState().Anthem;

/**
 * Initialize anthem state.
 * - Start save state listener
 */
const InitState = async () : Promise<boolean> => {
    try {
        await LoadState();
        let lastState = GetState();
        let saving = false;
        setInterval(async () => {
            const state = GetState();
            if(!saving && lastState !== state) {
                lastState = state;
                saving = true;
                try {
                    await Data.SaveAnthem(state);
                } catch(er) {

                } finally {
                    saving = false;
                }
            }
        }, 1000);
    } catch(er) {

    }

    return true;
};

/**
 * Load anthem state.
 * @returns 
 */
const LoadState = async () : Promise<SAnthem> => {
    try {
        const state = await Data.LoadAnthem();
        UpdateState(state);
        return state;
    } catch(er) {
        throw er;
    }
};

/**
 * Reset state.
 */
const ResetState = () => UpdateState({Singer:undefined});

/**
 * Subscribe to changes to the state
 * @param f 
 * @returns 
 */
const SubscribeState = (f:{():void}) => MainController.Subscribe(f);

/**
 * Update state
 * @param state 
 * @returns 
 */
const UpdateState = (state:SAnthem) => MainController.UpdateAnthemState(state);

/**
 * Load anthem singer records
 * @returns 
 */
const LoadRecords = async () : Promise<AnthemSinger[]> => {
    try {
        const records = await Data.LoadAnthemSingers();
        if(Array.isArray(records))
            SetRecords(records);
        return records;
    } catch(er) {
        throw er;
    }
};

/**
 * Remove anthem singer records.
 * @param records 
 * @returns 
 */
const RemoveRecord = (records:number[]) => MainController.RemoveAnthemSingers(records);

/**
 * Save anthem singer records
 * @returns 
 */
const SaveRecords = () => Data.SaveAnthemSingers(GetRecords());

/**
 * Set anthem singer records
 * @param records 
 * @returns 
 */
const SetRecords = (records:AnthemSinger[]) => MainController.SetAnthemSingers(records);

/**
 * Create/update anthem singer records.
 * @param records 
 * @returns 
 */
const WriteRecords = (records:AnthemSinger[]) => MainController.WriteAnthemSingers(records);

const Anthem = {
    Get:GetState,
    Init:InitState,
    Load:LoadState,
    Reset:ResetState,
    Subscribe:SubscribeState,
    Update:UpdateState
}

const AnthemSingers = {
    Get:GetRecord,
    GetRecords:GetRecords,
    Load:LoadRecords,
    Remove:RemoveRecord,
    Save:SaveRecords,
    Set:SetRecords,
    Write:WriteRecords
}

export {Anthem, AnthemSingers};