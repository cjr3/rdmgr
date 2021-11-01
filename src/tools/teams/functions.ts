import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Skater, Team } from "tools/vars";

namespace Teams {
    /**
     * Get team record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Teams[`R-${id}`];

    /**
     * Get team records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Teams);

    /**
     * Get skaters for a specific team.
     * @param id 
     * @returns 
     */
    export const GetSkaters = (id?:number|null) : Skater[] => {
        return Object.values(MainController.GetState().Skaters).filter(s => s.Teams && s.Teams.findIndex(st => st.TeamID === id) > 0)
    };

    /**
     * Load team records
     * @returns 
     */
    export const Load = () : Promise<Team[]> => {
        return new Promise((res, rej) => {
            Data.LoadTeams().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    }

    /**
     * Save teams
     * @returns 
     */
    export const Save = () => Data.SaveTeams(GetRecords());

    /**
     * Set teams
     * @param records 
     * @returns 
     */
    export const Set = (records:Team[]) => MainController.SetTeams(records);

    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Create/update teams
     * @param records 
     * @returns 
     */
    export const Write = (records:Team[]) => MainController.WriteTeams(records);
}

export {Teams};