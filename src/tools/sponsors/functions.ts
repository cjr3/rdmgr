import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Sponsor } from "tools/vars";

namespace Sponsors {
    /**
     * Get slideshow record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Sponsors[`R-${id}`];

    /**
     * Get slideshow records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Sponsors);

    /**
     * Load slideshow records
     * @returns 
     */
    export const Load = () : Promise<Sponsor[]> => {
        return new Promise((res, rej) => {
            Data.LoadSponsors().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    }

    /**
     * Save slideshow records
     * @returns 
     */
    export const Save = () => Data.SaveSponsors(GetRecords());

    /**
     * Set slideshow records
     * @param records 
     * @returns 
     */
    export const Set = (records:Sponsor[]) => MainController.SetSponsors(records);

    /**
     * Create/update slideshow records.
     * @param records 
     * @returns 
     */
    export const Write = (records:Sponsor[]) => MainController.WriteSponsors(records);
}

export {Sponsors};