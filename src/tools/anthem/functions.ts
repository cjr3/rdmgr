import Data from "tools/data";
import { MainController } from "tools/MainController";
import { AnthemSinger, SAnthem } from "tools/vars";

namespace Anthem {
    /**
     * Get current state.
     * @returns 
     */
    export const Get = () => MainController.GetState().Anthem;

    /**
     * Initialize anthem state.
     * - Start save state listener
     */
    export const Init = () : Promise<boolean> => {
        return new Promise((res) => {
            Load().then().catch().finally(() => {
                let lastState = Get();
                let saving = false;
                setInterval(() => {
                    const state = Get();
                    if(!saving && lastState !== state) {
                        lastState = state;
                        saving = true;
                        Data.SaveAnthem(state).then().catch().finally(() => { saving = false; });
                    }
                }, 1000);
                return res(true);
            });
        })
    };

    /**
     * Load anthem state.
     * @returns 
     */
    export const Load = () : Promise<SAnthem> => {
        return new Promise((res, rej) => {
            Data.LoadAnthem().then(state => {
                Update(state);
                return res(state);
            }).catch(er => rej(er));
        });
    };

    /**
     * Reset state.
     */
    export const Reset = () => Update({Singer:undefined});

    /**
     * Subscribe to changes to the state
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Update state
     * @param state 
     * @returns 
     */
    export const Update = (state:SAnthem) => MainController.UpdateAnthemState(state);
};

namespace AnthemSingers {
    /**
     * Get anthem singer record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().AnthemSingers[`R-${id}`];

    /**
     * Get anthem singer records.
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().AnthemSingers);

    /**
     * Load anthem singer records
     * @returns 
     */
    export const Load = () : Promise<AnthemSinger[]> => {
        return new Promise((res, rej) => {
            Data.LoadAnthemSingers().then(records => {
                MainController.SetAnthemSingers(records);
                return res(records);
            }).catch(er => rej(er));
        });
    };

    /**
     * Remove anthem singer records.
     * @param records 
     * @returns 
     */
    export const Remove = (records:number[]) => MainController.RemoveAnthemSingers(records);

    /**
     * Save anthem singer records
     * @returns 
     */
    export const Save = () => Data.SaveAnthemSingers(GetRecords());

    /**
     * Set anthem singer records
     * @param records 
     * @returns 
     */
    export const Set = (records:AnthemSinger[]) => MainController.SetAnthemSingers(records);

    /**
     * Create/update anthem singer records.
     * @param records 
     * @returns 
     */
    export const Write = (records:AnthemSinger[]) => MainController.WriteAnthemSingers(records);
}

export {Anthem, AnthemSingers};